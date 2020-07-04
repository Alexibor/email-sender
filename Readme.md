# email-sender
Задача заключается в том, чтобы автоматизировать рассылку с разных почтовых ящиков одного и того же сообщения разным получателям.

В проекте используются следующие "соглашения":
* адреса и пароли, а также адреса серверов, номера портов и необходимость защищенного соединения для отправки сообщений берутся из подготовленного табличного файла (excel), который подлежит изменению и актуализации силами заказчика;
* адреса получателей находятся в отдельном табличном файле (excel), который подлежит изменению и актуализации силами заказчика;
* заголовок и тело сообщения берутся из простого текстового файла, который в свою очередь подлежит изменению и актуализации силами заказчика.


## Использование
Установить nodejs:
[https://nodejs.org/en/](https://nodejs.org/en/)

Скачать проект с репозитория [по ссылке](https://github.com/IIICoder/email-sender/archive/master.zip) (либо клонировать с помощью git)
```
git clone https://github.com/IIICoder/email-sender.git
```

Перейти в папку проекта:
```
cd ./email-sender
```

Установить зависимости:
```
npm install
```

Отредактировать файлы:
* *recipients.xls* - указать адреса получателей
* *senders.xls* - указать настройки почтовых ящиков отправителей
* *mail.txt* - указать тему и тело сообщения
* *index.js* - отредактировать поле ***from***, поменяв имя отправителя

Запустить код:
```
npm run start
```

### Форматы предоставления данных
#### Получатели

#### Отправители

#### Сообщение