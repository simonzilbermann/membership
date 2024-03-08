const mongoose=require('mongoose');
mongoose.pluralize(null);
const CategorySchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    cid:String,
    name:String,
    icon:String

});
module.exports=mongoose.model("Category",CategorySchema);


