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
  let prom=new Promise((resolve,reject)=>{
    setTimeout(()=>{
        //once resolved , promise object value is books
        resolve(books);
    },2000)
  })
  //now using this promise object
  prom.then((books)=>{
    return res.send(JSON.stringify(books,null,4));
  })

  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn=Number(req.params.isbn);
  //updated code by using promises in functionality
  let prom2=new Promise((resolve,reject)=>{
    setTimeout(()=>{
        //resolving the promise after 1 second
        resolve(isbn); },5000);
 });
 //Once promise object is resolved, then the respone will be returned
 prom2.then((isbn)=>{
    let book=books[isbn];
    return res.send(JSON.stringify(book,null,4));
})
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //iterating through dictionary
  let writer=req.params.author;
  let authorbooks=new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(writer);
        //resolving the promise after 4 seconds
    },4000);
  });
  //now writing the functionality that needs to be executed once promise is resolved
  authorbooks.then((writer)=>{
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
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title=req.params.title;
  //creating book titles promise object that gives list of book with given title
  let booktitles=new Promise((resolve,reject)=>{
    setTimeout(()=>{
        //just passing some random argument as it is not useful in this project's case
        resolve(title);
    },3000);
  });
  //now writing functionality that gets executed after the promise object is resolved (i.e. after 4 seconds)
  booktitles.then((title)=>{
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
