const XLSX = require('xlsx');

/**
 * @description Функция получения и разбора xls-файла с данными и настройками для почтовых адресов отправителей
 * @param {string} path относительный путь к xls-файлу, который нужно проанализировать
 * @returns {object[]}  массив объектов вида {login: string, pass: string, host: string, port: number, secure: boolean}
 */
function senders(path)
{
    let queue = [];
    let sendersBook;
    try
    {
        sendersBook = XLSX.readFile(path); // получение файла "книги" отправителей
    } catch (error)
    {
        error.submessage = "Ошибка чтения файла";
        console.log(error);
    }
    let sendersFirstSheetName = sendersBook.SheetNames[0]; // получение имени первого листа из книги отправителей
    let sendersSheet = sendersBook.Sheets[sendersFirstSheetName]; // получение первого листа из книги отправителей по имени
    let sendersRange = XLSX.utils.decode_range(sendersSheet['!ref']); // получение границ листа
    for (let R = sendersRange.s.r; R <= sendersRange.e.r; ++R) // перебор всех значений в пределах границ листа
    {
        let account = {}; // объект аккаунта, который добавится в массив queue
        let skipCurrentRow = false; // флаг пропуска текущей строки, если в ней обнаружены некорректные данные
        for (let C = sendersRange.s.c; C <= sendersRange.e.c; ++C)
        {
            if (skipCurrentRow) continue; // если запись на каком-то этапе не соответсвовала требованиям, то ее стоит полностью пропустить
            let sendersCellAdress = { c: C, r: R }; // формирование адреса ячейки
            let sendersCellRef = XLSX.utils.encode_cell(sendersCellAdress); // преобразование адреса ячейки в буквенно-цифровой вид
            let sendersDesiredCell = sendersSheet[sendersCellRef]; // получение содержимого ячейки
            let sendersDesiredValue = (sendersDesiredCell ? sendersDesiredCell.v : undefined); // получение данных ячейки, если они есть
            if (!sendersDesiredValue)  //проверка получения данных, чтобы не плодить undefined значения
            {
                skipCurrentRow = true; // выставить флаг пропуска строки xls-таблицы с невалидной учетной записью
                console.log(`${sendersCellRef}: ${sendersDesiredValue}`);
                continue;
            }
            if (!account['login'])
            {
                if (validateEmail(sendersDesiredValue)) // проврека логина на соответствие формату почтового ящика
                {
                    account['login'] = sendersDesiredValue;
                } else
                {
                    skipCurrentRow = true; // выставить флаг пропуска строки xls-таблицы с невалидной учетной записью
                    console.log(`${sendersCellRef}: ${sendersDesiredValue}`);
                    continue;
                }
            }
            else if (!account['pass'])
            {
                account['pass'] = sendersDesiredValue; // теоретически паролем может быть что угодно, лишь бы не пустое значение
            }
            else if (!account['host'])
            {
                if (validateHost(sendersDesiredValue))
                {
                    account['host'] = sendersDesiredValue;
                }
                else
                {
                    skipCurrentRow = true; // выставить флаг пропуска строки xls-таблицы с невалидной учетной записью
                    console.log(`${sendersCellRef}: ${sendersDesiredValue}`);
                    continue;
                }
            }
            else if (!account['port'])
            {
                let standartPorts = [465, 25, 587, 2525]; // перечень стандартных портов для smtp
                if (sendersDesiredCell.t !== 'n' || !standartPorts.includes(sendersDesiredValue)) // проверка типа (должно быть число) и соответсвие стандартным портам для smtp
                {
                    skipCurrentRow = true;
                    console.log(`${sendersCellRef}: ${sendersDesiredValue}`);
                    continue;
                }
                account['port'] = sendersDesiredValue;
            }
            else if (!account['secure'])
            {
                if (sendersDesiredValue !== 'true' && sendersDesiredValue !== 'false') // если значение не соответствует булевому
                {
                    skipCurrentRow = true; // выставить флаг пропуска строки xls-таблицы с невалидной учетной записью
                    console.log(`${sendersCellRef}: ${sendersDesiredValue}`);
                    continue;
                }
                account['secure'] = sendersDesiredValue;
            }
            else if (!account['name'])
            {
                account['name'] = sendersDesiredValue; // записываем имя отправителя
            }
            else 
            {
                console.log(`${sendersCellRef}: ${sendersDesiredValue}`);
                console.log('Избыточность данных => слишком много столбцов');
            }
        }
        if (!skipCurrentRow)
        {
            queue.push(account);
        }
        else
        {
            console.log(`Не валидная учетная запись на строке ${R} xls-файла`);
        }
    }
    return queue; // возврат массива объектов с данными для авторизации
}


/**
 * @description Функция валидации email-адреса
 * @param {string} email строка, которую надо проверить на соответствие правилам формирования email-адресов
 * @returns {boolean} результат соответствия true или false
 */
function validateEmail(email)
{
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase().trim());
}


/**
 * @description Простая валидация хоста 
 * @param {string} host строковое значение адреса почтового smtp-сервера 
 * @returns {boolean}  булевое значение успешного прохождения теста
 */
function validateHost(host)
{
    const re = /^smtp\.([^<>()\[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,}$/i;
    return re.test(String(host).toLowerCase().trim());
}

module.exports = senders;