import User from "../models/userModel";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

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

export const neptunLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { UserLogin, Password } = req.body;

  if (!UserLogin || !Password) {
    return res.status(400).json({ message: 'UserLogin and Password are required.' });
  }

  try {
    const neptunResponse = await axios.post(
      'https://host.sdakft.hu/semtehw/MobileService.svc/GetTrainings',
      { 'UserLogin': UserLogin, 'Password': Password, 'OnlyLogin': false }
    );

    if (neptunResponse.data.success) {
      let user = await User.findOne({ neptunCode: UserLogin });

      // Step 4: If the user doesn't exist, create a new one
      if (!user) {
        user = new User({
          neptunCode: UserLogin,
          name: neptunResponse.data.name || 'Unknown', // Assuming the API returns the user's name
          universityId: "default-university",          // Adjust as per your application logic
          type: "student",                            // Adjust user type as needed
          majors: [],                                 // You can also pull relevant data from Neptun response
          groups: []
        });

        // Save the new user to the database
        await user.save();
      }

      // Step 5: Generate a JWT token with user data
      const token = jwt.sign({
        id: user._id,
        name: user.name,
        neptunCode: user.neptunCode,
        universityId: user.universityId,
        type: user.type,
        majors: user.majors,
        groups: user.groups
      }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });

      // Step 6: Return the token and user info in the response
      return res.status(200).json({
        status: "success",
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          neptunCode: user.neptunCode,
          universityId: user.universityId,
          type: user.type,
          majors: user.majors,
          groups: user.groups
        }
      });
    } else {
      return res.status(401).json({ message: 'Invalid Neptun credentials' });
    }
  } catch (error) {
    console.error('Error with Neptun login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};