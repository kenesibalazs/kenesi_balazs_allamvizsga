import express, { Request, Response } from 'express';
import crypto from 'crypto';

const app = express.Router();

app.use(express.json());

app.post('/verify-signature', (req: Request, res: Response) => {
    const { message, signature, publicKey } = req.body;

    if (!message || !signature || !publicKey) {
        return res.status(400).json({ message: 'Missing required parameters.' });
    }

    try {
        const publicKeyBuffer = Buffer.from(publicKey, 'base64');
        const publicKeyObject = crypto.createPublicKey({
            key: publicKeyBuffer,
            format: 'der',
            type: 'spki'
        });

        const signatureBuffer = Buffer.from(signature, 'base64');
        const messageBuffer = Buffer.from(message);

        // Convert Buffer to Uint8Array
        const signatureUint8Array = new Uint8Array(signatureBuffer);
        const messageUint8Array = new Uint8Array(messageBuffer);

        const verified = crypto.verify('SHA256', messageUint8Array, publicKeyObject, signatureUint8Array);

        if (verified) {
            res.json({ message: 'Signature verified successfully.' });
        } else {
            res.json({ message: 'Signature verification failed.' });
        }
    } catch (error: any) {
        console.error('Signature verification error:', error.message || error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

export default app;