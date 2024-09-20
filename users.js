// ./routes/users.js

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
/* User Router */

/*
const users = [
    {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "username": "johndoe",
        "bio": "I am John Doe",
        "email": "johndoe@email.com",
        "password": "test123"
    },
    {
        "id": 2,
        "first_name": "Bob",
        "last_name": "Cain",
        "username": "bobcain",
        "bio": "I am Bob Cain",
        "email": "bobcain@email.com",
        "password": "test321"
    }
];
*/

// get users
router.get("/", async (req, res) => {
    await User.find()
    .then((users) => res.status(200).send({users: users}))
    .catch((error) => res.status(400).send({message: error}))
});

router.get("/id/:id", async (req, res) => {
    await User.findById(req.params.id)
    .then((user) => res.status(200).send({user: user}))
    .catch((error) => res.status(400).send({message: error}))
});

router.get("/username/:username", async (req, res) => {
    await User.findOne(req.params.username) //requesting the parameter 
    .then((user) => res.status(200).send({user: user}))
    .catch((error) => res.status(400).send({message: error}))
});



// create new user
router.post("/create", async (req, res) => {
    if(!req.body.first_name || !req.body.last_name|| !req.body.username || !req.body.bio || !req.body.email || !req.body.password) res.status(400).send("info required but not given");
   
    const usernameExists = await User.findOne({ username: req.body.username });
    if (usernameExists) {
    return res.status(400).send({message: "username already exists"});
  }
    const emailExists = await User.findOne({ email: req.body.email});
    if (emailExists){
        return res.status(400).send({message: "This email is already in use"})
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password, salt);
   
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        bio: req.body.bio,
        email: req.body.email,
        password: hashPassword
    });
    try{
    const saveUser = await user.save();
    return res.status(200).send({
        message: "user was registered successfully",
        user: user._id,
        });
    } catch (error) {
        return res.status(400).send({message: error});
    }
    res.send(user);
});


router.post("/update/:id", async (req, res) => {
    if(!req.body.first_name || !req.body.last_name|| !req.body.username || !req.body.bio || !req.body.email) res.status(400).send("info required but not given");
   
    let isChanged = false;

    const user = await User.findById(req.params.id);
    if (!user){ 
    return res.status(404).send({message: "user not found"});
}

if(user.username != req.body.username){
    const username = await User.findOne({ username: req.body.username})
    if(usernameExist){
        return res.status(400).send({message: "username is taken"});
    }
    isChanged = true;
    user.username = req.body.username;
}

if(user.email != req.body.email){
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists){
        return res.status(400).send({message: "eamil is taken"});
    }
    isChanged = true;
    user.email = req.body.email
}

if( user.bio != req.body.bio){
    isChanged = true;
    user.bio = req.body.bio
}

    
if( user.first_name != req.body.first_name){
    isChanged = true;
    user.first_name = req.body.first_name
}

if (user.last_name != req.body.last_name){
    isChanged = true;
    user.last_name = req.body.last_name;
}

if (isChanged){
    await user.save()
    .then(() => res.status(200).send({message: "user updated successfully"}))
    .catch((error) => res.status(404).send({message: error}));
}   else{
res.status(304).send({message: "no change to user"});
}
});

router.post("updatePassword/:id"), async (req, res) => {
    if(!req.body.oldPassword || !req.body.newPassword) res.status(400).send("infor required but not given")
    await User.findById(req.user)
}
router.delete('/:id', async (req, res) => { 
    const user = await User.findOneAndDelete({ _id: req.params.id })
    .then((user) => res.status(200).send({message: "user deleted successfully"}))
    .catch((error) => res.status(400).send({message: error}));
});

module.exports = router;

/*
To test fo into body, raw, and JSON
http://localhost:3000/users/
http://localhost:3000/users/create
Body > raw > JSON
{
    "first_name": "Bob",
    "last_name": "Sam",
    "username": "bobsam",
    "bio": "I am Bob Sam",
    "email": "bobsam@test.com",
    "password": "test123"
}
*/