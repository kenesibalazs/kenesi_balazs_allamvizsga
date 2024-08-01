// src/types/express-custom.d.ts

import { User } from '../models/userModel'; // Adjust the path if necessary

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Optional userId property
      user?: User; // Optional user property
    }
  }
}
