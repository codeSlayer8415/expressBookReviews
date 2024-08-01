const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username=req.body.username;
  let password=req.body.password;
  if(username && password)
  {
    //both are given as request params
    if(isValid(username))
    {
        //this user is new , add this new user to users
        users.push({"username": username,"password":password});
        return res.status(200).json({message: "User is successfully registered!!"})
    }
    else
    {
        return res.status(404).json({message: "User already exists"});
    }
  }
  return res.status(404).json({message: "Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn=Number(req.params.isbn);
  let book=books[isbn];
  return res.send(JSON.stringify(book,null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //iterating through dictionary
  let writer=req.params.author;
  let authbooks=[]
    for(const [isbn,book] of Object.entries(books))
    {
        //now storing in authbooks if this is authors
        if(book["author"]===writer)
        {
            authbooks.push(book);
        }
    }
  return res.send(JSON.stringify(authbooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title=req.params.title;
  let bookbytitle=[];
  for(const [isbn,book] of Object.entries(books))
  {
    if(book["title"] === title)
    {
        bookbytitle.push(book);
    }
  }
  return res.send(bookbytitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn=Number(req.params.isbn);
//   let book=[];
//   book.push(books[isbn]);
//   return res.send(book[0].reviews);
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
