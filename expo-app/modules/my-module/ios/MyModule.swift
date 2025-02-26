import ExpoModulesCore
import Security
import Foundation

public class MyModule: Module {
    public func definition() -> ModuleDefinition {
        Name("MyModule")

        Events("onChange")

        AsyncFunction("generateKeyInSecureEnclave") { () -> String in
            return try self.generateKeyPair()
        }

        AsyncFunction("signDataWithSecureEnclave") { (dataToSign: String) -> String in
            return try self.signData(dataToSign: dataToSign)
        }
    }

    private let keyTag = "com.kenesibalazs.expoapp.secureenclavekey".data(using: .utf8)!

    private func generateKeyPair() throws -> String {
        NSLog("🔹 Generating key pair...")

        let attributes: [String: Any] = [
            kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
            kSecAttrKeySizeInBits as String: 256,
            kSecAttrTokenID as String: kSecAttrTokenIDSecureEnclave,
            kSecPrivateKeyAttrs as String: [
                kSecAttrIsPermanent as String: true,
                kSecAttrApplicationTag as String: keyTag
            ],
            kSecPublicKeyAttrs as String: [
                kSecAttrIsPermanent as String: true,
                kSecAttrApplicationTag as String: keyTag
            ]
        ]

        var error: Unmanaged<CFError>?
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

    private func getPrivateKeyFromSecureEnclave() throws -> SecKey? {
    let query: [String: Any] = [
        kSecClass as String: kSecClassKey,
        kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
        kSecAttrApplicationTag as String: keyTag,
        kSecAttrKeyClass as String: kSecAttrKeyClassPrivate,
        kSecAttrTokenID as String: kSecAttrTokenIDSecureEnclave,
        kSecReturnRef as String: true
    ]

    var item: CFTypeRef?
    let status = SecItemCopyMatching(query as CFDictionary, &item)

    if status == errSecSuccess, let itemValue = item {
        return itemValue as! SecKey
    } else {
        NSLog("❌ Failed to retrieve private key from Secure Enclave: \(status)")
        return nil
    }
}

    private func signData(dataToSign: String) throws -> String {
        guard let privateKey = try getPrivateKeyFromSecureEnclave() else {
            throw NSError(domain: "SecureEnclave", code: -1, userInfo: [NSLocalizedDescriptionKey: "Private key not found in Secure Enclave"])
        }

        guard let data = dataToSign.data(using: .utf8) else {
            throw NSError(domain: "DataConversion", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to convert data to UTF-8"])
        }

        var error: Unmanaged<CFError>?
        guard let signature = SecKeyCreateSignature(privateKey, .ecdsaSignatureDigestX962SHA256, data as CFData, &error) as Data? else {
            NSLog("❌ Failed to create signature: \(error?.takeRetainedValue().localizedDescription ?? "Unknown error")")
            throw error?.takeRetainedValue() as? Error ?? NSError(domain: "Signature", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to create signature"])
        }

        return signature.base64EncodedString()
    }
}