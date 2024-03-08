
const mongoose = require('mongoose');
const categories = require('../models/category');
const products = require('../models/products');
const csv = require('csv-parser');
const request = require('request');

module.exports = {
    AddCategory: (req, res) => {
        const { cid, name } = req.body;
        categories.find({ cid }).then((rows) => {
            if (rows.length > 0) {
                return res.status(409).json({ msg: `Category Id Allready Exist=${cid}` });
            }
            const cat = new categories({
                _id: new mongoose.Types.ObjectId(),
                cid, name
            });
            cat.save().then((cat) => {
                return res.status(200).json({ msg: cat });
            });
        });
    },
    GetAllCat: (req, res) => {
        categories.find().then((rows) => {
            if (rows.length > 0) {
                return res.status(200).json({ msg: rows });
            } else return res.status(417).json({ msg: "not found categories" });
        });
    },
    AllProdByCid: (req, res) => {
        const cid = req.body;
        products.find({ NetanelPid: cid.cid }).then((rows) => {
            if (rows.length > 0) {
                return res.status(200).json({ msg: rows });
            } else return res.status(409).json({ msg: 0 });
        });
    },
    AllProdByCidRender: (req, res) => {
        const cid = req.body;
        products.find({ NetanelPid: cid.cid }).then((rows) => {
            if (rows.length > 0) {
                return res.render('prodbycat', { products: data });
            } else return res.render('not found');
        });
    },
    UpdateCategory: (req, res) => {
        const { name, cid } = req.body;
        categories.updateOne({ cid }, { $set: { name } }).then((rows) => {
            if (rows.modifiedCount > 0) {
                return res.status(200).json({ msg: rows });
            } else return res.status(497).json({ msg: "cant update" });
        });
    },
    MaxToMin: (req, res) => {
        const CatId = req.body;
        products.find({ NetanelPid: CatId.CatId }).then((data) => {
            console.log(data);
            if (data.length > 0) {
                data.sort((a, b) => b.Price - a.Price);
                return res.status(200).json({ msg: data });
            } else return res.status(417).json({ msg: "not ok" });
        });
    },
    MinToMax: (req, res) => {
        const CatId = req.body;
        products.find({ NetanelPid: CatId.CatId }).then((data) => {
            if (data.length > 0) {
                data.sort((a, b) => b.Price - a.Price);
                data.reverse();
                return res.status(200).json({ msg: data });
            } else return res.status(417).json({ msg: "not ok" });
        });
    },
    googlesheetcats: async (req, res) => {
        const cats = [];
        const dbcats = await categories.find({}, { _id: false, __v: false }); // קטגוריות מהדאטה בייס
        let updatedstr = "";
        let addedstr = "";
        const processCSV = () => {
            return new Promise((resolve, reject) => {
                request.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vS4-te597Aq7jQzehT7wV17WxMLjtDi9DcKjPrUnINscc9CPEH42UrorJDtlZRIfBa44fVfBd8qWiZz/pub?gid=0&single=true&output=csv")
                    .pipe(csv()).on('data', (row) => {
                        cats.push(row); // קטגוריות מהcsv
                    }).on('end', () => {
                        console.log('CSV file successfully processed');
                        resolve();
                    }).on('error', (err) => {
                        reject(err);
                    });
            });
        };
        try {
            await processCSV();
            const catValues = Object.values(cats[0]);
            const catIcons = Object.values(cats[1]);
            const catKeys = Object.keys(cats[0]);
            for (let i = 0; i < catKeys.length; i++) {
                let cid = catKeys[i];
                let name = catValues[i];
                let icon = catIcons[i];
                const existingCat = dbcats.find((c) => c.cid === cid);
                if (existingCat) {
                    await categories.updateOne({ cid }, { $set: { name, icon } });
                    updatedstr += `Updated category ${cid}` + " ,";
                } else {
                    const newCat = new categories({ _id: new mongoose.Types.ObjectId(), cid, name, icon });
                    await newCat.save();
                    addedstr += `Added category ${cid}` + " ,";
                }
            }
        } catch (err) {
            console.error(err);
        }
        let Email = 'raz@idus.co.il';
        let subj = 'דוח ייבוא קטגוריות';
        let body = "דוח מעודכנים: " + updatedstr + "</br>" + "דוח נוצרו: " + addedstr;
        require('../../../emailsend').sendEmail(Email, subj, body);
        return res.status(200).json({ msg: "all done" });
    },
    deleteall: (req, res) => {
        categories.deleteMany({}).then((rows) => {
            if (rows.deletedCount > 0) {
                return res.status(200).json({ msg: "all deleted" });
            } else return res.status(419).json({ msg: "cant delete" });
        });
    },
    get_popular_prods: (req, res) => {
        let random_array_prods = [];
        products.find().then((prods) => {
            const max_prods = 4;
            for (let i = 0; i < max_prods && prods.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * prods.length);
                random_array_prods.push(prods[randomIndex]);
                prods.splice(randomIndex, 1);
            }
            if (random_array_prods.length == max_prods) {
                return res.status(200).json({ msg: random_array_prods });
            } else return res.status(411).json({ msg: null });
        });
    }

};