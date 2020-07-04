const fs = require('fs');

/**
 * @description Функция чтения и разбора файла с сообщением
 * @param {string} path путь к файлу с сообщением относительно корневого файла
 * @returns {subject: string, body: string} возвращает объект с темой и телом письма
 */
function parseFile(path)
{
    try
    {
        let file = fs.readFileSync(path, 'utf8'); // получаем файл с сообщением из корневого каталога приложения
    } catch (error)
    {
        error.submessage = 'Ошибка чтения файла';
        console.log(error);
    }
    try
    {
        let subject = file.match(/# .*/, "")[0].replace(/# /, "").trim(); // ищем "# ", которые предшествуют заголовку и сохраняем это как тему письма
        let body = file.replace(/# .*/, "").trim(); // весь остальной контент используется как тело письма
    } catch (error)
    {
        error.submessage = 'Ошибка разбора файла';
        console.log(error);
    }
    return { subject, body }; // возвращаем объект в место вызова функции
}


module.exports = parseFile;