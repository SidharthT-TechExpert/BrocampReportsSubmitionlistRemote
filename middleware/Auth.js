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

const wrong = (req, res) => {
    req.session.message = 'Invalid Credentials';
    res.redirect('/');
}

const names = [
    "ABDUL HALIQ BM",
    "Aifa Sana uk",
    "Akhil joy",
    "Arun Narayan Nair",
    "CHRISTIN JOHNY",
    "Chitra",
    "Fasalu Rahman",
    "Jasima",
    "Kadeejatu zaiba",
    "Karthik B",
    "Krishna",
    "Midhun Manoj",
    "Neethu George",
    "Praveena",
    "Riyas kv",
    "Sidharth T",
    "Thaskeem",
    "Visal s Vijayan",
    "Adarash Babu",
    "Aswathy K"
  ];
names.sort((a,b) => a.localeCompare(b));
console.log(names);  
module.exports = {
    checkSession,
    isLogin,
    wrong
};