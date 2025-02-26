import ExpoModulesCore
import Security
import Foundation

public class MyModule: Module {
    public func definition() -> ModuleDefinition {
        Name("MyModule")

        AsyncFunction("generateKeyInSecureEnclave") { () -> String in
            return try self.generateKeyPair()
        }

        AsyncFunction("signMessage") { (message: String) -> String? in
            guard let messageData = message.data(using: .utf8) else {
                NSLog("❌ Failed to convert message to data")
                return nil
            }

            guard let privateKey = try self.retrievePrivateKey() else {
                return nil;
            }

            var error: Unmanaged<CFError>?
            guard let signatureData = SecKeyCreateSignature(privateKey, .ecdsaSignatureMessageX962SHA256, messageData as CFData, &error) as Data? else {
                NSLog("❌ Failed to create signature: \(error?.takeRetainedValue().localizedDescription ?? "Unknown error")")
                return nil
            }

            NSLog("✅ Message signed successfully")
            return signatureData.base64EncodedString()
        }
    }

    private let keyTag = "com.kenesibalazs.expoapp.secureenclavekey".data(using: .utf8)!

    private func generateKeyPair() throws -> String {
        NSLog("🔹 Generating key pair...")

        // Create access control
        var error: Unmanaged<CFError>?
        let access = SecAccessControlCreateWithFlags(
            kCFAllocatorDefault,
            kSecAttrAccessibleWhenUnlockedThisDeviceOnly, // Or other access flags
            .userPresence, // Or other flags
            &error
        )

        if let accessError = error?.takeRetainedValue() {
            NSLog("❌ Error creating access control: \(accessError)")
            throw accessError as Error
        }

        let attributes: [String: Any] = [
            kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
            kSecAttrKeySizeInBits as String: 256,
            kSecAttrTokenID as String: kSecAttrTokenIDSecureEnclave,
            kSecPrivateKeyAttrs as String: [
                kSecAttrIsPermanent as String: true,
                kSecAttrApplicationTag as String: keyTag,
                kSecAttrAccessControl as String: access! // Add access control
            ],
            kSecPublicKeyAttrs as String: [
                kSecAttrIsPermanent as String: true,
                kSecAttrApplicationTag as String: keyTag
            ]
        ]

        guard let privateKey = SecKeyCreateRandomKey(attributes as CFDictionary, &error) else {
            NSLog("❌ Error creating private key: \(error!.takeRetainedValue())")
            throw error!.takeRetainedValue() as Error
        }

        NSLog("✅ Private key generated successfully")

        // Extract and return the public key in Base64 format
        guard let publicKeyBase64 = try exportPublicKeyDER(privateKey: privateKey) else {
            throw NSError(domain: "KeyExport", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to extract public key"])
        }

        return publicKeyBase64
    }

    private func exportPublicKeyDER(privateKey: SecKey) throws -> String? {
        guard let publicKey = SecKeyCopyPublicKey(privateKey) else {
            NSLog("❌ Failed to retrieve public key")
            return nil
        }

        var error: Unmanaged<CFError>?
        guard let publicKeyData = SecKeyCopyExternalRepresentation(publicKey, &error) as Data? else {
            NSLog("❌ Failed to export public key: \(error?.takeRetainedValue().localizedDescription ?? "Unknown error")")
            return nil
        }

        NSLog("✅ Public key successfully extracted and encoded")
        return publicKeyData.base64EncodedString()
    }

    private func retrievePrivateKey() throws -> SecKey? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassKey,
            kSecAttrApplicationTag as String: keyTag,
            kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
            kSecReturnRef as String: true
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        if status == errSecSuccess {
            let privateKey = item as! SecKey
            return privateKey
        } else {
            NSLog("retrievePrivateKey: ❌ Failed to retrieve private key: \(status)")
            return nil;
        }
    }
}