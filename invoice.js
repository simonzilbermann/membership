const fs = require('fs');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fontkit = require('fontkit');

module.exports = {
  invoice_pdf: async (req, orderdata, companyName = 'Company Name') => {
    try {
      const items = orderdata.items.map(item => {
        const lastSlashIndex = item.prodPic.lastIndexOf('/');
        const picName = item.prodPic.substring(lastSlashIndex + 1);
        return {
          quantity: item.quantity,
          description: item.productName,
          price: item.productPrice,
          pic: `public/pics/${picName}`,
          shipmentcost: item.shipmentcost
        }
      });

   
      const pdfDoc = await PDFDocument.create();
      pdfDoc.registerFontkit(fontkit);
      const fontBytes = fs.readFileSync('public/fonts/TaameyDavidCLM-Medium.ttf');
      const customFont = await pdfDoc.embedFont(fontBytes);

      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const logoImage = await pdfDoc.embedPng(fs.readFileSync('public/pics/logopdf.png'));

      page.drawImage(logoImage, {
        x: 50,
        y: height - 110,
        width: 100,
        height: 100,
      });

      const leftTextX = 360;
      const rightTextX = 150;
      const y = height - 51;

      page.drawText('מרכז הקפה והטבק', {
        x: leftTextX,
        y:y-10,
        size: 30,
        font: customFont,
        color: rgb(0, 0, 0),
        textDirection: 'rtl',
        alignment: 'right'
      });
      
      page.drawText(`מספר הזמנה: `, {
        x: leftTextX+105,
        y: y - 60,
        size: 20,
        font: customFont,
        color: rgb(0, 0, 0),  
        textDirection: 'rtl',
        alignment: 'right'
      });
      page.drawText(`${orderdata.orderId} `, {
        x: leftTextX-25,
        y: y - 60,
        size: 19,
        font: customFont,
        color: rgb(0, 0, 0),  
      });
      
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      
      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

      page.drawText(`תאריך: `, {
        x: leftTextX+150,
        y: y - 90,
        size: 20,
        font: customFont,
        color: rgb(0, 0, 0),
        textDirection: 'rtl',
        alignment: 'right'
      });
   
      page.drawText(`${formattedDate}`, {
        x: leftTextX+20,
        y: y - 90,
        size: 20,
        font: customFont,
        color: rgb(0, 0, 0),
      });
      
      page.drawText(`לכבוד: `, {
        x: leftTextX+145,
        y: y - 110,
        size: 20,
        font: customFont,
        color: rgb(0, 0, 0),
        textDirection: 'rtl',
        alignment: 'right'
      });
      page.drawText(`${orderdata.name}`, {
        x: leftTextX+20,
        y: y - 110,
        size: 18,
        font: customFont,
        color: rgb(0, 0, 0),
        textDirection: 'rtl',
        alignment: 'right'
      });
      //
      
      page.drawText(`טלפון ליצירת קשר:`, {
        x: leftTextX+75,
        y: y - 130,
        size: 20,
        font: customFont,
        color: rgb(0, 0, 0),
        textDirection: 'rtl',
        alignment: 'right'
       
      });
      page.drawText(`${orderdata.phone}`, {
        x: leftTextX-15,
        y: y - 130,
        size: 20,
        font: customFont,
        color: rgb(0, 0, 0),
       
      });
   
      
      page.drawText(`כתובת מייל: `, {
        x: leftTextX+115,
        y: y - 150,
        size: 20,
        font: customFont,
        color: rgb(0, 0, 0),
        textDirection: 'rtl',
        alignment: 'right'
      
      });
      page.drawText(`${orderdata.email}`, {
        x: leftTextX-100,
        y: y - 150,
        size: 18,
        font: customFont,
        color: rgb(0, 0, 0),
   
      
      });
      
      if(orderdata.shipmentAddress.length > 0){
      page.drawText(`כתובת למשלוח: `, {
        x: leftTextX+95,
        y: y - 170,
        size: 20,
        font: customFont,
        color: rgb(0, 0, 0),
        textDirection: 'rtl',
        alignment: 'right'
      });
      page.drawText(`${orderdata.shipmentAddress} `, {
        x: leftTextX-20,
        y: y - 170,
        size: 18,
        font: customFont,
        color: rgb(0, 0, 0),
        textDirection: 'rtl',
        alignment: 'right'
      });

    }
      
      let currentY = y - 250;
      page.drawText('מוצרים :', {
        x: leftTextX+125,
        y: currentY,
        size: 25,
        font: customFont,
        color: rgb(0, 0, 0),
        textDirection: 'rtl',
        alignment: 'right'
      });

      currentY -= 30;
      
      for (const item of items) {
        currentY = currentY - 50;
        let desc = item.description.replace(/[^\u0590-\u05FF\s]/g, '');
        page.drawText(`${desc} - `, {
          x: leftTextX,
          y: currentY,
          size: 15,
          font: customFont,
          color: rgb(0, 0, 0),
          textDirection: 'rtl',
          alignment: 'right'
        });
        page.drawText(`${item.quantity} X ${item.price}₪`, {
          x: leftTextX - 95,
          y: currentY,
          size: 15,
          font: customFont,
          color: rgb(0, 0, 0),
        });
        try {
          const itemImage = await pdfDoc.embedPng(fs.readFileSync(item.pic));
          page.drawImage(itemImage, {
            x: leftTextX - 195,
            y: currentY,
            width: 25,
            height: 25,
          });
        } catch (err) {
          console.error(err);
        }
      }
      

      currentY -= 50;
      const totalPrice = orderdata.totalPrice.toFixed(2);
      page.drawText(`סה״כ עלות מוצרים: `, {
        x: leftTextX+30,
        y: currentY-100,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
        textDirection: 'rtl',
        alignment: 'right'
      });
      page.drawText(`${totalPrice}₪ `, {
        x: leftTextX-25,
        y: currentY-100,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      
      });
      const shipmentcost = orderdata.shipmentcost.toFixed(2);
      page.drawText(`עלות שילוח בהזמנה: `, {
        x: leftTextX+30,
        y: currentY-130,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
        textDirection: 'rtl',
        alignment: 'right'
      });
      page.drawText(`${shipmentcost}₪ `, {
        x: leftTextX-25,
        y: currentY-130,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      
      });
      page.drawText(`סה״כ לתשלום: `, {
        x: leftTextX+30,
        y: currentY-160,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
        textDirection: 'rtl',
        alignment: 'right'
      });
      const payTotal = orderdata.totalPrice+orderdata.shipmentcost;
      page.drawText(`${payTotal}₪ `, {
        x: leftTextX-25,
        y: currentY-160,
        size: 15,
        font: customFont,
        color: rgb(0, 0, 0),
      
      });
      page.drawText(`תודה שביקרת אצלנו `, {
        x: 200,
        y: currentY-230,
        size: 40,
        font: customFont,
        color: rgb(0, 0, 0),
        textDirection: 'rtl',
        alignment: 'right'
      });


      const pdfBytes = await pdfDoc.save();
      const filePath = `./public/invoices/invoice_${orderdata.orderId}.pdf`;
      fs.writeFileSync(filePath, pdfBytes);
      return pdfBytes;
    } catch (error) {
      console.log(error);
    }
  }
};

       
