const mongoose= require('mongoose');
const managers = require('../models/managers');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(12);

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
    Register:(req,res)=>{
        const {email,password,username}=req.body;
        console.log(username);
        const hashedPassword = bcrypt.hashSync(password, salt);
        managers.find({email}).then((rows)=>{
            if(rows.length > 0){
              return res.status(409).json({msg:`קיים מנהל עם מייל זה - ${email}`});
            }
            managers.find({username}).then((rows)=>{
                if(rows.length > 0){
                    return res.status(409).json({msg:` שם משתמש זה - ${username} קיים כבר במערכת בחר שם אחר`});
                }
                const manager=new managers({
                    _id:new mongoose.Types.ObjectId(),
                    mid:GetRandomString(9),
                    email,
                    password:hashedPassword,
                    username,
                    RecoverMod:false
                });
                manager.save().then((managerdata)=>{
                    return res.status(200).json({msg:managerdata});
                });
            });
       
        });
    },
    Login:(req,res)=>{
        let {username,pass}=req.body;
        username = username+"".toLowerCase();
        managers.find({username}).then((manager)=>{
            if(manager.length == 1 && bcrypt.compareSync(pass, manager[0].password) == true){
                req.session.isAuthenticated = true;
                return res.status(200).json({msg:manager[0]});
            } else return res.status(200).json({msg:null});
        });
    },
    ForgetMyPass:(req,res)=>{
        const {email} = req.body;
        
        managers.find({email}).then((rows)=>{
            if(rows.length > 0){
                req.session.recover = true;
                const protocol = req.protocol; 
                const domain = req.get('host'); 
                const recoverLink = `${protocol}://${domain}/recover_m_pass?email=${email}`;
                let subj = "קישור לאיפוס סיסמא" ;
                let body = `קישור: <br/> ${recoverLink}</br> קישור זה יהיה זמין לזמן מוגבל`;
                require('../../../emailsend').sendEmail(email,subj,body);
                const manager = rows[0];
                manager.RecoverMod = true;
                manager.save();
                return res.status(200).json({msg:"קישור לאיפוס סיסמא נשלח במייל"});
            }else return res.status(200).json({msg:"אימייל זה לא נמצא במערכת שלנו"});
        })
    
        
        
    },
    deletemanager:(req,res)=>{
        const {mid}=req.body;
        managers.deleteOne({mid}).then((rows)=>{
            if(rows.deletedCount > 0){
                return res.status(200).json({msg:"המנהל נמחק"});
            } else return res.status(417).json({msg:"אי אפשר למחוק"});
        });
    },
    getAll:(req,res)=>{
        managers.find({},{_id:false}).then((data)=>{
            if(data.length > 0){
                return res.status(200).json({msg:data});
            } else return res.status(417).json({msg:"לא נמצאו מנהלים"});
        });
    },
    updatepass:(req,res)=>{
        const {email,newpass,currentpass} = req.body;
        managers.find({email}).then((manager)=>{
            if(manager.length == 1 && bcrypt.compareSync(currentpass, manager[0].password)){
                var newhashpass =  bcrypt.hashSync(newpass, salt);
                managers.updateOne({email},{$set:{password:newhashpass}}).then((rows)=>{
                    if(rows.modifiedCount > 0){
                        return res.status(200).json({msg:"סיסמא עודכנה "});
                    } else return res.status(200).json({msg:"אי אפשר לעדכן את הסיסמא"});
                });
            } else return res.status(200).json({msg:"אחד מהפרטים שהזנת לא בכונים"});
        });
    },
    recover_password:(req,res)=>{
        const {email,newpass} = req.body;
        var newhashpass =  bcrypt.hashSync(newpass, salt);
        managers.updateOne({email},{$set:{password:newhashpass}}).then((data)=>{
            if(data.modifiedCount > 0){
                return res.status(200).json({msg:data.modifiedCount});
            } else return res.status(200).json({msg:0});
        });
    }
}