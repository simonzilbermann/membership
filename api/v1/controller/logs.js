const mongoose= require('mongoose');
const logs = require('../models/logs');

function GetRandomString(length){
    let str="";
    const chars="010230450670890";
    let index;
    for(let i=0;i<length;i++){
        index=Math.floor(Math.random() * chars.length);
        str+=chars[index];
    }
    return str;
}

module.exports={
    

    add_log:(req,res)=>{
        const log_id = GetRandomString(10);
        const {log_type,action,message,userAgent,managerDetials} = req.body;
        const created_at = new Date().toLocaleString('he-IL', {
            timeZone: 'Asia/Jerusalem',
            hour12: false,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        const log = new logs({
            _id:new mongoose.Types.ObjectId(),
            log_id,log_type,action,message,userAgent,created_at,managerDetials
        });
        log.save().then((logresult)=>{
            return res.status(200).json({msg:logresult});
        });
    },
    get_all_logs:(req,res)=>{
        logs.find({},{id:false}).then((data)=>{
            if(data.length > 0){
                return res.status(200).json({msg:data});
            } else return res.status(407).json({msg:null});
        });
    },
    remove_all_logs:(req,res)=>{
        logs.deleteMany().then((rows)=>{
            if(rows.deletedCount > 0){
                return res.status(200).json({msg:rows.deletedCount});
            } else return res.status(407).json({msg:0});
        });
    },
    get_log_by_id:(req,res)=>{
        const log_id = req.body;
        logs.find({log_id:log_id.log_id},{id:false}).then((data)=>{
            if(data.length > 0){
                return res.status(200).json({msg:data});
            } else return res.status(407).json({msg:null});
        });
    },
    get_log_by_type:(req,res)=>{
        const log_type = req.body;
        logs.find({log_type:log_type.log_type},{id:false}).then((data)=>{
            if(data.length > 0){
                return res.status(200).json({msg:data});
            } else return res.status(407).json({msg:null});
        });
    },
    remove_log_by_id:(req,res)=>{
        
    }
};