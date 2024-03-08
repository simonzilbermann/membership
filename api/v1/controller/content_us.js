
const mongoose= require('mongoose');
const content_us = require('../models/content_us');


function GetRandomString(length){
    let str="";
    const chars="0123456789";
    let index;
    for(let i=0;i<length;i++){
        index=Math.floor(Math.random() * chars.length);
        str+=chars[index];
    }
    return str;
}

module.exports={

    GetAllContent:async(req,res)=>{
        try{
            const data = await content_us.find({});
            return res.status(200).json({data});
        }catch(error){
            return res.status(500).json({error});
        }
    },


    AddContent:async(req,res)=>{
        try{
            const {name,lname,mail,phone,content} = req.body;
            const usid =  GetRandomString(10);
            const newContent = new content_us({
                _id: new mongoose.Types.ObjectId(),
                usid,
                name,
                lname,
                mail,
                phone,
                content,
                managerResponse:[]
            });
            await newContent.save();
            await require('../../../emailsend').SendEmail(mail,"היי פנייתך התקבלה מספר- "+ usid, content);
            return res.status(200).json('Content add successfully');

        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    UpdateContent:async(req,res)=>{
        try{
           const {usid, managerResponse} = req.body;


           const existingContent = await content_us.findOne({usid});
            if(!existingContent){
                return res.status(404).json({ error: "Content not found" });
            }
            console.log(existingContent);
            await require('../../../emailsend').SendEmail(existingContent.mail,"התקבלה תגובה חדשה - "+ usid, managerResponse);
            existingContent.managerResponse.push(managerResponse);
            existingContent.save();
            return res.status(200).json({existingContent}); 
         
        }catch(error){
            return res.status(500).json({error});
        }
    },
    
    DeleteContent:async(req,res)=>{
        try{
            const {usid} = req.body;
            await content_us.deleteOne({usid}).then(() => {
                res.status(200).json("Content deleted successfully");
            }).catch((error) => {
                res.status(500).json({error});
            });
 
         }catch(error){
             return res.status(500).json({error});
         }
    }


};