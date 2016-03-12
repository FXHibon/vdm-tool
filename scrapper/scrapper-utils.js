/**
 * Utility functions for parsing scrapped data
 */

/**
 * Extract/parse date from given 'dateAndAuthor' field
 * @param dateAndAuthor
 * @returns {Date}
 */
module.exports.parseDate = function (dateAndAuthor) {
    var pattern = /(\d{2})\/(\d{2})\/(\d{4}) à (\d{2}:\d{2})/;
    var tmpStr = dateAndAuthor.substr(3, 18);
    tmpStr = tmpStr.replace(pattern, '$3-$2-$1T$4');
    return new Date(tmpStr);
};

/**
 * Extract author from given 'dateAndAuthor' field
 * @param dateAndAuthor
 * @returns {string|*}
 */
module.exports.parseAuthor = function (dateAndAuthor) {
    var sepIndex = dateAndAuthor.indexOf('par ') + 'par '.length;
    var tmpStr = dateAndAuthor.substr(sepIndex);
    var finalSep = tmpStr.lastIndexOf('(');
    if (finalSep != -1) {
        tmpStr = tmpStr.substr(0, finalSep - 1);
    }
    return tmpStr;
};