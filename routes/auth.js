const router =require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation}= require('../validation');

router.post('/register', async (req,res)=>{
    //Lets validate the data before we add a user
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //Checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exist');

    //HASH Passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);


    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        roles: 'user',
        password: hashPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user:user.id});
    }
    catch(err){
        res.status(400).send(err);
    }
});

//LOGIN
router.post('/login',async (req,res) =>{
    //Lets validate the data before we add a user
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Checking if email exist
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is invalid');
    //if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Password is invalid');

    //Create and assign a token
    const token = jwt.sign({_id: user.id}, "asdfgh", {expiresIn:'1d'});
    res.header('auth-token', token).send(token);

    //res.send('Logged in!')
});





module.exports = router;

