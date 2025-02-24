import ExpoModulesCore

public class MyModule: Module {
 
  public func definition() -> ModuleDefinition {
    Name("MyModule")

    Constants([
      "PI": Double.pi
    ])

    Events("onChange")

    Function("hello") {
      return "Hello world! 👋"
    }

    AsyncFunction("setValueAsync") { (value: String) in
      self.sendEvent("onChange", [
        "value": value
      ])
    }

  

    AsyncFunction("generateKeyInSecureEnclave") { () -> String? in
      return try await self.generateKeyPair()
    }

     AsyncFunction("signData") { (dataToSign: String) -> String? in
      return try await self.signData(dataToSign)
    }

  
}

  private func generateKeyPair() throws -> String? {
      
        let tag = "com.myapp.secureenclavekey".data(using: .utf8)!

        let attributes: [String: Any] = [
            kSecAttrKeyType as String: kSecAttrKeyTypeEC, 
            kSecAttrKeySizeInBits as String: 256,        
            kSecAttrTokenID as String: kSecAttrTokenIDSecureEnclave,
            kSecPrivateKeyAttrs as String: [
                kSecAttrIsPermanent as String: true,
                kSecAttrApplicationTag as String: tag 
            ]
        ]
        
        var error: Unmanaged<CFError>?
        
        guard let privateKey = SecKeyCreateRandomKey(attributes as CFDictionary, &error) else {
            throw error!.takeRetainedValue() as Error
        }

        guard let publicKey = SecKeyCopyPublicKey(privateKey) else {
            throw NSError(domain: "SecureEnclave", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to get public key"])
        }

        var publicKeyError: Unmanaged<CFError>?
        guard let publicKeyData = SecKeyCopyExternalRepresentation(publicKey, &publicKeyError) else {
            throw publicKeyError!.takeRetainedValue() as Error
        }

        let publicKeyBase64 = (publicKeyData as Data).base64EncodedString()

        print("🔐 Private Key stored securely in Secure Enclave (not accessible)")
        print("🔑 Public Key (Base64): \(publicKeyBase64)")

        return publicKeyBase64 
  } 

  private func signData(_ dataToSign: String) throws -> String? {
      let tag = "com.myapp.secureenclavekey".data(using: .utf8)!

      let query: [String: Any] = [
          kSecClass as String: kSecClassKey,
          kSecAttrApplicationTag as String: tag,
          kSecAttrKeyType as String: kSecAttrKeyTypeEC,
          kSecAttrTokenID as String: kSecAttrTokenIDSecureEnclave,
          kSecReturnRef as String: true
      ]
      
      var item: CFTypeRef?
      let status = SecItemCopyMatching(query as CFDictionary, &item)
      
      guard status == errSecSuccess else {
          throw NSError(domain: "SecureEnclave", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to find private key"])
      }

      guard let privateKey = item as? SecKey else {
          throw NSError(domain: "SecureEnclave", code: -1, userInfo: [NSLocalizedDescriptionKey: "Item is not a valid SecKey"])
      }

      let data = dataToSign.data(using: .utf8)!
      
      let algorithm = SecKeyAlgorithm.ecdsaSignatureMessageX962SHA256
      
      guard SecKeyIsAlgorithmSupported(privateKey, .sign, algorithm) else {
          throw NSError(domain: "SecureEnclave", code: -1, userInfo: [NSLocalizedDescriptionKey: "Algorithm not supported for signing"])
      }

      var error: Unmanaged<CFError>?
      guard let signature = SecKeyCreateSignature(privateKey, algorithm, data as CFData, &error) else {
          throw error!.takeRetainedValue() as Error
      }

      let signatureData = signature as Data
      return signatureData.base64EncodedString()
  }
  
}

