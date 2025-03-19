import User from "../models/userModel";
import Major from "../models/majorModel";
import mongoose from "mongoose";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { loginToNeptun, getDetails } from "../utils/neptunUtils";
import { ServerError } from "../utils/serverError";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, neptunCode, password, passwordConfirm, universityId, type, majors, groups } = req.body;

    // if (!name || !neptunCode || !password || !passwordConfirm || !universityId || !type) {
    //   return res.status(400).json({ message: 'All fields are required' });
    // }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findOne({ neptunCode });
    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
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

    const user = await User.findOne({ neptunCode })
    .populate('universityId')
    .populate('majors')
    .populate('groups')
    .lean()
    ;

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



    const token = jwt.sign({
      _id: user._id,
      name: user.name,
      neptunCode: user.neptunCode,
      type: user.type,
      universityId: user.universityId,
      majors: user.majors,
      groups: user.groups,
      occasionIds: user.occasionIds,
      publicKey: user.publicKey
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        neptunCode: user.neptunCode,
        type: user.type,
        universityId: user.universityId,
        majors: user.majors,
        groups: user.groups,
        occasionIds: user.occasionIds,
        publicKey: user.publicKey
      }
    });

    console.log('User logged in successfully', {
      _id: user._id,
      name: user.name,
      neptunCode: user.neptunCode,
      type: user.type,
      universityId: user.universityId,
      majors: user.majors,
      groups: user.groups,
      occasionIds: user.occasionIds,
      publicKey: user.publicKey
    })
  } catch (err) {
    next(err);
  }
};

export const registerWithNeptun = async (req: Request, res: Response, next: NextFunction) => {
  try {



    const { neptunCode, password, universityId, publicKey } = req.body;

    if (!neptunCode || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing Neptun code or password'
      });
    }

    // Attempt login to Neptun
    console.log("Attempting login with Neptun code:", neptunCode);
    const neptunCookies = await loginToNeptun(neptunCode, password);
    console.log("Received Neptun cookies:", neptunCookies);

    // Attempt to get user details
    const details = await getDetails(neptunCookies);
    console.log("Retrieved user details from Neptun:", details);

    // Hash password and prepare new user data
    const hashedPassword = await argon2.hash(password);
    console.log("Password hashed successfully");

    const majorName = details.kepzes.split(' - ')[0];
    console.log("Retrieved major name:", majorName);

    const major = await Major.findOne({ name: { $regex: `^${majorName}`, $options: 'i' } }); // Case-insensitive search

    if (!major) {
      console.log(`No major found starting with: ${majorName}`);
    } else {
      console.log("Major found:", major);
    }

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      universityId: universityId,
      type: 'STUDENT',
      name: details.name,
      password: hashedPassword,
      neptunCode: details.neptun_code,
      majors: major ? [major._id] : [],
      groups: [],
      publicKey: publicKey
    });


    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    console.log("Generating JWT token");
    const token = jwt.sign(
      {
        id: newUser._id,
        name: newUser.name,
        neptunCode: newUser.neptunCode,
        type: newUser.type,
        universityId: newUser.universityId,
        majors: newUser.majors,
        groups: newUser.groups,
        publicKey: newUser.publicKey
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Attempt to save the new user
    console.log("Saving new user to the database:", newUser);
    await newUser.save();

    // Respond with success if everything orks
    console.log("User registered successfully, sending response");
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        neptunCode: newUser.neptunCode,
        type: newUser.type,
        universityId: newUser.universityId,
        majors: newUser.majors,
        groups: newUser.groups,
        publicKey: newUser.publicKey
      }
    });
  } catch (err) {
    console.error("Neptun registration error:", err);
    res.status(500).json({ message: 'Internal server error' });
    next(err);
  }
};
