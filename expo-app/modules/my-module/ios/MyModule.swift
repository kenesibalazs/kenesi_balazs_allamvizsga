import ExpoModulesCore
import Security
import CryptoKit
import Foundation

public class MyModule: Module {
    public func definition() -> ModuleDefinition {
        Name("MyModule")

        AsyncFunction("generateKeyInSecureEnclave") { () -> String in
            return try self.generateKeyPair()
        }
        
        AsyncFunction("signMessage") { (message: String) -> String? in
                   NSLog("signMessage: Starting signing process for message: \(message)")

                   guard let messageData = message.data(using: .utf8) else {
                       NSLog("signMessage: ❌ Failed to convert message to data")
                       return nil
                   }
                   NSLog("signMessage: Message data created successfully.")

                   guard let privateKey = try self.retrievePrivateKey() else {
                       NSLog("signMessage: ❌ Failed to retrieve private key")
                       return nil;
                   }
                   NSLog("signMessage: Private key retrieved successfully.")

                   var error: Unmanaged<CFError>?
                   guard let signatureData = SecKeyCreateSignature(privateKey, .ecdsaSignatureMessageX962SHA256, messageData as CFData, &error) as Data? else {
                       if let errorValue = error?.takeRetainedValue() {
                           NSLog("signMessage: ❌ Failed to create signature: \(errorValue)")
                       } else {
                           NSLog("signMessage: ❌ Failed to create signature: Unknown error")
                       }
                       return nil
                   }
                   NSLog("signMessage: Signature created successfully.")

                   NSLog("signMessage: Message signed successfully")
                   return signatureData.base64EncodedString()
               }
    

    }

    private let keyTag = "com.kenesibalazs.expoapp.secureenclavekey".data(using: .utf8)!

    private func generateKeyPair() throws -> String {
        NSLog("🔹 Generating key pair...")

        var error: Unmanaged<CFError>?
        let access = SecAccessControlCreateWithFlags(
            kCFAllocatorDefault,
            kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
            .biometryCurrentSet,
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
                kSecAttrAccessControl as String: access!
            ]
        ]

        guard let privateKey = SecKeyCreateRandomKey(attributes as CFDictionary, &error) else {
            NSLog("❌ Error creating private key: \(error!.takeRetainedValue())")
            throw error!.takeRetainedValue() as Error
        }

        NSLog("✅ Private key generated successfully")
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

        NSLog("retrievePrivateKey: SecItemCopyMatching status: \(status)")

        if status == errSecSuccess {
            let privateKey = item as! SecKey
            NSLog("retrievePrivateKey: Private key retrieved successfully.")
            return privateKey
        } else {
            NSLog("retrievePrivateKey: ❌ Failed to retrieve private key: \(status)")
            return nil
        }
    }
}
