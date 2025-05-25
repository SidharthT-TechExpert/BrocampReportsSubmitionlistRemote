'use strict';

const express = require('express');
const routes = express.Router();
const userController = require('../controller/userController');
const auth = require('../middleware/Auth.js');

//Get Methods
routes.get('/', auth.isLogin, userController.loadlogin);
routes.get('/user', auth.isLogin, userController.loadlogin); 
routes.get('/login', auth.isLogin, userController.loadlogin);
routes.get('/home', auth.isLogin, userController.loadHome);
routes.get('/logout', auth.checkSession, userController.logout);


//Post Methods 
routes.post('/login' , userController.login);
routes.post('/signUp' , userController.registerUser);
routes.post('/addUser' , userController.addUser);
routes.post('/addAdmin' , userController.addAdmin);

//Put Methods
routes.put("/add/:no" , userController.add);
routes.put("/sub/:no" , userController.sub);

//Delete Methods
routes.delete("/delete/:no" , userController.deletePair);



module.exports = routes;

