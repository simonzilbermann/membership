const mongoose=require('mongoose');
mongoose.pluralize(null);
const CouponSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    CouponCode:String,
    TypeSale:{
        type: String,
        enum: ['%','$'],
        default: '00000000',
    },
    name:String,
    shortDescription:String,
    valueSale:Number,
    Created_At:String,
    Active:Boolean
});
module.exports=mongoose.model("Coupons",CouponSchema);


