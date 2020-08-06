const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name:{
      type:String,
      required:true
  },
  username:{
      type:String,
      required:true

  },
  passwordToken : String,
  TokenExpiry : Date,
  password:{
      type:String,
      required:true
  },
  cart:{
      items:[ 
          {
            PId:{
                type:Schema.Types.ObjectId,  ref: 'Product',
                required:true
            },
            quantity:{
                type: Number,
                required: true

            }

          }
          
       
    ],
    Total:{
        type:Number,
        required: true
    }
  }



})


UserSchema.methods.addToCart = function(product){
// finding from array `items` the index of product id
const productID = this.cart.items.findIndex(p=>{
    return p.PId.toString()===product._id.toString();
})
//initial quantity one
 newQuantity=1;
const updatedCart= [...this.cart.items];
var total = this.cart.Total;

// if product already exists in the cart then retrive the quantuty increament it and store
if(productID>=0){
    newQuantity = this.cart.items[productID].quantity+1
    updatedCart[productID].quantity=newQuantity;
    total += product.price;
//else push the product
}
else{
    updatedCart.push({PId:product._id,quantity:newQuantity});
    total += product.price;
}

const newcart = {
    items: updatedCart,
    Total: total
  };

this.cart = newcart;
return this.save();
}
    

UserSchema.methods.deleteFromCart = function(prod){
    const updatedCart = this.cart.items.filter(item=>{
      return item.PId._id.toString()!==prod.PId._id.toString();
    });
   // console.log(updatedCart)
    this.cart.items = updatedCart;
    
   // console.log(this.cart.Total);
    //console.log(prod.PId.price);
    this.cart.Total=this.cart.Total-(prod.quantity*prod.PId.price);

    return this.save();

}

UserSchema.methods.clearCart = function(){
  //  console.log("inside the clear method");
    this.cart={items:[],Total: 0};

    return this.save();
}


module.exports= mongoose.model('User',UserSchema);















/*
const mongodb = require('mongodb');
const e = require('express');
const ObjectId = mongodb.ObjectId;

module.exports= class User{
    constructor(name,userid, password, cart){
        this.name = name;
        this.userid = userid;
        this.password =password;
        this.cart = cart;
    }

    save(){
    const db = getDb();
    return db.collection('users').insertOne(this)
    .then(res=>console.log(res))
    .catch(err=>console.log(err));
    }

    static getByid(pid)
{
    const db = getDb();
    return db.collection('users').findOne({_id:new ObjectId(pid)})
    .then(res=>{
        return(res);
    })
.catch(err=>console.log(err));


}
//id,
addtocart(product){
const updatedCart ={ items: [   { productID : new ObjectId(product._id),quantity:1}]  
    };
const db =getDb();
return db.collection('users').updateOne({_id:new ObjectId(this._id)},{$set:{cart: updatedCart}})
.then(res=>console.log(print("success")))
.catch(err=>console.log(err));


}


}

















/*
const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const user = sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull:false
    },
    email:{
        type: Sequelize.STRING,
        allowNull:false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,

    }
});

module.exports = user;
*/