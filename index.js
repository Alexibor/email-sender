const Senders = require('./modules/senders');
const Recipients = require('./modules/recipients');
const MessageParser = require('./modules/messageParser');
const nodemailer = require("nodemailer");


let sendersQueue = Senders('./senders.xls'); // получение массива объектов отправителей, хранящих в себе данные для авторизации (обрабатывается как очередь)
let recipientsStack = Recipients('./recipients.xls'); // получение массива строк, содержащих адреса почтовых ящиков получателей
let messageParser = MessageParser('./mail.txt'); // получение заголовка и тела сообщения из файла

recipientsStack.forEach(recipientEmail => // прогоняем callback по каждому элементу списка получателей
{
    let senderAccount = sendersQueue.shift(); // получение аккаунта из очереди для новой отправки

    /**
     * @description Функция формирования транспортировщика для отправки сообщения и его последующей отправки здесь же
     */
    async function main() // async..await is not allowed in global scope, must use a wrapper
    {
        // создание переиспользуемого объекта транспортировщика, использующего по умолчанию SMTP транспорт
        let transporter = nodemailer.createTransport({
            host: senderAccount.host, // smpt-сервер: smtp.mail.ru
            port: senderAccount.port, // порт: 465 для защищенного соединения
            secure: senderAccount.secure, // true для 465, false для других портов
            auth: {
                user: senderAccount.login, // логин для авторизации на smtp-сервере
                pass: senderAccount.pass, // пароль для авторизации на smtp-сервере
            },
        });

        // отправка сообщения с использованием настроенного транспортировщика
        let info = await transporter.sendMail({
            from: `${senderAccount.name} <${senderAccount.login}>`, // имя и адрес отправителя  
            to: `${recipientEmail}`, // список получателей (можно указать через запятую несколько почтовых адресов)
            subject: messageParser.subject, // тема письма
            text: messageParser.body, // простое текстовое тело письма
        });

        console.log(`Message sent: ${info.messageId} \r\n sender: ${senderAccount.login}, recipient: ${recipientEmail}`); // "уникальный" идентификатор сообщения, возвращаемый сервером
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }

    main().catch(error =>
    {
        error.sender = senderAccount.login; // расширяем объект ошибки
        error.recipient = recipientEmail; // расширяем объект ошибки
        console.log(error); // вывод ошибок в консоль
        // TODO: добавить генерацию нового файла для рассылки из адресов, на которые рассылка не удалась
    });
    sendersQueue.push(senderAccount); // возвращаем аккаунт снова в очередь
});
