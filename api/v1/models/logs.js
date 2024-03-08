const mongoose=require('mongoose');
mongoose.pluralize(null);
const LogsSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    log_id:String,
    log_type: {
        type: String,
        enum: ['import','pdf_binary','categories','coupons','orders', 'error','rules','cart','managers','membership','view','products','white_list','redirects'],
        default: 'action',
    },
    action:String,
    message: String,
    userAgent:String,
    created_at:String,
    managerDetials:String
});
module.exports=mongoose.model("logs",LogsSchema);


