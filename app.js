const express = require('express');
const bodyParser = require('body-parser');
const user_router= require('./Routes/users');
const product_router = require('./Routes/products');
const User = require('./models/user');

// importing session and session database
const Session = require('express-session');
const mongodbstore = require('connect-mongodb-session')(Session);
const csrf = require('csurf');
const flash = require('connect-flash');

//importing database connection
const path= require('path')

//importing modules
const user = require('./models/product');
//const product = require('./models/user');
//const cart = require('./models/cart');
//const mongoConnect = require('./utils/database').mongoConnect;
const mongoose = require('mongoose');
const multer = require('multer');
const { db } = require('./models/user');

const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const helmet = require('helmet');


app = express();
const MONGODB_URI= 'mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@shop-bm6k7.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority'
const store = new mongodbstore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/images/uploads');
    },
    filename: function(req,file,cb){
        cb(null,new Date().toISOString()+'_'+file.originalname);
    }

});

const fileFilterMethod = (req,file,cb)=>{
    if(file.mimetype === 'image/png' | file.mimetype === 'image/jpg' | file.mimetype==='image/jpeg'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}

const csrfProtection = csrf();
const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),
{flags:'a'});

app.set('view engine','ejs');
app.set('views','Views');

app.use(helmet());
app.use(compression());
app.use(morgan('combined',{ stream: accessLogStream}));
app.use(express.static(path.join(__dirname,'public')));
app.use('images/uploads',express.static(path.join(__dirname,'public/images/uploads')));

app.use(bodyParser.urlencoded({extended:false}));
app.use(multer({storage:storage, fileFilter:fileFilterMethod}).single("image"));
// using mysql commands
/*
db.execute('SELECT * FROM Products')
.then(result =>{
    console.log(result);
})
.catch(err=>{
    console.log(err);
});
*/

app.use(
    Session(
        {secret:'my secret',
         resave: false,
         saveUninitialized: false,
         store:store})
);

app.use(csrfProtection);

app.use(flash());

app.use((req,res,next)=>{
    const token =req.csrfToken();
    res.locals.IsLoggedIn = req.session.IsLoggedIn;
    res.locals.csrf = token;
    next();
})

app.use((req,res,next)=>{
if(!req.session.user){
   return next();
}
User.findById(req.session.user._id)
.then(user=>{
    req.user=user // already added user to be used for this purpose.
    next();
})
.catch(err=>console.log(err));
//next(); // not to be used as user id is required for next product adding request

});


app.use(user_router);
app.use(product_router);

/*
product.belongsTo(user,{ constraints: true, onDelete:'CASCADE'});
user.hasMany(product,{});
cart.hasMany(product)
user.hasOne(cart);
sequelize.sync({
    force:true
})
.then(result=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
});
*/
/*
mongoConnect(()=>
{
app.listen(3000);
})
*/
mongoose.connect(MONGODB_URI,{ useNewUrlParser: true ,useUnifiedTopology: true})
.then(()=>{

    app.listen(3000);

    User.findOne().then(user=>{
        if(!user){
            const  user =new User({name:"kamini",
        username:"kkamini",
        password:"abcd",
        cart:{
            items:[],
            Total:Number("0") }});
         
        user.save();
        }
    }).catch(err=>console.log(err));

    console.log("connection successful");   
})
.catch(err=>console.log(err));