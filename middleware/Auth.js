const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');

const checkSession = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/');
}

const isLogin = async(req, res, next) => {

    if (!req.session.user) {
        return next();
    }
    const email = req.session.user || true;
    const users = await userModel.find({}).sort({pairNumber: 1});

    res.render('user/home',{users});
}

 
module.exports = {
    checkSession,
    isLogin,
};