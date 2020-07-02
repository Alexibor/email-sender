const XLSX = require('xlsx');
const Senders = require('./modules/senders');
const Recipients = require('./modules/recipients');
const MessageParser = require('./modules/messageParser');
const nodemailer = require("nodemailer");

let sendersQueue = Senders('./senders.ods');
let recipientsStack = Recipients('./recipients.ods');
let messageParser = MessageParser('./mail.txt');

recipientsStack.forEach(recipientEmail =>
{

    let senderAccount = sendersQueue.shift(); // получение аккаунта из очереди для новой отправки

    // async..await is not allowed in global scope, must use a wrapper
    async function main()
    {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: senderAccount.host, // smtp 
            port: senderAccount.port, // 465
            secure: senderAccount.secure, // true for 465, false for other ports
            auth: {
                user: senderAccount.login, // generated ethereal user
                pass: senderAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"GoodProgger 👻" <${senderAccount.login}>`, // sender address //TODO: обратить внимание на настройку отправителя
            to: `${recipientEmail}`, // list of receivers
            subject: messageParser.subject, // Subject line
            text: messageParser.body, // plain text body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }

    main().catch(console.error);
    sendersQueue.push(senderAccount); // возвращаем аккаунт снова в очередь
});