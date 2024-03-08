const request = require('request');
const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const products = require('./api/v1/models/products');
const fs = require('fs');
const emailSender = require('./emailsend');

function getRandomString(length) {
    let str = "";
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let index;
    for (let i = 0; i < length; i++) {
        index = Math.floor(Math.random() * chars.length);
        str += chars[index];
    }
    return str;
}

let globalEmail = "";
let arrProds = []; // Array of products from the CSV file
let dbProds = []; // Array of products from the database
let body = "";

async function entries() {
    let cntUpdate = 0;
    let cntAdded = 0;
    let reportedProds = [];

    for (const arrProd of arrProds) {
        const dbProd = dbProds.find((dbProd) => dbProd.Sku === arrProd.key);

        if (dbProd) {
            await products.updateOne(
                { Sku: arrProd.key },
                {
                    $set: {
                        ProdName: arrProd.prodname,
                        Price: arrProd.price,
                        Sale: arrProd.sale,
                        Description: arrProd.desc,
                        Url: arrProd.url,
                        Model: arrProd.model,
                        Qty: arrProd.qty
                    }
                }
            );
            cntUpdate++;
        } else {
            const catId = arrProd.key.split("-")[0];
            const singleProd = new products({
                _id: new mongoose.Types.ObjectId(),
                Pid: getRandomString(9),
                ProdName: arrProd.prodname,
                Price: arrProd.price,
                NetanelPid: catId,
                Description: arrProd.desc,
                Sale: arrProd.sale,
                Sku: arrProd.key,
                Url: arrProd.url,
                Model: arrProd.model,
                Qty: arrProd.qty
            });

            const result = await singleProd.save();
            reportedProds.push(arrProd);
            cntAdded++;
        }
    }

    reportedProds = JSON.stringify(reportedProds);
    body = `נוצרו ${cntAdded} מוצרים חדשים דוחון: ${reportedProds}  ו ${cntUpdate} מוצרים עודכנו`;
}

async function fetchDbProds() {
    const data = await products.find({}, { __v: false, _id: false });

    if (data.length > 0) {
        dbProds = data;
    }
}

module.exports = {
    readCsv: async (email) => {
        globalEmail = email.length > 0 ? email : "zilbermannsimon60@gmail.com";
        await fetchDbProds();

        try {
            const prods = await new Promise((resolve, reject) => {
                const result = [];
                request
                    .get(
                        "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4-te597Aq7jQzehT7wV17WxMLjtDi9DcKjPrUnINscc9CPEH42UrorJDtlZRIfBa44fVfBd8qWiZz/pub?gid=772191786&single=true&output=csv"
                    )
                    .pipe(csvParser())
                    .on('data', (row) => {
                        result.push(row);
                    })
                    .on('end', () => {
                        resolve(result);
                    })
                    .on('error', (err) => {
                        reject(err);
                    });
            });

            arrProds = [...prods];
            console.log('CSV file successfully processed');
        } catch (err) {
            console.error(err);
        }

        await entries();
        module.exports.report();
        dbProds = [];
        arrProds = [];
    },

    report: async () => {
        console.log("run");
        await emailSender.sendEmail(globalEmail, "דוח ייבוא מוצרים", body);
    }
};
