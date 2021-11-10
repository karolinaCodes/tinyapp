const express = require("express");
const app = express();
const PORT = 8080;

// MIDDLEWARE //
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// VIEW ENGINE //
app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// generate a random 6 character alphanumeric string which will become the "unique" shortURL
const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};

// GET REQUESTS //

app.get("/urls", (req, res) => {
  const templateVars = {username: req.cookies["username"], urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// POST REQUESTS //

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;

  urlDatabase[shortURL] = longURL;

  //what if user already create a short url for a url?
  res.redirect(`/urls/${shortURL}`);
});

//log in user if already has an account
app.post("/login", (req, res) => {
  const submittedEmail = req.body.email;
  const submittedPassword = req.body.password;

  const user = emailLookup(submittedEmail);
  res.cookie("user_id", user["id"]);
  res.redirect("/urls");
});

// "logs the user out"/ deletes the user id data in cookie
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

// delete the URL resource
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  //after it deletes the url, it redirects to the current page- the index page so you can see the new state of the page
  res.redirect("/urls");
});

//update a resource
app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[shortURL]["longURL"] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

// LISTENER //

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
