const userSchema = require("../model/userModel"); // Import the user model
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const saltRounds = 10; // Define the number of salt rounds for bcrypt

// Function to register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Destructure name, email, and password from request body

    const user = await userSchema.findOne({ email }); // Check if user already exists

    if (user) {
      req.session.message = "User already exists";
      return res.status(400).redirect("/user"); // If user exists, render login page with message
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

    const newUser = await userSchema({
      name,
      email,
      password: hashedPassword, // Create new user with hashed password
    });

    await newUser.save(); // Save the new user to the database
    req.session.message = "User created successfully";
    res.redirect("/user");
  } catch (error) {
    res.status(500).send("Server error"); // Send server error response
    console.log(error); // Log the error
  }
}; 

const adminSchema = require("../model/adminModel"); // Import the admin model

// Function to handle user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
   
    const user = await adminSchema.findOne({ email });
    
    if (!user) return res.status(400).redirect("/user/wrongUser");
    
    const isMatch = await bcrypt.compare(password, user.password);
   
    if (!isMatch) return res.status(400).redirect("/user/wrongUser");

    req.session.user = email;
    
    res.redirect("/user");
  } catch (error) {
    consle.log(error);
  }
};

// Function to load the login page
const loadlogin = (req, res) => {
  try {
    const mess = req.session.message;
    res.render("user/login", { message: mess || "" }); // Render login page with message
    req.session.message = ""; // Clear the message
  } catch (error) {
    console.log(error);
  }
};

// Function to load the home page
const loadHome = async (req, res) => {
  const email = req.session.user; // Get email from session
  const users = await userSchema.findOne({ email }); // Find user by email
  console.log(users);

  res.redirect("/user/login"); // Render home page with user's name
};

const add = async (req, res) => {
    try {
      const pairNumber = parseInt(req.params.no, 10); // Ensure base 10
  
      const user = await userSchema.findOneAndUpdate(
        { pairNumber },
        { $inc: { reportCount: 1 } },
        { new: true }
      );
  
      if (!user) {
        console.log(`No user found for pairNumber: ${pairNumber}`);
      }
      return res.redirect("/");
    } catch (error) {
      console.error("Error updating report count:", error);
      return res.status(500).send("Internal Server Error");
    }
  };
  

const sub = async (req, res) => {
    try {
      const pairNumber = parseInt(req.params.no); // Convert param to number
  
      const user = await userSchema.findOne({ pairNumber });
  
      if (!user) {
        console.log(`No user found for pairNumber: ${pairNumber}`);
        return res.status(404).send("User not found");
      }
  
      if (user.reportCount > 0) {
        const updatedUser = await userSchema.findOneAndUpdate(
          { pairNumber },
          { $inc: { reportCount: -1 } },
          { new: true }
        );
      } else {
        console.log("Report count is already 0, cannot decrement further.");
      }
  
      res.redirect("/");
    } catch (error) {
      console.error("Error updating report count:", error);
      res.status(500).send("Internal Server Error");
    }
  };

// Function to add a new user
const addUser = async (req, res) => {
    try {
        const { name, count } = req.body;

        // Get the highest pairNumber and increment
        const lastUser = await userSchema.findOne({}, {}, { sort: { pairNumber: -1 } });
        const nextPairNumber = lastUser ? lastUser.pairNumber + 1 : 1;

        // Create the new user
        const newUser = new userSchema({
            pairNumber: nextPairNumber,
            buddies: name,
            reportCount: parseInt(count)
        });

        await newUser.save();

        res.redirect('/');

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

// Function to delete a user by pairNumber
const deletePair = async (req, res) => {
    try {
        const pairNumber = parseInt(req.params.no); // Convert param to number

        const user = await userSchema.findOneAndDelete({ pairNumber });

        if (!user) {
            console.log(`No user found for pairNumber: ${pairNumber}`);
            return res.status(404).send("User not found");
        }

        res.redirect("/");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal Server Error");
    }
}   

//Fun

const addAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body; // Destructure name, email, and password from request body

        const user = await adminSchema.findOne({ email }); // Check if user already exists

        if (user) {
            req.session.message = "User already exists";
            return res.status(400).redirect("/user"); // If user exists, render login page with message
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

        const newUser = await adminSchema({
            name,
            email,
            password: hashedPassword, // Create new user with hashed password
        });

        await newUser.save(); // Save the new user to the database
        req.session.message = "User created successfully";
        res.redirect("/user");
    } catch (error) {
        res.status(500).send("Server error"); // Send server error response
        console.log(error); // Log the error
    }
}
// Function to handle user logout
const logout = (req, res) => {
  req.session.user = false;
  req.session.message = "User Log out successfully"; // Set message in session
  res.redirect("/"); // Redirect to login page
};


// Export all functions
module.exports = {
  registerUser,
  loadlogin, 
  login,
  loadHome,
  logout,
  add,
  sub,
  addUser,
  deletePair,
  addAdmin,
}; 
