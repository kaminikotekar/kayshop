
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const ejs = require('ejs');
const path = require('path');

const {validationResult} = require('express-validator/check');
//for generating random token for resetting password
const crypto = require('crypto');
const { use } = require("../Routes/users");
const { isRegExp } = require("util");

const transport = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: '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'
    }
}));

module.exports={
    
    'RegistrationForm':(req,res,next)=>{
    //res.status(200).sendFile(path.join(__dirname,'..','Views','index.html'));
  
    if(!req.session.IsLoggedIn){
        const flashMsg = req.flash('error');
        var errorMsg = null;
        if(flashMsg.length>0){
            errorMsg = flashMsg[0];
        }
    return res.render('index',{
        page:"Registration form",
        url:'/',
        error: errorMsg,
        data:{
            email:'',
            name:'',
            password:'',
            confirmPassword:''
        }
         });

        }  
        return res.redirect('/products'); 


    },

    /*
    
    'UsersGet':(req,res,post)=>{
    
        // res.status(200).sendFile(path.join(__dirname,'..','Views','users.html'));
        var user =User.users.getAllNames();
        console.log(user);
        res.render('users',{
            page:"List of users",
            userss:user,
            url:'/users'
        })
     },
     */
     

     'UsersPost':(req,res,next) =>{
       const error = validationResult(req);
       if(!error.isEmpty()){
           
          return res.status(422).render('index',{
            page:"Registration form",
            url:'/',
            data:{
                email:req.body.email,
                name:req.body.name,
                password:req.body.password,
                confirmPassword: req.body.confirmPassword
            },
            error: error.array()[0].msg
           });
       }
       const email =req.body.email;
       const password= req.body.password;
       const name = req.body.name;
       User.findOne({username:email})
       .then(existingUser=>{
           if(existingUser){
               console.log("user there");
              // req.flash('error','Email already registered!!');
              return res.status(422).render('index',{
                page:"Registration form",
                url:'/',
                data:{
                    email:req.body.email,
                    name:req.body.name,
                    password:req.body.password,
                    confirmPassword: req.body.confirmPassword
                },
                error: 'Email already registered!!'
               });
           }
           bcrypt.hash(password,10)
           .then(hashPassword=>{
                const user= new User( 
                  {name:name ,
                    username:email,
                    password:hashPassword,
                    cart:{
                        items:[],
                        Total:0
                    }
                 });
                 return user.save()
                        .then(()=>{
                            let templateData={ name: name }
                            ejs.renderFile(path.join(__dirname,'../Views/emailTemplate.ejs'),templateData,(err,html)=>{

                                console.log(err);
                               // console.log(html);

                                
                                transport.sendMail({
                                    from: 'kamini@kkamini.com',
                                    to:email,
                                    subject: "Welcome to the KayShop.com",
                                    html : html
                                }, (err,info)=>{
                                    console.log(err);
                                });
                                

                                res.render('login',{
                                    url:'/login',
                                    page:'Login',
                                   error: '',
                                   result:'Successfully Registered. Login to continue',
                                   data:{
                                       email:'',
                                       password:''
                                   }
                                });

                            });

                           
                        })
                        .catch(err=>console.log(err));

           })
           .catch(err=>console.log(err));
           
       })
       .catch(err=>console.log(err));
       
        
      },

      'UserLogin':(req,res,next)=>{
        if(!req.session.IsLoggedIn)
        {
            const flashMsg=req.flash('error');
            const resultMsg = req.flash('result')
            var errorMsg = null;
            var result = null;
            if(flashMsg.length>0){
                errorMsg = flashMsg[0];
            }
             if(resultMsg.length>0){
                result = resultMsg[0]
             }

            
            console.log(errorMsg);
       
         return res.render('login',{
                    url:'/login',
                    page:'Login',
                   error: errorMsg,
                   result:result,
                   data:{
                       email:'',
                       password:''
                   }
                });
        }
    
        return res.redirect('/products');
      },

      'UserLoginPost': (req,res,next)=>{
        const email = req.body.email;
        const password = req.body.password;
        
        User.findOne({username:email})
        .then(user=>{
            if(user){
            bcrypt.compare(password,user.password)
            .then(match=>{
                if(match){

                    req.session.user = user;
                    req.session.IsLoggedIn = true;
                    return req.session.save(err=>{
                            console.log(err);
                            res.redirect('/products');
                          });

                }
               // req.flash('error','Invalid password');
                res.status(422).render('login',{
                    url:'/login',
                    page:'Login',
                   error: 'Invalid Password',
                   result:null,
                   data:{
                       email:req.body.email,
                       password:req.body.password
                   }
                });
                
            })
            .catch(err=>{
                console.log(err);
                return res.redirect('/login')
            });
            }
            else{

                res.status(422).render('login',{
                    url:'/login',
                    page:'Login',
                   error: 'Invalid email',
                   result:null,
                   data:{
                       email:req.body.email,
                       password:req.body.password
                   }
                });
            }
        })
        .catch(err=>console.log(err));

/*
          User.findById("5f196363ef40943090aab1ec")
          .then(user=>{
              req.session.user = user;
              req.session.IsLoggedIn = true;
              req.session.save(err=>{
                  console.log(err);
                  res.redirect('/products');
              });
          }).catch(err=>console.log(err));
  */     
      },
      'UserLogoutPost': (req,res,next)=>{
          req.session.destroy((err)=>{
              console.log(err);
                res.redirect('/');
          });
      },

      'getResetPassword': (req,res,next)=>{

        const flashMsg = req.flash('error');
        const resultMsg = req.flash('result');
        var result = null; 
        var  errorMsg = null;

        if(flashMsg.length>0){
            errorMsg = flashMsg[0];
        }
        if(resultMsg.length>0){
            result = resultMsg[0];
        }
        res.render('resetPassword',{
            page:"Reset Password",
            url:'/login',
            error: errorMsg,
            result: result,
            email : ''
           // IsLoggedIn : req.session.IsLoggedIn
             });

      },
      'postResetPassword' : (req,res,next)=>{
            const email = req.body.email;
            User.findOne({username: email})
            .then(user=>{
                if(!user){
                    //req.flash('error','Invalid email');
                    return res.status(422).render('resetPassword',{
                        page:"Reset Password",
                        url:'/login',
                        error: 'Invalid email',
                        result: null,
                        email : email
                    })
                }

                crypto.randomBytes(20, (err, buffer)=>{
                    if(err){
                        req.flash('error','Something went wrong, please try again!');
                        return res.redirect('/resetPassword');
                    }
                    let token = buffer.toString('hex');
                    user.passwordToken = token;
                    user. TokenExpiry = Date.now()+ 1800000;
                    user.save()
                    .then(result=>{

                        let template ={
                            name: user.name,
                            token : user.passwordToken
                        }
                        ejs.renderFile(path.join(__dirname,'../Views/resetEmail.ejs'),template,(err,html)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                
                                transport.sendMail({
                                    to:req.body.email,
                                    from: 'kamini@kkamini.com',
                                    subject: 'Reset Password',
                                    html : html
                                },(err,info)=>{
                                    if(err){
                                        console.log(err);
                                    }
                                    //req.flash('result', 'link to reset password has been sent to your email address');
                                    res.render('resetPassword',{
                                        page:"Reset Password",
                                        url:'/login',
                                        error: null,
                                        result: 'Link to reset password has been sent to your email address',
                                        email : email
                                    });

                                });

                                
    
                            }
    
                        });



                    })
                    .catch(err=>console.log(err));


                });

            

            })
            .catch(err=>err);

      },

      'getPassword': (req,res,next)=>{
          const token = req.params.token;
          User.findOne({passwordToken:token})
          .then(user=>{
             // console.log(user);
             if(!user){
                req.flash('error','Sorry The link has expired, Enter email to reset password');
                return res.redirect('/resetPassword');
             }
            if(user.TokenExpiry <Date.now())
              {
                  user.passwordToken =undefined;
                  user.TokenExpiry = undefined;
                 return user.save()
                  .then(result=>{

                     req.flash('error','Sorry The link has expired, Enter email to reset password');
                     res.redirect('/resetPassword');
                  })
                  .catch(err=>console.log(err));
              }
              const flashMsg = req.flash('error');
              var error = null;
              if(flashMsg.length>0){
                  error = flashMsg[0];
              }
              res.render('password',{
                page:"Reset Password",
                url:'/login',
                token: token,
                id : user._id.toString() ,
                error : error  
          
            });


          })
          .catch(err=>console.log(err));

      },

      'postReset': (req,res,next)=>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            req.flash('error',error.array()[0].msg)
            return res.redirect('/resetPassword/'+req.body.token);
        }

        const id = req.body.id;
        const token = req.body.token;
        const password = req.body.password

        User.findOne({_id:id, passwordToken:token, TokenExpiry: {$gt: Date.now()}})
        .then(user=>{
            bcrypt.hash(password,10)
            .then(hash=>{

                user.password = hash;
                user.passwordToken= undefined;
                user.TokenExpiry = undefined;

                user.save()
                .then(result=>{
                    req.flash('result','Password updated successfully. Please login to continue')
                    res.redirect('/login');
                })
                .catch(error=>{
                    console.log(err)
                    req.flash('err','Something went wrong please try again');
                    res.redirect('/resetPassword/'+token);
                });


            })
            .catch(err=>{
                console.log(err)
                req.flash('err','Something went wrong please try again');
                res.redirect('/resetPassword/'+token);
            });

        })
        .catch(err=>console.log(err));

      }

      


    }  

