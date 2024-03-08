const nodemailer = require('nodemailer');

module.exports = {
    sendEmail: async (to, subject, body) => {
        try {
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSEMAIL
                }
            });

            let mailDetails = {
                from: process.env.EMAIL,
                to,
                subject,
                html: body
            };

            console.log(mailDetails);

            let info = await mailTransporter.sendMail(mailDetails);
            console.log('Email sent successfully:', info.response);
        } catch (err) {
            console.error('Error sending email:', err.message);
        }
    }
};
