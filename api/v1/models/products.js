const mongoose=require('mongoose');
mongoose.pluralize(null);
const ProductsSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Pid:String,
    NetanelPid:String,
    ProdName:String,
    Url:String,
    Price:Number,
    Description:String,
    Sale:String,
    Sku:String,
    Model:String,
    Qty:Number
});
module.exports=mongoose.model("Products",ProductsSchema);


