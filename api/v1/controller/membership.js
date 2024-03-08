const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const membership = require('../models/membership');
const orders = require('../models/order');
const products = require('../models/products');


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

    Get_All_Active:(req,res)=>{
        membership.find({Status:true},{_id:false}).then((data)=>{
            if(data.length > 0){ 
                return res.render('wm',{member:data});
            } else return res.render('notfound'); 
        });
    },
    Get_All_Active2:(req,res)=>{
        namedata = [];
        membership.find({Status:true},{_id:false}).then((data)=>{
            data.forEach(item => {
                namedata.push(item.Name + " " + item.Lastname);
            });
            if(namedata.length > 0){   
                return res.status(200).json({msg:namedata});
            } else return res.status(409).json({msg:null});
        });
    },
    Get_All_Active3:(req,res)=>{
        membership.find({Status:true},{_id:false}).then((data)=>{
            if(data.length > 0){
                return res.status(200).json({msg:data});
            } else return res.status(414).json({msg:null});
        });
    },
    Get_All:(req,res)=>{
        membership.find({},{_id:false}).then((data)=>{
            if(data.length > 0){
                return res.status(200).json({msg:data});
            } else return res.status(409).json({msg:null});
        });
    },
    Get_All_NotConfirmed:(req,res)=>{
        membership.find({Status:false},{_id:false}).then((data)=>{
            if(data.length > 0){
                return res.status(200).json({msg:data});
            } else return res.status(409).json({msg:null});
        });
    }, 
    Register:(req,res)=>{
        const {Email,Name,Lastname,Phone,Address,Dob}=req.body;
        var pass = GetRandomString(12);
        membership.find({Email}).then((rows)=>{
            if(rows.length > 0){
                return res.status(409).json({msg:`Email Allready Exist=${Email}`});
            }
            subj="סיסמת הרשמה: ";
            const protocol = req.protocol; // get protocol (http or https)
            const domain = req.get('host'); // get domain name
            const loginLink = `${protocol}://${domain}/loginMember?email=${Email}&pass=${pass}`;
            const body = `<h1>${pass}</h1></br>קישור לאימות חבר המועדון:</br> ${loginLink}</br><h1>שימו לב שיש לשמור את הסיסמא לאימות וכמו כן להחתברות בעת יצירת הזמנה באתר</h1>`;
            require('../../../emailsend').SendEmail(Email,subj,body);
            const member=new membership({
                _id:new mongoose.Types.ObjectId(),
                Email,
                Name,
                Lastname,
                Phone,
                Address,
                Dob,
                Pass:pass,
                Status:false,
                UsingSale:false,
                Favorite:" ",
                RecoverMod:false
            });
            member.save().then((members)=>{
                return res.status(200).json({msg:1});
            });
        });
    },
    Login:(req,res)=>{
        const {Email,pass}=req.body;
        membership.find({Email}).then((memb)=>{
            if(memb.length == 1 && memb[0].Pass == pass){
                membership.updateOne({Email},{$set:{Status:true}}).then((data)=>{
                    if(data.modifiedCount == 1){
                        return res.status(200).json({msg:"חבר המועדון שלך אומת בהצלחה \n אנו שמחים לקבל אותך למשפחתנו \n בכדי לממש חבר מועדון בחנות אנא הזדהה באמצעות המייל שלך"});
                    } else return res.status(200).json({msg:"חשבונך כבר אומת "});
                });
            } else return res.status(409).json({msg:"לצערנו לא הצלחנו לאמת את המייל שלך \n הסיסמא או המייל שגויים , אנא נסה שנית"}); 
        });
    },
    DeleteMember:(req,res)=>{
        membership.deleteOne({Email:req.params.Email}).then((data)=>{
            if(data.deletedCount > 0){
                return res.status(200).json({msg:"membership deleted"});
            } else return res.status(409).json({msg:"something wrong"});
        });
    },
    login_simple: (req, res) => {
        const { Email, Pass } = req.body;
        membership.find({ Email, Pass }).then((memb) => {
        if (memb.length === 0) {
            return res.status(409).json({ msg: 0 });
        } else if (!memb[0].Status) {
            return res.status(409).json({ msg: 2 });
        } else {
            req.session.loggedEmail = Email;
            return res.status(200).json({ msg: 1, member: memb });
        }
        }).catch((err) => {
            console.error(err);
            return res.status(500).json({ msg: "Internal Server Error" });
        });
    },
    get_all_member_orders:(req,res)=>{
        const Email = req.body;
        orders.find({email:Email.Email},{_id:false}).then((orders)=>{
            if(orders.length > 0 ){
                return res.status(200).json({msg:orders});
            }
            else{
                return res.status(200).json({msg:null});
            }
        });
    },
    add_favorite_prod_to_member:(req,res)=>{
        const {sku,email} = req.body;
        membership.updateOne({Email:email},{$set:{Favorite:sku}}).then((rows)=>{
            if(rows.modifiedCount > 0){
                return res.status(200).json({msg:rows.modifiedCount});
            } else return res.status(200).json({msg:0});
        });
      

    },
    remove_favorite_prod_from_member:(req,res)=>{
        const {sku,email} = req.body;
        membership.updateOne({Email:email},{$set:{Favorite:sku}}).then((rows)=>{
            if(rows.modifiedCount > 0){
                return res.status(200).json({msg:rows.modifiedCount});
            } else return res.status(200).json({msg:0});
        });
    },
    get_member_by_email:(req,res)=>{
        const Email = req.body;
        membership.find({Email},{_id:false}).then((member)=>{
            if(member.length == 1){
                return res.status(200).json({msg:member[0]});
            } else return res.status(200).json({msg:null});
        });
    },
    ForgetMemberPass:(req,res)=>{
        const {Email} = req.body;
        membership.find({Email}).then((rows)=>{
            if(rows.length > 0){
                const protocol = req.protocol; 
                const domain = req.get('host'); 
                const recoverLink = `${protocol}://${domain}/recover_member_pass?Email=${Email}`;
                let subj = "קישור לאיפוס סיסמא" ;
                let body = `קישור: <br/> ${recoverLink}</br> קישור זה יהיה זמין לזמן מוגבל`;
                require('../../../emailsend').SendEmail(Email,subj,body);
                const member = rows[0];
                member.RecoverMod = true;
                member.save();
                return res.status(200).json({msg:"קישור לאיפוס סיסמא נשלח במייל"});
            } else return res.status(200).json({msg:"אימייל זה לא נמצא במערכת שלנו"});
        })
    },
    recover_password:(req,res)=>{
        const {Email,newpass} = req.body;
        membership.updateOne({Email},{$set:{Pass:newpass}}).then((data)=>{
            if(data.modifiedCount > 0){
                return res.status(200).json({msg:data.modifiedCount});
            } else return res.status(200).json({msg:0});
        });
    },
    get_Favorite_prods:(req,res)=>{
        const {Email} = req.body;
        membership.find({Email}).then((member)=>{
            if(member.length == 1){
                var sku_Array  = member[0].Favorite;
                sku_Array = sku_Array.split(",");
                products.find({ Sku: { $in: sku_Array } }).then((prods) => {
                    const productarray = prods.map((prod) => prod.toObject());
                    return res.status(200).json({ msg: productarray });
                }).catch((err) => {
                    console.log(err);
                    return res.status(200).json({ msg:null});
                });
            } else return res.status(200).json({ msg:null});
        });
    },
    update_membership_data:(req,res)=>{
        const {Email,Name,Lastname,Phone,Address,Dob} = req.body;
        membership.updateOne({Email},{$set:{Email,Name,Lastname,Phone,Address,Dob}}).then((rows)=>{
            if(rows.modifiedCount > 0){
                return res.status(200).json({msg:rows.modifiedCount});
            } else return res.status(200).json({msg:0});
        })
    }
   
}