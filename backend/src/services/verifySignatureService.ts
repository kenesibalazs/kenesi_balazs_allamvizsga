import elliptic from 'elliptic';
import crypto from 'crypto';

const ec = new elliptic.ec('p256');

export const verifySignature = (publicKeyBase64: string, message: string, signatureBase64: string): boolean => {
    try {

        console.log("publicKeyBase64", publicKeyBase64);
        console.log("message", message);
        console.log("signatureBase64", signatureBase64);

        
        let publicKeyBuffer = Buffer.from(publicKeyBase64, 'base64');

        if (publicKeyBuffer.length === 64) {
            publicKeyBuffer = Buffer.concat([Buffer.from([0x04]), publicKeyBuffer]);
        }

        const publicKey = ec.keyFromPublic(publicKeyBuffer.toString('hex'), 'hex');
        const msgHash = crypto.createHash('sha256').update(message, 'utf8').digest();
        const signatureBuffer = Buffer.from(signatureBase64, 'base64');

        // Function to decode DER signature format if needed
        function decodeDERSignature(sigBuffer: Buffer) {
            if (sigBuffer[0] !== 0x30) throw new Error("Invalid DER signature format");
            let rLength = sigBuffer[3];
            let r = sigBuffer.slice(4, 4 + rLength);
            let s = sigBuffer.slice(6 + rLength);
            return { r: r.toString('hex'), s: s.toString('hex') };
        }

        let signature;
        if (signatureBuffer[0] === 0x30) {
            signature = decodeDERSignature(signatureBuffer);
        } else {
            signature = {
                r: signatureBuffer.slice(0, 32).toString('hex'),
                s: signatureBuffer.slice(32).toString('hex'),
            };
        }

        return publicKey.verify(msgHash, signature);
    } catch (error) {
        console.error("Error verifying signature:", error);
        return false;
    }
};