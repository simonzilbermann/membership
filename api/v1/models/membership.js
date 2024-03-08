const mongoose=require('mongoose');
mongoose.pluralize(null);
const MemberShipSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Email:{type:String,require:true},
    Name:{type:String,require:true},
    Lastname:{type:String,require:true},
    Phone:{type:String,require:true},
    Address:{type:String,require:true},
    Dob:{type:String,require:true},
    Pass:{type:String,require:true},
    Status:Boolean,
    UsingSale:Boolean,
    Favorite:String,
    RecoverMod:Boolean

});
module.exports=mongoose.model("MemberShip",MemberShipSchema);


