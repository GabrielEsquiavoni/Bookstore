import express from "express";
import User from "../Models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
}

router.post("/register", async (req, res) => {
  try{
    const {email,username,password} = req.body;

    if(!username || !email || !password){
      return res.status(400).json({message: "Please fill all fields"});
    }

    if(password.length < 6){
      return res.status(400).json({message: "Password must be at least 6 characters"});
    }

    if(username.length < 3){
      return res.status(400).json({message: "Username must be at least 3 characters"});
    }

    // check if user already exists

    const existingEmail = await User.findOne({email});
    if(existingEmail){
      return res.status(400).json({message: "Email already exists"});
    }

    const existingUsername = await User.findOne({username});
    if(existingUsername){
      return res.status(400).json({message: "Username already exists"});
    }
    
    // get random avatar
    const profileImage = `https://api.dicebear.com/9.x/lorelei/svg?seed=${username}`;

    const user = new User({
      username,
      email,
      password,
      profileImage,
    })

    await user.save();

    const token = user.generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Error in register route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
    res.send("Login route");
});


export default router;