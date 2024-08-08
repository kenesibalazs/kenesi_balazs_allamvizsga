import User from "../models/userModel";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, neptunCode, password, passwordConfirm, universityId, type, majors, groups } = req.body;

    if (!name || !neptunCode || !password || !passwordConfirm || !universityId || !type) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findOne({ neptunCode });
    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = new User({
      universityId,
      type,
      name,
      password: hashedPassword,
      neptunCode,
      majors: majors || [],
      groups: groups || []
    });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    // Generate token with full user data
    const token = jwt.sign({
      id: newUser._id,
      name: newUser.name,
      neptunCode: newUser.neptunCode,
      type: newUser.type,
      universityId: newUser.universityId,
      majors: newUser.majors,
      groups: newUser.groups
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await newUser.save();

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        neptunCode: newUser.neptunCode,
        type: newUser.type,
        universityId: newUser.universityId,
        majors: newUser.majors,
        groups: newUser.groups
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { neptunCode, password } = req.body;

    const user = await User.findOne({ neptunCode });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await argon2.verify(user.password as string, password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    // Generate token with full user data
    const token = jwt.sign({
      id: user._id,
      name: user.name,
      neptunCode: user.neptunCode,
      type: user.type,
      universityId: user.universityId,
      majors: user.majors,
      groups: user.groups
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        neptunCode: user.neptunCode,
        type: user.type,
        universityId: user.universityId,
        majors: user.majors,
        groups: user.groups
      }
    });
  } catch (err) {
    next(err);
  }
};
