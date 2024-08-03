const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let user=users.filter((u)=>{
        return u.username===username;
    })
    if(user.length>0)
    {
        return false;
    }
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let user=users.filter((u)=>{
    return u.username===username && u.password===password;
});
//if there exists a user
if(user.length>0)
{
    return true;
}
//there exists no such user with these credentials
return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {

  let username=req.body.username;
  let password=req.body.password;
  if(!username || !password)
  {
    //if any one one of them is not present in request body
    return res.status(404).json({message:"Error Logging in!"});
  }
  if(authenticatedUser(username,password))
  {
    //hence user and password matched , we can login
    let accessToken=jwt.sign({data:password},'access',{expiresIn:60*60});
    req.session.authorization={accessToken,username};
    return res.status(200).json({message:"User successfully logged in!!"});
  }
  
  return res.status(208).json({message: "Invalid Login!Check username and password!!"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn=Number(req.params.isbn);
  let username=req.session.authorization['username'];
//   let review={
//     username: req.body.content
// };
  //now go through reviews
  let rev = books[isbn].reviews[username];
  books[isbn].reviews[username]=req.body.content;
  if(rev)
  {
    return res.send(`Updated the existing review successfully by ${username} for the book with title:  ${books[isbn].title}.Here are the modifications: ${JSON.stringify(books[isbn])}`);
  }
  return res.send(`Created a new review successfully by ${username} for the book with title: ${books[isbn].title}.Here are the contents: ${JSON.stringify(books[isbn])}`);

  //rev contains list of reviews with the username
  //if we find one in reviews with a particular username


});

//deleting review
regd_users.delete("/auth/review/:isbn",(req,res)=>{
    let isbn=req.params.isbn;
    let username=req.session.authorization['username'];
    let rev=books[isbn].reviews[username];
    if(rev)
    {
        //send a message that we deleted them successfully
        delete books[isbn].reviews[username];
        res.send(`Deleted the review made by you (i.e. by ${username}) successfully.\n
        Content of review before deleting the review:${rev}\nFinal Book reviews after deleting your review: ${JSON.stringify(books[isbn])}`);

    }
    res.send(`There's is no review given by you(i.e. ${username}) for this book with title ${books[isbn].title}.Reviews made for this book are shown below: ${JSON.stringify(books[isbn])}`);
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
