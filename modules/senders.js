const XLSX = require('xlsx');

/**
 * @description Функция получения и разбора xls-файла с данными и настройками для почтовых адресов отправителей
 * @param {string} path относительный путь к xls-файлу, который нужно проанализировать
 * @returns {object[]}  массив объектов вида {login: string, pass: string, host: string, port: number, secure: boolean}
 */
function senders(path)
{
    let queue = [];

    try
    {
        let sendersBook = XLSX.readFile(path); // получение файла "книги" отправителей
    } catch (error)
    {
        error.submessage = "Ошибка чтения файла";
        console.log(error);
    }
    let sendersFirstSheetName = sendersBook.SheetNames[0]; // получение имени первого листа из книги отправителей
    let sendersSheet = sendersBook.Sheets[sendersFirstSheetName]; // получение первого листа из книги отправителей по имени
    let sendersRange = XLSX.utils.decode_range(sendersSheet['!ref']); // получение границ листа
    for (let R = sendersRange.s.r + 1; R <= sendersRange.e.r; ++R) // перебор всех значений в пределах границ листа
    {
        let account = {};
        let skipCurrentRow = false;
        for (let C = sendersRange.s.c; C <= sendersRange.e.c; ++C)
        {
            if (skipCurrentRow) continue; // если запись на каком-то этапе не соответсвовала требованиям, то ее стоит полностью пропустить
            let sendersCellAdress = { c: C, r: R }; // формирование адреса ячейки
            let sendersCellRef = XLSX.utils.encode_cell(sendersCellAdress); // преобразование адреса ячейки в буквенно-цифровой вид
            let sendersDesiredCell = sendersSheet[sendersCellRef]; // получение содержимого ячейки
            let sendersDesiredValue = (sendersDesiredCell ? sendersDesiredCell.v : undefined); // получение данных ячейки, если они есть
            if (!sendersDesiredValue)
            {
                skipCurrentRow = true; // выставить флаг пропуска строки xls-таблицы с невалидной учетной записью
                continue; //проверка получения данных, чтобы не плодить undefined значения
            }
            if (!account['login'])
            {
                if (validateEmail(sendersDesiredValue))
                {
                    account['login'] = sendersDesiredValue;
                } else
                {
                    continue;
                }
            }
            else if (!account['pass'])
            {
                account['pass'] = sendersDesiredValue;
            }
            else if (!account['host'])
            {
                // TODO: добавить проверку хоста
                account['host'] = sendersDesiredValue;
            }
            else if (!account['port'])
            {
                // TODO: добавить проверку порта
                account['port'] = sendersDesiredValue;
            }
            else if (!account['secure'])
            {
                // TODO: добавить проверку boolean
                account['secure'] = sendersDesiredValue;
            }
            else
            {
                console.log('Избыточность данных => слишком много столбцов');
            }
        }
        if (!skipCurrentRow)
        {
            queue.push(account);
        } else
        {
            console.log(new Error(`Не валидная учетная запись на строке ${R} xls-файла`));
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
    return re.test(String(email).toLowerCase());
}

module.exports = senders;