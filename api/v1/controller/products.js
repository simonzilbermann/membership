const mongoose= require('mongoose');
const products = require('../models/products');
const fs = require('fs');

function GetRandomString(length){
    let str="";
    const chars="abcdefghijklmnopqrstuvwxyz0123456789";
    let index;
    for(let i=0;i<length;i++){
        index=Math.floor(Math.random() * chars.length);
        str+=chars[index];
    }
    return str;
}

module.exports={
    GetAll3:(req,res)=>{
        const cid = req.body;
        console.log(cid);
        products.find({NetanelPid:cid.cid}).then((data)=>{
            if(data.length > 0){
                return res.render('Prodacts',{products:data});
            } else return res.render('notfound');
        });
    },
    GetAll2:(req,res)=>{
        products.find().then((data)=>{
            if(data.length > 0){
                return res.render('Prodacts',{products:data});
            } else return res.render('notfound');
        });
    },
    GetAll:(req,res)=>{
        products.find({}).then((data)=>{
            if(data.length > 0){
                return res.status(200).json({msg:data});
            } else return res.status(409).json({msg:"not found"});
        });
    },
    GetAllNames:(req,res)=>{
        var names = [];
        products.find({}).then((data)=>{
            data.forEach(item =>{
                names.push(item.ProdName);
            });
            if(names.length > 0) {
                return res.status(200).json({mag:names});
            } else return res.status(414).json({msg:"no prod founds"});
        });
    },
    AddProd:(req,res)=>{
        const {ProdName,Url,NetanelPid,Price,Description,Sale}=req.body;
        let cid = NetanelPid.split('-');
        const pid = GetRandomString(4);
        products.find({Sku:NetanelPid}).then((rows)=>{
            if(rows.length > 0){
                return res.status(409).json({msg:`Product name Allready Exist=${ProdName}`});
            }
            const prod=new products({
                _id:new mongoose.Types.ObjectId(),
                Pid:pid,
                ProdName,
                Url,
                Price,
                NetanelPid:cid[0],
                Description,Sale,Sku:NetanelPid
            });
            prod.save().then((prod)=>{
                return res.status(200).json({msg:prod});
            })
        })
    },
    DeleteProd:(req,res)=>{
        const Sku = req.body;
        products.deleteOne({Sku:Sku.Sku}).then((data)=>{
            if(data.acknowledged){
                return res.status(200).json({msg:"product deleted"});
            } else return res.status(409).json({msg:"something wrong"});
        });
    },
    DeleteProdParams:(req,res)=>{
        const Sku = req.params.Sku;   
        products.deleteOne({Sku:Sku}).then((data)=>{
            if(data.deletedCount > 0 ){
                return res.status(200).json({msg:"product deleted"});
            } else return res.status(409).json({msg:"something wrong"});
        });
    },
    UpdateProdPic:(req,res)=>{
        const {Url,Sku}=req.body;
        console.log(Url);
        console.log(Sku);
        products.updateOne({Sku},{$set:{Url}}).then((data)=>{
            if(data.modifiedCount > 0){
                return res.status(200).json({msg:"product image update  seccessfuly"});
            } else return res.status(409).json({msg:"something wrong"});
        });
    },
    UpdateProd:(req,res)=>{
        const {ProdName,Price,Sku,Description,Sale}=req.body;
        products.updateOne({Sku},{$set:{ProdName,Price,Sale,Description}}).then((data)=>{
            if(data.modifiedCount > 0){
                return res.status(200).json({msg:"product update  seccessfuly"});
            } else return res.status(409).json({msg:"something wrong"});
        });
    },
    GetProdById:(req,res)=>{
        const Sku = req.body;
        console.log(Sku);
        products.find({Sku:Sku.Sku}).then((data)=>{
            if(data.length == 1 ){
                return res.status(200).json({msg:data});
            } else return res.status(200).json({msg:"product not found"});
        });
    },
    GetCsvProds: async (req, res) => {
        const email = req.body.Email;
    
        try {
            await require('../../../sheetgoogle').readCsv(email);
            res.status(200).json({ success: true, message: 'CSV processing initiated successfully.' });
        } catch (error) {
            console.error('Error processing CSV:', error);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    },
    
    DelteAll:(req,res)=>{
        products.deleteMany().then((rows)=>{
            if(rows.deletedCount > 0 ){
                return res.status(200).json({msg:"all deleted"});
            } else return res.status(200).json({msg:"nothing deleted"});
        });
    },
    delete_image_prod:(req,res)=>{
        console.log(req.body);
        const fileNameToDelete = req.body.file_name;
        fs.unlink('./public/pics/' + fileNameToDelete, (err) => {
            if (err) {
                return res.status(405).json({msg:err});
            } else return res.status(200).json({msg: `הקובץ ${fileNameToDelete} נמחק בהצלחה`});    
        });
    },
    search_prods:(req,res)=>{
        const searchQuery = req.body['search-query'];
        const regex = new RegExp(searchQuery, 'i');
        products.find({ $or: [{ Sku: regex }, { ProdName: regex }] }).then(result => {
           return res.render('search_result',{products:result,no_result:searchQuery});
        });
    },
    delete_all_prods:(req,res)=>{
        products.deleteMany({}).then((rows)=>{
            if(rows.deletedCount > 0){
                return res.status(200).json({msg:"all deleted"});
            } else return res.status(419).json({msg:"cant delete"});
        });
    }
}