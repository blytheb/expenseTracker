import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

//generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
}

//Register User
export const registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    //validation: check for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try{
        //check if email already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        
        //create new user
        const newUser = await User.create({
            fullName,
            email,
            password,
            profileImageUrl
        });

        res.status(201).json({
            // message: 'User registered successfully',
            id: newUser._id,
            newUser,
            token: generateToken(newUser._id),
        }); 
    } catch (error) {
        res.status(500).json({ message: 'Eroor registering User:', error: error.message });
    }
};

//LOGIN User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    //validation: check for missing fields
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        //check if user exists
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({
            id: user._id,
            user, 
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in:', error: error.message });
    }  
};

//Register User
export const getUserInfo = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);     
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user info:', error: error.message });
    }
};