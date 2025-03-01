package expo.modules.mymodule

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

import expo.modules.kotlin.modules.ModuleDefinition
import java.security.KeyFactory
import java.security.KeyPairGenerator
import java.security.Signature
import java.security.spec.X509EncodedKeySpec
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import java.security.KeyStore
import java.nio.ByteBuffer
import java.math.BigInteger

class MyModule : Module() {

  private val KEY_ALIAS = "com.kenesibalazs.expoapp.keystorekey"
  private val ANDROID_KEYSTORE = "AndroidKeyStore"

  override fun definition() = ModuleDefinition {
    Name("MyModule")

    AsyncFunction("generateKeyInSecureEnclave") {
      generateKeyPair()
    }

    AsyncFunction("signMessage") { message: String ->
      signMessage(message)
    }
  }

  private fun generateKeyPair(): String {
    val keyPairGenerator = KeyPairGenerator.getInstance(KeyProperties.KEY_ALGORITHM_EC, ANDROID_KEYSTORE)
    val keyGenParameterSpec = KeyGenParameterSpec.Builder(
      KEY_ALIAS,
      KeyProperties.PURPOSE_SIGN or KeyProperties.PURPOSE_VERIFY
    )
      .setAlgorithmParameterSpec(java.security.spec.ECGenParameterSpec("secp256r1"))
      .setDigests(KeyProperties.DIGEST_SHA256)
      .setUserAuthenticationRequired(false)
      .build()

    keyPairGenerator.initialize(keyGenParameterSpec)
    val keyPair = keyPairGenerator.generateKeyPair()

    val publicKey = keyPair.public.encoded
    return Base64.encodeToString(publicKey, Base64.NO_WRAP)
  }

  private fun signMessage(message: String): String? {
    val privateKey = getPrivateKey() ?: return null
    val signature = Signature.getInstance("SHA256withECDSA")
    signature.initSign(privateKey)
    signature.update(message.toByteArray())

    val derSignature = signature.sign()

    // Convert DER signature to (r, s) raw format
    val rawSignature = derToRawSignature(derSignature)

    return Base64.encodeToString(rawSignature, Base64.NO_WRAP)
  }

  private fun getPrivateKey(): java.security.PrivateKey? {
    val keyStore = KeyStore.getInstance(ANDROID_KEYSTORE)
    keyStore.load(null)
    val entry = keyStore.getEntry(KEY_ALIAS, null) as? KeyStore.PrivateKeyEntry
    return entry?.privateKey
  }

  private fun derToRawSignature(derSignature: ByteArray): ByteArray {
    // DER-encoded signature starts with 0x30
    if (derSignature[0] != 0x30.toByte()) throw IllegalArgumentException("Invalid DER signature format")

    var index = 2
    val rLength = derSignature[index + 1].toInt()
    var r = derSignature.copyOfRange(index + 2, index + 2 + rLength)

    index += 2 + rLength
    val sLength = derSignature[index + 1].toInt()
    var s = derSignature.copyOfRange(index + 2, index + 2 + sLength)

    // Ensure r and s are always 32 bytes long
    r = ensureFixedLength(r, 32)
    s = ensureFixedLength(s, 32)

    return r + s // Concatenate r and s
  }

  private fun ensureFixedLength(value: ByteArray, length: Int): ByteArray {
    return if (value.size == length) {
      value
    } else {
      // Remove leading zeroes if necessary
      val offset = if (value[0] == 0x00.toByte()) 1 else 0
      value.copyOfRange(offset, offset + length)
    }
  }
}
