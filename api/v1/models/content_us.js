const mongoose=require('mongoose');
mongoose.pluralize(null);
const Content_usSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    usid:String,
    name:String,
    lname:String,
    mail:String,
    phone:String,
    content:String,
    managerResponse:Array

});
module.exports=mongoose.model("Content_us",Content_usSchema);


