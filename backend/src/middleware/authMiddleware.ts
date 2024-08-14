import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface JwtPayload extends jwt.JwtPayload {
  id: string;
  name: string;
  neptunCode: string;
  type: string;
  universityId: string;
  majors: string[];
  groups: string[];
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    req.user = decoded;

    next();
  } catch (err) {
    console.error('Authentication error:', err); 
    res.status(401).json({ message: 'Invalid token or token expired.' });
  }
};