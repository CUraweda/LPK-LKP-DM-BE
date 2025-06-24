import fs from 'fs';
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import email from '../config/email.js';

const transporter = nodemailer.createTransport({
    //? GMAIL CONFIG
    //   service: "gmail",
    //   auth: {
    //     user: email.account,
    //     pass: email.password
    //   }

    //SMTP CONFIG
    host: email.host,
    port: email.port,
    secure: true,
    auth: {
        user: email.account,
        pass: email.password,
    },

});

var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
        if (err) {
            callback(err);
        } else {
            callback(null, html);
        }
    });
};
const formatAttachment = (attachments) => {
return attachments.map((data, i) => ({
    filename: "Logo " + i + `.${data.split(".")[1]}`,
    path: data,
    cid: "logo" + i
    }))
}

class EmailHelper {
    async sendEmail(
        placeholder,
        to, subject, body,
        attachment = [],
    ) {
        try {
            readHTMLFile(body, function (err, html) {
                if (err) {
                    console.log("error reading file", err);
                    return;
                }
                const template = handlebars.compile(html);
                const htmlToSend = template(placeholder);
                const mailOptions = {
                    from: email.account,
                    to, subject,
                    html: htmlToSend,
                    attachments: formatAttachment(attachment)
                };
                transporter.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log(error);
                    }
                });
            });
        } catch (err) {
            console.log(err);
            logger.error(err);
            return false;
        }
    }

}

export default EmailHelper;