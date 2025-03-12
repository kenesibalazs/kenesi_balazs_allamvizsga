import elliptic from 'elliptic';
import crypto from 'crypto';

const ec = new elliptic.ec('p256'); // secp256r1 (prime256v1 in OpenSSL)

export const verifySignature = (publicKeyBase64: string, message: string, signatureBase64: string): boolean => {
    try {
        console.log("publicKeyBase64:", publicKeyBase64);
        console.log("message:", message);
        console.log("signatureBase64:", signatureBase64);

        let publicKeyBuffer = Buffer.from(publicKeyBase64, 'base64');

        if (publicKeyBuffer.length !== 65 || publicKeyBuffer[0] !== 0x04) {
            publicKeyBuffer = convertSpkiDerToRaw(publicKeyBuffer);
        }

        const publicKey = ec.keyFromPublic(publicKeyBuffer.toString('hex'), 'hex');

        const msgHash = crypto.createHash('sha256').update(message, 'utf8').digest();

        const signatureBuffer = Buffer.from(signatureBase64, 'base64');

        const signature = decodeSignature(signatureBuffer);

        const isValid = publicKey.verify(msgHash, signature);
        console.log("Signature valid:", isValid);
        return isValid;
    } catch (error) {
        console.error("Error verifying signature:", error);
        return false;
    }
};

/**
 * Converts an X.509 DER-encoded public key to raw uncompressed format (0x04 + X + Y).
 * @param {Buffer} der - DER-encoded public key
 * @returns {Buffer} - Uncompressed public key (0x04 + X + Y)
 */
function convertSpkiDerToRaw(der: Buffer): Buffer {
    if (der.length < 33) throw new Error("Invalid public key length");

    if (der[0] !== 0x30) throw new Error("Invalid DER format for public key");

    const rawKey = der.slice(-64);
    return Buffer.concat([Buffer.from([0x04]), rawKey]);
}

/**
 * Decodes a signature, handling both raw (r, s) and DER formats.
 * @param {Buffer} sigBuffer - Signature buffer
 * @returns {{ r: string, s: string }} - Parsed signature in hex
 */
function decodeSignature(sigBuffer: Buffer) {
    if (sigBuffer.length === 64) {
        return {
            r: sigBuffer.slice(0, 32).toString('hex'),
            s: sigBuffer.slice(32).toString('hex'),
        };
    } else if (sigBuffer[0] === 0x30) {
        let rLength = sigBuffer[3];
        let r = sigBuffer.slice(4, 4 + rLength);
        let s = sigBuffer.slice(6 + rLength);
        return { r: r.toString('hex'), s: s.toString('hex') };
    } else {
        throw new Error("Invalid signature format");
    }
}
