const Product= require('../models/product'); 
const {validationResult} = require('express-validator/check');
const { compare } = require('bcryptjs');
//const mongodb = require('mongodb');
//const ObjectID=mongodb.ObjectId;

exports.getProducts=(req,res,next)=>{
    Product.find()
    .then(products=>{
        res.render('products',{
            page:'products',
            products:products,
            url:'/products',
            IsLoggedIn : req.session.IsLoggedIn
        
            })
    })
    .catch(err=>console.log(err));

    /*
                        Product.getProducts()
                        .then(([row,fields])=>{
                            console.log(row);
                            res.render('products',{
                                    page:'products',
                                    products:row,
                                    url:'/products',
                                        
                                    });
                                    
                        })
.catch(err=>{
    console.log(err);
});
*/
 //   console.log(allproducts);
    
        

}
exports.getAddproduct=(req,res,next)=>{
    res.render('forms/productForm',{
        page:'products',
        url:'/addProduct',
        edit: false,
        IsLoggedIn : req.session.IsLoggedIn,
        error: '',
        data : {
            name:'',
            description:'',
            price:''
        }
    });
}

exports.postAddproduct=(req,res,next)=>{
 //   console.log(req.body);

 const error = validationResult(req);
 if(!error.isEmpty()){
    return res.status(422).render('forms/productForm',{
        page:'products',
        url:'/addProduct',
        edit: false,
        error: error.array()[0].msg,
        data:{
            name: req.body.name,
            description: req.body.description,
            price : req.body.price
        }
      });
 }

  const file = req.file;
  if(!file){
     return res.status(422).render('forms/productForm',{
        page:'products',
        url:'/addProduct',
        edit: false,
        error: 'Please upload a valid image',
        data:{
            name: req.body.name,
            description: req.body.description,
            price : req.body.price
        }
      });
  }
  const imageUrl = file.path;
  var split=imageUrl.split('/');
  split.shift();
  var newUrl = split.join('/');
 // console.log(newUrl);
    
  const product= new Product({name:req.body.name,
                             description:req.body.description,
                             price:req.body.price,
                             imageUrl:newUrl,
                             user:req.session.user._id});
  product.save()
  .then(()=>{
    res.redirect('/products');
  })
  .catch(err=>{
      console.log(err);
  });
/*
    Product.create({
        name: req.body.name,
        description: req.body.description,
        url : req.body.url,
        price : req.body.price

    }).then(result=>{
        res.redirect('/products');
    })
    .catch(err=>console.log(err));
/*
    product.storeProduct()
    .then(([row])=>{
        res.redirect('/products');
    })
    .catch(err=>{
        console.log(err);
    });

*/
  //  console.log(req.body);

}

exports.getSingleProduct=(req,res,next)=>{
    //params are used to capture /:pid
    const productID = req.params.pid;

    Product.findById(productID)
    .then(targetproduct=>{
        if(req.session.IsLoggedIn){
            if(targetproduct.user.toString()!== req.user._id.toString()){
                req.flash('hide','true');

            }
         }
        const flashMsg = req.flash('hide');
        var hidden = null;
        if(flashMsg.length>0){
            hidden = flashMsg[0];
        }
        res.render('SingleProduct',{
            url: '/singleP',
            page:targetproduct.name,
            product:targetproduct,
            hidden : hidden
        });
    })
    .catch(err=>console.log(err));

   /*
   Product.findById(productID)
   .then(([targetproduct])=>{
    res.render('SingleProduct',{
        url: '/singleP',
        page:targetproduct[0].name,
        product:targetproduct[0]

        })   
    })
   .catch(err=>{
       console.log(err);
   })
   */
 
}

 exports.editProduct=(req,res,next)=>{

    const productID = req.params.pid;

    Product.findById(productID)
    .then(targetproduct=>{
      //  console.log(targetproduct.user.toString());
      //  console.log(req.session.user._id.toString());

        if(targetproduct.user.toString()!== req.session.user._id.toString()){
            return res.redirect('/products/'+productID);
        }
        let error = null;
        const flashMsg = req.flash('error');
        const flashprod = req.flash('prod');
        let product = targetproduct;
        
        if(flashMsg.length>0){
            error = flashMsg[0].msg
        }
        if(flashprod.length>0){
            product = flashprod[0]
        }

        res.render('forms/productForm',{
            url :'/addProduct',
            edit: req.query.edit,
            page: targetproduct.name,
            product: product,
            error: error
        });
      
     })
    .catch(err=>{
        console.log(err);
    })

    
  
  //  console.log(req.query.edit);

 }
 
 exports.postEditProduct=(req,res,next)=>{
     const error = validationResult(req);

    Product.findById(req.body.id)
    .then(targetproduct=>{
        if(!error.isEmpty()){
            req.flash('error', error.array()[0]);
            req.flash('prod', {_id:targetproduct._id, name:req.body.name, description:req.body.description, price:req.body.price});
           return res.redirect('/addProduct/'+targetproduct._id+'?edit=true');
        }

        const oldPrice = targetproduct.price;
        const file = req.file;
        targetproduct.name=req.body.name;
        targetproduct.description=req.body.description;
        targetproduct.price=req.body.price;
        if(file){
            const imageUrl = file.path;
            var split=imageUrl.split('/');
            split.shift();
            var newUrl = split.join('/');
            targetproduct.imageUrl = newUrl;
        }
      targetproduct.save()
      .then(result=>{
        targetproduct.editVisibleToCart(req.body.price, oldPrice);
        res.redirect('/products/'+req.body.id); 
      })
      .catch(err=>console.log(err));
    //  res.redirect('/products/'+req.body.id); 
    })
    .catch(err=>console.log(err));

/*
    let id = new ObjectID(req.body.id)
    Product.update(id,req.body.name,req.body.description,req.body.price,req.body.url)
    .then(result=>{
        console.log("product updated");
        res.redirect('/products/'+req.body.id);
    })
    .catch(err=>console.log(err));
*/
 }

 exports.deleteProduct=(req,res,next)=>{
   // console.log("id is "+req.body.id);
   Product.findById(req.body.id)
   .then(prod=>{
       if(prod.user.toString()!==req.session.user._id.toString()){
           return res.redirect('/products'+req.body.id);
       }
       Product.findByIdAndRemove(req.body.id)
        .then(()=>{
            prod.removeFromCart(req.body.id);
            res.redirect('/products');
    })
    .catch(err=>console.log(err));


   })
   .catch(err=>console.log(err));


 }



