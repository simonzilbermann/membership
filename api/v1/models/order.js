const mongoose=require('mongoose');
mongoose.pluralize(null);
const OrderSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    orderId:String,
    items:Object,
    name:String,
    phone:String,
    shipmentAddress:String,
    email:String,
    createdAt:Date,
    totalPrice:Number,
    status:Number,
    shipmentcost:Number,
    hasDeliverd:Boolean,
    hasPayment:Boolean

    //status: 1 - pending to handle, 2 - hashandle , 3 - complete , 4 - cancel  

});
module.exports=mongoose.model("orders",OrderSchema);


