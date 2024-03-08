const mongoose= require('mongoose');
const pdfs = require('../models/pdf_binary');
const fs = require('fs');
const path = require('path');

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

    saving_pdfs: (req, res) => {
        const directoryPath = path.join(__dirname, '../../../public/invoices');

        let fileNames = [];
      
        // Get file names from the folder
        fs.readdir(directoryPath, (err, files) => {
          if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ msg: null });
          } else {
            // Store file names in the fileNames array
            files.forEach((file) => {
              fileNames.push(file);
            });
      
            // Query to find existing files in the database matching the original fileNames array
            pdfs.find({ pdf_name_file: { $in: fileNames } })
              .exec()
              .then(existingPdfs => {
                const existingFileNames = existingPdfs.map(existingPdf => existingPdf.pdf_name_file);
      
                if (existingPdfs.length === 0) {
                  // No existing files in the database, save all new PDFs
                  files.forEach((file) => {
                    const filePath = path.join(directoryPath, file);
                    const pdfData = fs.readFileSync(filePath);
      
                    const newPdf = new pdfs({
                      _id: new mongoose.Types.ObjectId(),
                      pdf_id: GetRandomString(10),
                      pdf_name_file: file,
                      pdf: pdfData,
                    });
      
                    newPdf.save()
                      .then(result => {
                        console.log('PDF saved:');
                      })
                      .catch(error => {
                        console.error('Error saving PDF:', error);
                      });
                  });
                } else {
                  // Save new PDFs or update existing ones
                  files.forEach((file) => {
                    const filePath = path.join(directoryPath, file);
                    const pdfData = fs.readFileSync(filePath);
      
                    if (!existingFileNames.includes(file)) {
                      // Save new PDFs
                      const newPdf = new pdfs({
                        _id: new mongoose.Types.ObjectId(),
                        pdf_id: GetRandomString(10),
                        pdf_name_file: file,
                        pdf: pdfData,
                      });
      
                      newPdf.save()
                        .then(result => {
                          console.log('New PDF saved:');
                        })
                        .catch(error => {
                          console.error('Error saving new PDF:', error);
                        });
                    } else {
                      // Update existing PDFs
                      pdfs.updateOne({ pdf_name_file: file }, { pdf: pdfData })
                        .exec()
                        .then(result => {
                          console.log('PDF updated:');
                        })
                        .catch(error => {
                          console.error('Error updating PDF:', error);
                        });
                    }
                  });
                }
      
               return res.status(200).json({ msg: 'PDFs saved successfully' });
              })
              .catch(error => {
                console.error('Error querying existing PDFs:', error);
                return  res.status(500).json({ msg: null});
              });
          }
        });
      },
      save_pdf_to_folder: (req, res) => {
        const directoryPath = path.join(__dirname, '../../../public/invoices');
      
        pdfs.find()
          .exec()
          .then(pdfs => {
            // If no PDFs found, skip the saving process
            if (pdfs.length === 0) {
              return res.status(200).json({ msg: null });
            }
      
            pdfs.forEach(pdf => {
              const filePath = path.join(directoryPath, pdf.pdf_name_file);
      
              // Check if the file already exists
              if (fs.existsSync(filePath)) {
                // Update the existing file with the new data
                fs.writeFileSync(filePath, pdf.pdf);
                console.log('PDF file updated:', pdf.pdf_name_file);
              } else {
                // Create a new file with the PDF data
                fs.writeFileSync(filePath, pdf.pdf);
                console.log('New PDF file created:', pdf.pdf_name_file);
              }
            });
      
            return res.status(200).json({ msg: 'PDFs saved to folder successfully' });
          })
          .catch(error => {
            console.error('Error querying PDFs:', error);
            return  res.status(500).json({ msg: null });
          });
      },
      clear_collection: (req, res) => {
        pdfs.deleteMany({})
          .exec()
          .then(() => {
            return  res.status(200).json({ msg: 'Collection cleared successfully' });
          })
          .catch(error => {
            console.error('Error clearing collection:', error);
            return  res.status(500).json({ msg: null });
          });
      }
      
      
      
};