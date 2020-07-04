const XLSX = require('xlsx');


/**
 * @description Функция читает и разбирает xls-файл получателей письма
 * @param {string} path относительный путь к xls-файлу со списком получателей письма
 * @returns {string[]} массив строк, содержащих email-адреса получателей
 */
function recipients(path)
{
    let arr = [];

    try
    {
        let recipientsBook = XLSX.readFile(path); // получение файла "книги" получателей
    } catch (error)
    {
        error.submessage = 'Ошибка чтения файла';
        console.log(error);
    }
    let recipientsFirstSheetName = recipientsBook.SheetNames[0]; // получение имени первого листа из книги получателей
    let recipientsSheet = recipientsBook.Sheets[recipientsFirstSheetName]; // получение первого листа из книги получателей по имени
    let recipientsRange = XLSX.utils.decode_range(recipientsSheet['!ref']); // получение границ листа
    for (let R = recipientsRange.s.r + 1; R <= recipientsRange.e.r; ++R) // перебор всех значений в пределах границ листа
    {
        for (let C = recipientsRange.s.c; C <= recipientsRange.e.c; ++C)
        {
            let recipientsCellAdress = { c: C, r: R }; // формирование адреса ячейки
            let recipientsCellRef = XLSX.utils.encode_cell(recipientsCellAdress); // преобразование адреса ячейки в буквенно-цифровой вид
            let recipientsDesiredCell = recipientsSheet[recipientsCellRef]; // получение содержимого ячейки
            let recipientsDesiredValue = (recipientsDesiredCell ? recipientsDesiredCell.v : undefined); // получение данных ячейки, если они есть
            if (!sendersDesiredValue) continue; //проверка получения данных, чтобы не плодить undefined значения
            if (validateEmail(recipientsDesiredValue)) // проверка почтового ящика на корректность (regexp - это не панацея, но от мелких ошибок защитит)
            {
                arr.push(recipientsDesiredValue); // помещаем корректные данные в массив
            }
        }
    }

    return arr; // возвращаем готовый массив корректных email-адресов
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

module.exports = recipients;