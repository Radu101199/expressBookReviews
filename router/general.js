const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function doesExist(username) {
    return users.some(user => user.username === username);
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  console.log(req.body)
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books,null,4));
// });
// Route to get the list of books using async/await
public_users.get('/', async (req, res) => {
    try {
        const books = await getBooks();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: "An error occurred" });
    }
});
// Mock function to simulate data fetching
const getBooks = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 1000); 
    });
};


///////////////////////////////////////////////////////////////////////////////


// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   res.send(books[isbn]);
//  });

// Mock function to simulate fetching book details
const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject(new Error('Book not found'));
            }
        }, 1000); // Simulate delay
    });
};

// Route to get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await getBookByISBN(isbn);
        res.json(book);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});


///////////////////////////////////////////////////////////////////////////////


// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   let bookArray = Object.values(books);
//   let filtered_books = bookArray.filter((book) => book.author === author);
//   res.send(filtered_books);
// });
// Mock function to simulate fetching books by author
const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const bookArray = Object.values(books);
            const filteredBooks = bookArray.filter((book) => book.author === author);
            resolve(filteredBooks);
        }, 1000); // Simulate delay
    });
};

// Route to get book details based on author using async/await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const filteredBooks = await getBooksByAuthor(author);
        res.json(filteredBooks);
    } catch (err) {
        res.status(500).json({ error: "An error occurred" });
    }
});


///////////////////////////////////////////////////////////////////////////////


// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//   let bookArray = Object.values(books);
//   let filtered_books = bookArray.filter((book) => book.title === title);
//   res.send(filtered_books);
// });

const getBooksByTitle = (title) =>{
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const bookArray = Object.values(books);
            const filteredBooks = bookArray.filter((book) => book.title === title);
            resolve(filteredBooks);
        }, 1000);
    });
};

public_users.get('/title/:title', async (req, res) => {
    const title = req.params.titlel
    try{
        const filteredBooks = await getBooksByTitle(title);
        res.json(filteredBooks);
    } catch(err) {
        res.status(500).json({ error: "An error occured"});
    }
})

///////////////////////////////////////////////////////////////////////////////
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  // Find the book with the matching ISBN
  const book = books[isbn];

  if (book) {
    // If the book is found, send its reviews
    res.send(book.reviews);
  } else {
    // If the book is not found, send a 404 status with a message
    res.status(404).send({ message: "Book not found" });
  }
});

module.exports.general = public_users;
