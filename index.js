const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const path = require(`path`);

//////
const passport = require(`passport`);
const session = require(`express-session`);
const passportLocalMongoose = require(`passport-local-mongoose`);
/////

const app = express();



app.use(express.static('static'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.set(`views`, path.join(__dirname, `views`));

///////////////////
app.use(session({
    secret: 'kaustubhssecret',
    resave: false,
    saveUninitialized: false,

}))

app.use(passport.initialize());
app.use(passport.session());
// before connection to database////////

mongoose.connect('mongodb://localhost:27017/ExpenseTracker', { useNewUrlParser: true });
db = mongoose.connection;
db.once('open', () => {
    console.log("Connected to Mongo");
})
db.on('error', () => {
    console.log("Error in connection to Mongo");
})
const User = require(`./models/user`);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', (req, res) => {
    res.render(`home`);
})
app.get('/users/:id', (req, res) => {
    if (req.isAuthenticated()) {

        res.render(`user`);
    }else{
        res.redirect('/');
    }
})
app.post('/register', (req, res) => {
    let user = new User({
        username: req.body.username,
        
        email: req.body.email
    })
    User.register(user, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect('/');
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect(`/users/` + user.username);

        })
    })
})
app.post('/login',(req,res)=>{
    let user= new User(
        {
            username: req.body.username,
            password:req.body.password
        }
    )
    req.logIn(user,(err)=>{
        if(err){
            console.log(err);
            res.redirect('/');
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect(`/users/` + user.username);
        })
    })
})


app.listen(3000, () => {
    console.log("Server running on 3000");
})