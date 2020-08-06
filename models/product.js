
const User = require('./user');
const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const  ProductSchema = new Schema({
name: {
type:String,
required:true
},
description:{
    type:String,
    required:true
},
price:{
    type:Number,
    required:true
},
imageUrl:{
    type:String,
    required:true
},
user:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
}

});


ProductSchema.methods.removeFromCart= function(ProductID){


    User.find({'cart.items.PId':ProductID })
    .then(users=>{
        if(users.length>0){

            for( let user of users)
            {
                const index = user.cart.items.findIndex(item =>{
                    return item.PId.toString() === ProductID
                });
                    const quantity = user.cart.items[index].quantity;
                
                const upuser= user.cart.items.filter(item=>{
                    return item.PId.toString() !== ProductID
                });
                user.cart.items = upuser;
                user.cart.Total = user.cart.Total - this.price*quantity
                user.save()
                .then(res=>console.log("success"))
                .catch(err=> console.log(err));
            }


        }

    })
    .catch(err=>console.log(err));

}

ProductSchema.methods.editVisibleToCart = function(newPrice, oldPrice){

    User.find({'cart.items.PId':this._id.toString()})
    .then(users=>{
        if(users.length>0){
            for (let user of users)
            {
                const index = user.cart.items.findIndex(item =>{
                    return item.PId.toString() === this._id.toString()
                });
                    const quantity = user.cart.items[index].quantity;

                    let oldTotal = user.cart.Total - quantity*oldPrice;
                    user.cart.Total = oldTotal+quantity*Number(newPrice);

                    user.save()
                    .then(res=>console.log("success"))
                    .catch(err=>console.log(err));
            }
        }
    })
    .catch(err=>console.log(err));



}

module.exports= mongoose.model('Product',ProductSchema)
























/*

const getDb= require('../utils/database').getDb;
const mongodb = require('mongodb');

module.exports = class Product{
    constructor(name ,description , price, imageUrl){
        this.name =name;
        this.description =description;
        this.price = price;
        this.imageUrl =imageUrl;


    }
    save(){
        const db = getDb();
        return db.collection('product').insertOne(this)
        .then(result=> console.log(result))
        .catch(err=>console.log(err));

    }

    static findAll(){

        // getting the database connection
        const db = getDb();
        return db.collection('product').find().toArray()
       .then(products=>{
        
            console.log(products)
            return(products)
        } 
        )
        .catch(err=> console.log(err));
  
    }

    static getProductById(pid){
        const db = getDb();

        return db.collection('product').find({_id:new mongodb.ObjectID(pid)}).next()
        .then(product=>{
            console.log(product);
            return(product);
        })
        .catch(err=> console.log(err));
    }

    static delete(pid){
        const db = getDb();
        return db.collection('product').deleteOne({_id:new mongodb.ObjectID(pid)})
        .then((res)=>{
            console.log(res);
        })
        .catch(err=>console.log(err));
    }

    static update(pid,uname,udescription,uprice,uimageUrl){
        const db = getDb();
        return db.collection('product').updateOne({_id:pid}, 
            {$set:
                {
                    name:uname, 
                    description:udescription,
                    price: uprice,
                    imageUrl:uimageUrl

                            
                }})
        .then(res=>console.log(res))
        .catch(err=>console.log(err));
    }





}


/*

       
const products =[];

module.exports= class Product{

    constructor(name, description, price,imageUrl){
        this.name =name;
        this.price = price;
        this.id = Math.random()*Math.floor(100);
        if(description!=''){
            this.description=description;
        }
        else{
            this.description='No description provided'
        }
        if(imageUrl!=''){
            this.url=imageUrl;
        }
        else{
            this.url='';
        }
        this.cart=false;
    }

    storeProduct(){
         return(db.execute("INSERT INTO Products (name, description, url, price) VALUES (?,?,?,?)",[this.name,this.description,this.url,this.price]));
    }
    static getProducts(){
        //return(products);
       return(db.execute("SELECT * FROM Products"));
    }

     static editProduct(id,name,description,price,url){
       return(db.execute('UPDATE Products SET name = ? , description = ? , url = ? , price = ?  where id = ?',[name,description,url,price,id])); 

    }
    saveChanges(index){
        products[index]=this;
    }
    
    static delete(index){
        return(db.execute('DELETE FROM Products WHERE id = ?',[index]));
    }

    static cart(Product){
        Product.cart=true;
    }
    static rcart(id){
        const product = products.find(obj=>obj.id==id);
        product.cart=false;
    }
    static getProductById(id){
        return(db.execute('SELECT * FROM Products WHERE id =?',[id]));
    }
}
*/

/*

const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const product= sequelize.define('products',{
    id:{                                                                                                                                               
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    description: {
        type: Sequelize.TEXT
    },
    url:{
        type:Sequelize.STRING,

    } ,
    price:{
        type:Sequelize.FLOAT,
        allowNull: false
    }

});

module.exports = product;
*/
