
const mongoose = require("mongoose");
const Schema= mongoose.Schema;

const OrderSchema = new Schema({
  products:[
      {
          PId: {
              type:Object,
              required: true,
              ref : 'Product'
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
  },
  user:{
      userId: {
          type: Schema.Types.ObjectId,
          required:true,
          ref:'User'
      },
      name :{
          type:String,
          required:true,
      },
  }
    

})


module.exports = mongoose.model('Order',OrderSchema);