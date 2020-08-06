const express = require('express');

const userMethods = require('../controllers/user-function');
const {check,body} = require('express-validator');

const router= express.Router();


router.get('/',userMethods.RegistrationForm);
//router.get('/users',userMethods.UsersGet);

router.post('/pr',[
check('email').isEmail().withMessage('Invalid email'),
body('password').isLength({min:7}).withMessage('Password length should alteast be 7')
.custom((value,{req})=>{
    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if(!regularExpression.test(value)){
        throw new Error('Passsword should contain atleast 1 number and 1 character');
    }
    if(value!=req.body.confirmPassword){
        throw new Error('Passwords do not match');

    }
    return true;
})
],
userMethods.UsersPost);

router.get('/login',userMethods.UserLogin);
router.post('/login',userMethods.UserLoginPost);

router.post('/logout',userMethods.UserLogoutPost);

router.get('/resetPassword',userMethods.getResetPassword);
router.post('/resetPassword', userMethods.postResetPassword);
router.get('/resetPassword/:token', userMethods.getPassword);

router.post('/reset',[
    body('password').isLength({min:7}).withMessage('Password length should be atleast 7')
    .custom((value,{req})=>{
        var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        if(!regularExpression.test(value)){
            throw new Error('Passsword should contain atleast 1 number and 1 character');
         }
         if(value!=req.body.confirmPassword){
            throw new Error('Passwords do not match');
    
         }
        return true;
    })

],
userMethods.postReset);

router.get('/emailReset', (req,res,next)=>{
    res.render('resetEmail',{
        name: 'Kamini kotekar',
        token : 'abc'
    });
})



module.exports=router;
