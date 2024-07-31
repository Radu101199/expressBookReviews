const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    console.log(users)
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    // Check if user is logged in
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }
    
    let bookArray = Object.values(books);
    // Check if the book exists
    if (!bookArray[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Get the reviews array for the book
    let reviews = books[isbn].reviews;
    // Ensure reviews is an object
    if (typeof reviews !== 'object') {
        reviews = {}; // Initialize as an empty object if it's not
        books[isbn].reviews = reviews;
    }

    if (reviews[username]) {
        // Modify the existing review
        reviews[username] = review;
        return res.status(200).json({ message: "Review updated successfully" });
    } else {
        // Add a new review
        reviews[username] = review;
        return res.status(201).json({ message: "Review added successfully" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    // Check if user is logged in
    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    let reviews = books[isbn].reviews;

    // Ensure reviews is an object
    if (typeof reviews !== 'object') {
        return res.status(500).json({ message: "Internal server error" });
    }

    // Check if the review belongs to the current user
    if (reviews[username]) {
        // Delete the user's review
        delete reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "Review not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
