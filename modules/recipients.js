const XLSX = require('xlsx');

function recipients(path)
{
    let stack = [];

    let recipientsBook = XLSX.readFile('./recipients.ods'); // получение файла "книги" получателей
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
            stack.push(recipientsDesiredValue);
        }
    }

    return stack;
}

module.exports = recipients;
