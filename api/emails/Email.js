import nodemailer from 'nodemailer'
import mailgunTransport from 'nodemailer-mailgun-transport'

const mailgunOptions = {
    auth: {
        domain: 'sandboxf6496ff3c3394b118461e507fa77d30f.mailgun.org',
        api_key: 'bcaa5a9bcad820fae3b7c32e4bc98046-a3d67641-8b332058',
    }
};
const transport = mailgunTransport(mailgunOptions);

class Email {
    constructor() {
        this.emailClient = nodemailer.createTransport(transport)
    }
    sendText(to, subject, text = '', html) {
        return new Promise((resolve, reject) => {
            this.emailClient.sendMail({
                from: 'coacher@gmail.com',
                to,
                subject,
                text,
                html
            }, (err, info) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(info)
                }
            })
        })
    }
}

export default new Email();