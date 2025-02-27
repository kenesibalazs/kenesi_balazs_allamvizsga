import { apiClient, getAuthHeaders } from "./client";

export const verifySignature = async (publicKey: string, message: string, signature: string) => {
    try {

        const response = await apiClient.post("/verify-signature",
            { publicKey, message, signature },
            { headers: await getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error("Error verifying signature:", error);
        return { message: "Error verifying signature", valid: false };
    }
};