const mongoose=require('mongoose');
const orders = require('../models/order');
const membership = require('../models/membership');

function GetRandomString(length){
    let str="";
    const chars="01203405670890";
    let index;
    for(let i=0;i<length;i++){
        index=Math.floor(Math.random() * chars.length);
        str+=chars[index];
    }
    return str;
}

module.exports={
    add_order: async(req, res) => {
        const orderId = GetRandomString(15);
        const items = req.session.cart || [];
        if (items.length == 0){
            return res.status(409).json({msg: "הזמנה עם סל ריק !!"});
        }
        let totalPrice = 0;
        for(let i =0;i<items.length;i++){
            totalPrice += items[i].sum;
        }  
        const {name, phone, shipmentAddress, email,shipmentcost} = req.body;
        const hasDeliverd = false;
        const hasPayment = false;
        const createdAt = new Date().toLocaleString();
        const status = 1;
        const order = new orders({
            _id: new mongoose.Types.ObjectId(),
            orderId,
            items,
            name,
            phone,
            shipmentAddress,
            email,
            createdAt,
            status,totalPrice,shipmentcost,hasDeliverd,hasPayment
        });
        order.save().then((orderdata) => {          
            require('../../../invoice').invoice_pdf(req,orderdata);
            let Email =orderdata.email;
            let subj = "ההזמנה חדשה מצורפת";
            let body = `קישור למסמך הזמנה שלך :<br/> https://${req.headers.host}/public/invoices/invoice_${orderdata.orderId}.pdf`;
            require('../../../emailsend').SendEmail(Email,subj,body);
            let managerEmail = "netanel100035@gmail.com";
            let managerSubj = "הזמנה חדשה נוצרה במערכת!!!";
            let managerBody = `הזמנה חדשה נוצרה גש לטפל בה <br/> https://${req.headers.host}/public/invoices/invoice_${orderdata.orderId}.pdf`;
            require('../../../emailsend').SendEmail(managerEmail,managerSubj,managerBody);
            req.session.cart = [];
            return res.status(200).json({msg: 1,order:orderdata});
        });
    },
    get_all_orders:(req,res)=>{
        orders.find({},{_id:false}).then((data)=>{
            if(data.length > 0 ){
                return res.status(200).json({msg:data});
            } else return res.status(409).json({msg:null});
        });
    },
    update_order_status:(req,res)=>{
        const {status,orderId} = req.body;
        orders.updateOne({orderId},{$set:{status}}).then((rows)=>{
            if(rows.modifiedCount > 0){
                return res.status(200).json({msg:1});
            } else return res.status(409).json({msg:0});
        });
    },
    cancel_order:(req,res)=>{

    },
    close_order:(req,res)=>{
        const {orderId} = req.body;
        orders.deleteOne({orderId}).then((rows)=>{
            if(rows.deletedCount > 0){
                return res.status(200).json({msg:"order deleted"});
            }
        });
    },
    delete_all:(req,res)=>{
        orders.deleteMany({}).then((rows)=>{
            if(rows.deletedCount > 0){
                return res.status(200).json({msg:"all deleted"});
            }
        });
    },
    get_order_by_id:(req,res)=>{
        const {orderId} = req.body;
        console.log(orderId);
        orders.findOne({orderId},{_id:false}).then((data)=>{
            if(data !=  null){
                return res.status(200).json({msg:data});
            } else return res.status(200).json({msg:null});
        });
    },
    update_has_delevired:(req,res)=>{
        const {hasDeliverd,orderId} = req.body;
        orders.updateOne({orderId},{$set:{hasDeliverd}}).then((rows)=>{
            if(rows.modifiedCount > 0 ){
                return res.status(200).json({msg:1});
            } else return res.status(409).json({msg:0});
        });
    },
    update_has_payment:(req,res)=>{
        const {hasPayment,orderId} = req.body;
        orders.updateOne({orderId},{$set:{hasPayment}}).then((rows)=>{
            if(rows.modifiedCount > 0 ){
                return res.status(200).json({msg:1});
            } else return res.status(409).json({msg:0});
        });
    }    
}