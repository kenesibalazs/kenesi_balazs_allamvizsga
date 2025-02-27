import { Request, Response } from 'express';
import { verifySignature } from '../services/verifySignatureService';

export const verifySignatureController = (req: Request, res: Response) => {
    try {
        const { publicKey, message, signature } = req.body;

        if (!publicKey || !message || !signature) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        const isValid = verifySignature(publicKey, message, signature);

        return res.json({ valid: isValid });
    } catch (error) {
        console.error("Error in signature verification:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};