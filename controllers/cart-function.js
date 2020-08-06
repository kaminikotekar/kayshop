
const Product = require('../models/product');
const Users = require('../models/user');
const product = require('../models/product');
const Order = require('../models/Order');
//const { resolveInclude } = require('ejs');


exports.getCart = (req,res,next)=>{

    Users.findById(req.session.user._id)
    .then(user=>{

        user.populate('cart.items.PId')
        .execPopulate()
        .then(result=>{
            res.render('cart',{
                url:'/cart',
                page:'Your Cart',
                cart: result.cart,
        });
    })
    .catch(err=>console.log(err));
})
.catch(err=>console.log(err));
}



/*
    console.log("Cart products are" +cart.price);
    res.render('cart',{
        url:'/cart',
        page:'Your Cart',
        cart: cart
    });
    */


exports.addtoCart =(req,res,next) =>{
    console.log("req is posted");
    const id= req.body.id;
    Product.findById(id)
    .then(product=>{
        req.user.addToCart(product).
        then(result=>{
            res.redirect('/cart');
            console.log("successful")
        } )
        .catch(err=>console.log(err));

    })
    .catch(err=>console.log(err));
}

    

exports.deleteCart=(req,res,next)=>{

    req.user.populate('cart.items.PId')
    .execPopulate()
    .then(result=>{
        const id = req.body.id;
        const prod = result.cart.items.find(item=>{
            return item.PId._id.toString()=== id.toString()
        });
        req.user.deleteFromCart(prod)
        .then(()=>{
            res.redirect('/cart');
        console.log("successuly deleted");

        })
        .catch(err=> console.log(err));
    })
    .catch(err=>console.log(err));


  /*

    const id = req.body.id;
    console.log(id);
    req.user.deleteFromCart(id)
    .then(()=>{
        res.redirect('/cart');
        console.log("successuly deleted");
    }).catch(err=>console.log(err));
 */   

     
}

exports.postMakeOrder=(req,res,next)=>{
    req.user.populate('cart.items.PId')
    .execPopulate()
    .then(result=>{
        const product = result.cart.items.map(i=>{
            return {quantity: i.quantity, PId: {...i.PId._doc}};
        });
        console.log(product);
        const order = new Order({
            products:product,
            Total: result.cart.Total,
            user:{
                userId:req.session.user._id,
                name: req.session.user.name
            }
        });
       order.save()
       .then(()=>{
          // console.log("inside then");
           req.user.clearCart()
           .then(()=>res.redirect('cart'));
       }).catch(err=>console.log(err)); 
    })
}

exports.getOrders=(req,res,next)=>{

    Order.find({'user.userId':req.session.user._id})
        //.execPopulate()
        .then(result=>{

            res.render('orders',{
                url:"/orders",
                page:"Orders",
                orders: result,
                IsLoggedIn : req.session.IsLoggedIn
            });

        })
    .catch(err=>console.log(err));


}




module.exports.emailComfirm=(req,res,next)=>{
    res.render('emailTemplate',{
        name:'Kamini kotekar'
    });
}