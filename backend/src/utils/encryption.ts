import crypto from "crypto";

const publicKey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzB0y0J0I+eUyQYPb7PQ7\nRfI2VDB3l5P6eGRbp0pU2XzRbKr6tOlQy3cxzA0cROv1okNx7dwM26tX0t2V6W1T\nRl+HgkxxjTZrxlE4n+33e02of5Olk0YklgZAMalQIenZp6Vu5X9q6Obep5r29tgh\n9TSPicUGMIgdFqqBo13yH7uN7b6c6O6ddqkQEZPjPtvptq2d6b3Yw1h+RZ0OPBlF\n1hPYUK8HtqtdXykQFgfZZzqTZrg0EgjwmvRej3thZovDgs4WqAl5aS6UuFgfI6km\nuZFP4nOHuHb6MbrFYVuYAmB+qFhXofjTskF12l4ncdvUNRl2kpyDT+USXJkQFvEa\n3wIDAQAB\n-----END PUBLIC KEY-----';

export const encryptNfcCode = (nfcCode: string): string => {
    const buffer = Buffer.from(nfcCode, "utf-8");
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString("base64"); 
};