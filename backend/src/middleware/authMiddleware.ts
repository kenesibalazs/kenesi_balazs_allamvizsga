import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';

// Define the decoded token payload type
interface JwtPayload extends jwt.JwtPayload {
  id: string;
  name: string;
  neptunCode: string;
  type: string;
  universityId: string;
  majors: string[];
  groups: string[];
}

// Extend Request interface to include the user property
interface AuthenticatedRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Check for token in Authorization header
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

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    // Find the user by ID
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({ message: 'The user belonging to this token does no longer exist.' });
    }

    // Attach the user to the request object
    req.user = currentUser;

    // Optional: Limit the user object to only necessary fields
    // req.user = {
    //   id: currentUser._id,
    //   name: currentUser.name,
    //   // add other fields as needed
    // };

    next();
  } catch (err) {
    console.error('Authentication error:', err); // For debugging
    res.status(401).json({ message: 'Invalid token or token expired.' });
  }
};
