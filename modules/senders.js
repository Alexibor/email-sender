const XLSX = require('xlsx');

function senders(path)
{
    let queue = [];

    let sendersBook = XLSX.readFile(path); // получение файла "книги" отправителей
    let sendersFirstSheetName = sendersBook.SheetNames[0]; // получение имени первого листа из книги отправителей
    let sendersSheet = sendersBook.Sheets[sendersFirstSheetName]; // получение первого листа из книги отправителей по имени
    let sendersRange = XLSX.utils.decode_range(sendersSheet['!ref']); // получение границ листа
    for (let R = sendersRange.s.r + 1; R <= sendersRange.e.r; ++R) // перебор всех значений в пределах границ листа
    {
        let account = {};
        for (let C = sendersRange.s.c; C <= sendersRange.e.c; ++C)
        {
            let sendersCellAdress = { c: C, r: R }; // формирование адреса ячейки
            let sendersCellRef = XLSX.utils.encode_cell(sendersCellAdress); // преобразование адреса ячейки в буквенно-цифровой вид
            let sendersDesiredCell = sendersSheet[sendersCellRef]; // получение содержимого ячейки
            let sendersDesiredValue = (sendersDesiredCell ? sendersDesiredCell.v : undefined); // получение данных ячейки, если они есть
            if (!account['login'])
            {
                account['login'] = sendersDesiredValue;
            }
            else if (!account['pass'])
            {
                account['pass'] = sendersDesiredValue;
            }
            else if (!account['host'])
            {
                account['host'] = sendersDesiredValue;
            }
            else if (!account['port'])
            {
                account['port'] = sendersDesiredValue;
            }
            else if (!account['secure'])
            {
                account['secure'] = sendersDesiredValue;
            }
            else
            {
                console.log('слишком много столбцов');
            }
        }
        queue.push(account);
    }
    return queue;
}
module.exports = senders;

