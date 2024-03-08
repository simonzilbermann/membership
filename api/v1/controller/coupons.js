const mongoose= require('mongoose');
const coupons = require('../models/coupons');


function GetRandomString(length){
    let str="";
    const chars="aA0bBc1CdDeE2fFgG3hH4iIjJ5kKlKmM6nNoOp7PqQrRs8StTuUv9VwWxXyYzZ";
    let index;
    for(let i=0;i<length;i++){
        index=Math.floor(Math.random() * chars.length);
        str+=chars[index];
    }
    return str;
}


module.exports={
    get_all_coupons:(req,res)=>{
        coupons.find({}).then((rows)=>{
            if(rows.length > 0)
                return res.status(200).json({msg:rows});
            else return res.status(200).json({msg:null});                
        })
    },
    generate_coupon: async (req, res) => {
        const { TypeSale, name, shortDescription, valueSale, length_of_code, numbers_of_coupons } = req.body;
      

        const coupons_result = [];
        
        for (let i = 0; i < numbers_of_coupons; i++) {
          const couponCode = GetRandomString(length_of_code);
          const created_at = new Date().toLocaleString('he-IL', {
            timeZone: 'Asia/Jerusalem',
            hour12: false,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
      
          const newCoupon = new coupons({
            _id: new mongoose.Types.ObjectId(),
            CouponCode: couponCode,
            TypeSale,
            name: name + "_" + i,
            shortDescription,
            valueSale,
            Created_At: created_at,
            Active: true
          });
      
          try {
            const savedCoupon = await newCoupon.save();
            coupons_result.push(savedCoupon);
          } catch (error) {
            return res.status(500).json({ error: error.message });
          }
        }
      
        return res.status(200).json({ msg: coupons_result });
    },
      
    create_coupon:(req,res)=>{
        const {TypeSale,name,shortDescription,valueSale,CouponCode} = req.body;
        const created_at = new Date().toLocaleString('he-IL', {
            timeZone: 'Asia/Jerusalem',
            hour12: false,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        coupons.findOne({ CouponCode: CouponCode }).then((existingCoupon) => {
            if (existingCoupon) {
            return res.status(200).json({ msg: null });
            } else {
            const newCoupon = new coupons({
                _id: new mongoose.Types.ObjectId(),
                CouponCode: CouponCode,
                TypeSale,
                name,
                shortDescription,
                valueSale,
                Created_At: created_at,
                Active: true
            });

            newCoupon.save()
                .then((savedCoupon) => {
                res.status(201).json({ msg: savedCoupon });
                })
                .catch((error) => {
                res.status(500).json({ error: error.message });
                });
            }
        }).catch((error) => {
            res.status(500).json({ error: error.message });
        });

    },
    delete_many_coupons:(req,res)=>{
        const { couponCodes } = req.body;
        coupons.deleteMany({ CouponCode: { $in: couponCodes } }).then(() => {
            res.status(200).json({ msg: "Coupons deleted successfully" });
        }).catch((error) => {
            res.status(500).json({ error: error.message });
        });
    },
    delete_all_coupons:(req,res)=>{
        coupons.deleteMany({}).then(() => {
        res.status(200).json({ msg: "All coupons deleted successfully" });
        }).catch((error) => {
            res.status(500).json({ error: error.message });
        });
    },
    update_coupon: (req, res) => {
        const { TypeSale, name, shortDescription, valueSale, CouponCode ,active } = req.body;
      
        coupons.findOne({ CouponCode: CouponCode }).then((existingCoupon) => {
            if (!existingCoupon) {
              return res.status(404).json({ error: "Coupon not found" });
            }
            existingCoupon.TypeSale = TypeSale;
            existingCoupon.name = name;
            existingCoupon.shortDescription = shortDescription;
            existingCoupon.valueSale = valueSale;
            existingCoupon.Active = active;
            existingCoupon.save().then((updatedCoupon) => {
                res.status(200).json({ msg: updatedCoupon });
            }).catch((error) => {
                res.status(500).json({ error: error.message });
            });
        }).catch((error) => {
            res.status(500).json({ error: error.message });
        });
    },
    get_coupon_by_id:(req,res)=>{
        const {  CouponCode  } = req.body;
        console.log(CouponCode);
        coupons.findOne({ CouponCode }).then((existingCoupon) => {
            if(existingCoupon)
                res.status(200).json({ msg: existingCoupon });
            else
                return res.status(200).json({ msg: null });

        });
    }
      

};