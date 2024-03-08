const mongoose=require('mongoose');
mongoose.pluralize(null);
const RedirectsSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Request_path:String,
    Target_path:String
});
module.exports=mongoose.model("redirects",RedirectsSchema);


