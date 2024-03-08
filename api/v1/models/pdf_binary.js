const mongoose=require('mongoose');
mongoose.pluralize(null);
const PdfBinarySchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    pdf_id:String,
    pdf_name_file:String,
    pdf:Buffer

});
module.exports=mongoose.model("pdf_binary",PdfBinarySchema);


