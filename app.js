const express = require('express');
const app = express();
const userRouter = require('./routes/user'); 
const connectDB = require('./db/connectDB');
const session = require('express-session'); 
const nocache = require('nocache');
const ejs = require('ejs');   
const path = require('path');  


const methodOverride = require('method-override'); 
// Load environment variables
require('dotenv').config();


  
// port setup
const port = process.env.PORT || 3000 ;

// Middleware setup
app.use(express.urlencoded({extended:true})); 
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge: 0.1 * 60 * 60 * 1000  // 0.1 hours in milliseconds
    }
}))

// Set up view engine
app.set('views',path.join(__dirname,'views'));
app.use(nocache());
app.set('view engine','ejs');
app.use(express.static('public')); 

// set up routes
app.use('/user',userRouter);
app.use('/',userRouter); 

app.use('*',(req,res) => {
    res.redirect('/user');
})

// Connect to the database
connectDB();


// Start the server
app.listen(port , () => {
    console.log('===================================');
    console.log(`  Server is running on port ${port}`); 
    console.log('===================================');
})