/*eslint-disable */
import { useState } from "react";
import { verifySignature } from "../api/verifySignature";

export const useVerifySignature = () => {
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const checkSignature = async (publicKey: string, message: string, signature: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await verifySignature(publicKey, message, signature);
            setIsValid(result.valid);
        } catch (err) {
            setError("Failed to verify signature");
        } finally {
            setLoading(false);
        }
    };

    return { isValid, loading, error, checkSignature };
};