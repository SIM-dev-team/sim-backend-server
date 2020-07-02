const nodemailer = require('nodemailer');
const config = require('../config/data');

const transport = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
        user: config.env_data.MAIL_CONFIG.MAILGUN_USER,
        pass: config.env_data.MAIL_CONFIG.MAILGUN_PASS
    },
    tlc: {
        rejectUnauthorized: false
    }
})

module.exports = {
    sendEmail(from, to, subject, html) {
        return new Promise((resolve, reject) => {
            transport.sendMail({ from, subject, to, html }, (err, info) => {
                if (err) reject(err);
                resolve(info);
            });
        });
    }
}