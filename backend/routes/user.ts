import express from "express";
const { Request, Response } = express;
import User from "../models/User.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticateToken from "../middleware/auth.ts";
import mongoose from "mongoose";

const router = express.Router();

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
    email: string;
    password: string;
}

interface UserType {
    _id: string;
    username: string;
    email: string;
    followers: mongoose.Types.ObjectId[],
    following: mongoose.Types.ObjectId[],
}

interface UserWithFollowStatus extends UserType {
    isFollowing: boolean;
}

router.post("/register", async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: err instanceof Error ? err.message : "An error occurred" });
    }
  },
);

router.post('/login', async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    const user = await User.findOne({ email: req.body.email });
    console.log(req.body.email)

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({_id: user._id, username: user.username}, process.env.JWT_SECRET as string);

    res.header('Authorization', 'Bearer ' + token).json({ 'token': token, 'userID': user._id})
})

router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
})

router.post('/:id/follow', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userToFollow = await User.findById(req.params.id) as UserType;
        const currentUser = await User.findById(req.user._id) as UserType;

        if(!currentUser.following.includes(userToFollow._id)) {
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);
            await currentUser.save();
            await userToFollow.save();
            
            res.status(200).json({
                ...userToFollow.toObject(),
                isFollowing: true,
            });
        } else {
            res.status(400).json({message: "You are already following this user"})
        }
    } catch (err) {
        res.status(400).json({message: err instanceof Error ? err.message : "You are already following this user."})
    }
})

router.post('/:id/unfollow', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userToUnfollow = await User.findById(req.params.id) as UserType;
        if(!userToUnfollow) return res.status(404).json({message: "User not found"})

        const currentUser = await User.findById(req.user._id) as UserType;

        if(currentUser.following.includes(userToUnfollow._id)) {
            currentUser.following = currentUser.following.filter(
                id => id.toString() !== userToUnfollow._id.toString()
            );

            userToUnfollow.followers = userToUnfollow.followers.filter(
                id => id.toString() !== currentUser._id.toString()
            )

            await currentUser.save();
            await userToUnfollow.save();

            res.status(200).json({
                ...userToUnfollow.toObject(),
                isFollowing: false,
            });
        } else {
            res.status(400).json({message: "You are not following this user"})
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
 })

 router.get('/explore', authenticateToken, async (req: Request, res: Response) => {
    try {
        const currentUserId = req.user._id;

        const users = await User.find({_id: { $ne: currentUserId }}).select('-password');

        const usersWithFollowStatus: UserWithFollowStatus = users.map(user => ({
            ...user.toObject(),
            isFollowing: user.followers.includes(currentUserId),
        }));

        res.status(200).json(usersWithFollowStatus);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const users = await User.findById(req.params.id).select('-password') as UserType;

        if(!users) return res.status(404).json({message: "User not found"})
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

export default router;
