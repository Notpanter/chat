const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const Post = require('../models/postModel')
const FriendRequest = require('../models/friendRequestModel')
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
// const bcrypt = require('bcrypt');


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
        
        const imagePath = req.file.path;
        const imageBuffer = fs.readFileSync(imagePath);
        const imageBase64 = imageBuffer.toString('base64');

        const user = new User({
            name: req.body.name, 
            email: req.body.email,
            image: imageBase64,
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
        // for (let i = 0; i < users.length; i ++){
        //     console.log(users[i]['name'])
        // }
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


const loadAllUsers = async(req, res) =>{
    try{
        var users = await User.find({});
        res.render('admin', {user: req.session.user, users:users})
    }
    catch(error){
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
// activity
const loadActivity = async(req, res) =>{
    try {
        var posts = await Post.find({});
        // console.log(posts)
        res.render('activity', {user: req.session.user, posts:posts})
    } catch (error) {
        console.log(error.message);
    }
}
const createPost = async(req, res) => {
    try {
        const userId = req.session.user._id; // Assuming user ID is stored in session
        const post = new Post({
            user_id: userId,
            title: req.body.title, 
            image: 'images/'+req.file.filename,
            content: req.body.content
        });

        await post.save();
        // var posts = await Post.find({});
        // res.render('activity', {user: req.session.user, posts:posts})
        res.redirect('activity')
    } catch (error) {
       console.log(error.message); 
    }
}
// admin-panel
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Server error' });
    }
}

const updateUser = async (req, res) => {
    try {
        console.log('update ' + req.params.userId)
        console.log(req.body)
        await User.findByIdAndUpdate(req.params.userId, req.body);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Server Error' });
    }
}

const deleteUser = async (req, res) => {
    try {
        console.log('delete ' + req.params.userId)
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Server Error' });
    }
}
// Friends
const loadFriends = async (req, res) => {
    try{
        const userId = req.session.user._id;
        //request
        const friendRequests  = await FriendRequest.find({ requestTo: userId }).populate('requestFrom');
        console.log(friendRequests)
        //friends
        const user = await User.findById(userId).populate('friends');
        if (!user){
            return res.status(404).json({ error: 'User not found' });
        }
        // Extract and send the friends array
        const friends = user.friends;
        console.log(friends)
        res.render('friends', {user: req.session.user, friendRequests:friendRequests, friends:friends})
    }catch (error) {
        console.error(error.message);
        // res.status(500).json({ error: 'Server error' });
    }

}
module.exports = {
    registerLoad,
    register,
    loadLogin,
    login,
    logout,
    loadDashboard,
    loadActivity,
    loadAllUsers,
    createPost,
    getUserById,
    updateUser,
    deleteUser,
    loadFriends,
    saveChat
}
