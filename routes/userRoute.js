const express = require('express');
const user_route = express();

const bodyParser = require('body-parser');

const session = require('express-session');
const { SESSION_SECRET } = process.env;
//user_route.use(session({ secret:SESSION_SECRET}));
user_route.use(session({ 
    secret: SESSION_SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  }));

user_route.use((req, res, next) =>{
    res.locals.isAuthenticated = !!req.session.user;
    res.locals.user = req.session.user;
    next();
})

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

user_route.set('view engine', 'ejs');
user_route.set('views', './views');

user_route.use(express.static('public'));

const path = require('path');
const multer = require('multer');

const storage =  multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, path.join(__dirname,'../public/images'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+path.extname(file.originalname);
        cb(null, name);
    }
});

const upload = multer({ storage:storage});  

const userController = require('../controllers/userController');

const auth = require('../middlewares/auth')

user_route.get('/register', auth.isLogout, userController.registerLoad);
user_route.post('/register', upload.single('image'), userController.register);

user_route.get('/', auth.isLogout, userController.loadLogin);
user_route.post('/', userController.login);
user_route.get('/logout', auth.isLogin, userController.logout);

user_route.get('/dashboard', auth.isLogin, userController.loadDashboard)
user_route.post('/save-chat', userController.saveChat)



user_route.get('/activity', auth.isLogin, userController.loadActivity)
user_route.post('/activity', upload.single('image'), userController.createPost)

user_route.get('/admin', auth.isLogin, userController.loadAllUsers)
user_route.get('/admin/:userId', auth.isLogin, userController.getUserById);
user_route.post('/admin/update/:userId', auth.isLogin, userController.updateUser);
user_route.delete('/admin/delete/:userId', auth.isLogin, userController.deleteUser);

user_route.get('/friends', auth.isLogin, userController.loadFriends)


user_route.get('*', function(req, res){
    res.redirect('/');
})

module.exports = user_route;