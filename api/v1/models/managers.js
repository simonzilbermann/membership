const mongoose=require('mongoose');
mongoose.pluralize(null);
const ManagerSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
   mid:String,
   email:String,
   username:String,
   password:String,
   RecoverMod:Boolean

});
module.exports=mongoose.model("Managers",ManagerSchema);


