const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const bcrypt = require('bcrypt');


const registerLoad = async(req, res) => {
    try {
        res.render('register');
    } catch (error) {
       console.log(error.message); 
    }
}

const register = async(req, res) => {
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name, 
            email: req.body.email,
            image: 'images/'+req.file.filename,
            password: passwordHash
        });

        await user.save();

        res.render('register', { message: 'Your Registration Completed Succedfully!'})
    } catch (error) {
       console.log(error.message); 
    }
}

const loadLogin = async(req, res) =>{
    try {
        res.render('login');
        
    } catch (error) {
        console.log(error.message);
    }
}

const login = async(req, res) =>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});
        if(userData){
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if(passwordMatch){
                req.session.user = userData;
                res.redirect('/dashboard');
            }
            else{
                res.render('login', {message:'Email and password are incorrect'});

            }
        }
        else{
            res.render('login', {message:'Email and password are incorrect'});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const logout = async(req, res) =>{
    try {
        req.session.destroy();
        res.redirect('/');
        
    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async(req, res) =>{
    try {
        var users = await User.find({ _id: { $nin:[req.session.user._id]}});
        res.render('dashboard', {user: req.session.user, users:users})
}
        // if(req.session.user) {
        //     res.render('dashboard', {user:req.session.user})
        // } else {
        //     // Redirect to login or show an error
        //     return res.redirect('/login');
        // }
     catch (error) {
        console.log(error.message);
    }
}

const saveChat = async(req, res) => {
    try {

        var chat = new Chat({
            sender_id:req.body.sender_id,
            receiver_id:req.body.receiver_id,
            message:req.body.message,
        });

        var newChat = await chat.save();
        res.status(200).send({success:true, msg:'Chat inserted', data:newChat});
        
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}

const loadProfile = async (req, res) => {
    try {
        // Load the user's profile data
        const user = await User.findById(req.session.user._id);

        // Render the profile view with the user's data
        res.render('profile', { user: user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
}

const uploadProfileImage = async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        // Get the uploaded file data
        const imagePath = 'images/'+req.file.filename;

        // Get the user's ID from the session
        const userId = req.session.user._id;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update the user's profile image data
        user.image = imagePath;

        // Save the updated user object
        await user.save();

        // Redirect back to the profile page
        res.redirect('/profile');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = {
    registerLoad,
    register,
    loadLogin,
    login,
    logout,
    loadDashboard, 
    saveChat,
    loadProfile,
    uploadProfileImage
}
