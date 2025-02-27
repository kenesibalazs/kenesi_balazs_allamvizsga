import express from 'express';
import { verifySignatureController } from '../controllers/verifySignatureController';

const app = express.Router();

app.post('/verify-signature', verifySignatureController);

export default app;