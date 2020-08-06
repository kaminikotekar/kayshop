const path= require('path');
const express = require("express");
const productFunction= require("../controllers/product-function");
const cartFunction = require("../controllers/cart-function");
const routeSafety = require('../middleware/route_protection');
const {body,check} = require('express-validator/check'); 


const router = express.Router();

router.get('/products', productFunction.getProducts)

router.get('/addProduct',routeSafety,productFunction.getAddproduct);

router.post('/addProduct',routeSafety,
[
    body('name').isString().isLength({min:3}).trim().withMessage('Product name is invalid'),
    body('price').isFloat().custom((value,{req})=>{
        if(value<0){
            throw new Error('Please enter a positive price for the product')
        }
        else{
            return true;
        }
    }),
    body('description').isLength({min:10, max:250}).withMessage("Description should be more than 10 characters and less than 250 ")


]
,productFunction.postAddproduct);

router.get('/products/:pid',productFunction.getSingleProduct);

router.get('/addProduct/:pid',routeSafety, productFunction.editProduct);

router.post('/editProduct',routeSafety,
[
    body('name').isString().isLength({min:3}).trim().withMessage('Product name is invalid'),
    body('price').isFloat().custom((value,{req})=>{
        if(value<0){
            throw new Error('Please enter a positive price for the product')
        }
        else{
            return true;
        }
    }),
    body('description').isLength({min:10, max:250}).withMessage("Description should be more than 10 characters and less than 250 ")


]
, productFunction.postEditProduct);

router.post('/delete', routeSafety,productFunction.deleteProduct);

router.get('/cart', routeSafety, cartFunction.getCart);

router.post('/cart',routeSafety, cartFunction.addtoCart);

router.post('/deleteCart',routeSafety, cartFunction.deleteCart);

router.post('/order',routeSafety,cartFunction.postMakeOrder);

router.get('/orders',routeSafety,cartFunction.getOrders);


router.get('/emailLogin', cartFunction.emailComfirm);

module.exports = router;
