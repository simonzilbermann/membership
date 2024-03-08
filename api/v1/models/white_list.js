const mongoose=require('mongoose');
mongoose.pluralize(null);
const WhiteListSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    ipAddress:String,
    name:String
});
module.exports=mongoose.model("white_list",WhiteListSchema);


