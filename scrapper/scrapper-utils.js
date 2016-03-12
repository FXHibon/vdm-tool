/**
 * Utility functions for parsing scrapped data
 */


module.exports.parseDate = _parseDate;
module.exports.formatVdmItem = _formatVdmItem;
module.exports.parseAuthor = _parseAuthor;

/**
 * Extract/parse date from given 'dateAndAuthor' field
 * @param dateAndAuthor
 * @returns {Date}
 */
function _parseDate(dateAndAuthor) {
    var pattern = /(\d{2})\/(\d{2})\/(\d{4}) à (\d{2}:\d{2})/;
    var tmpStr = dateAndAuthor.substr(3, 18);
    tmpStr = tmpStr.replace(pattern, '$3-$2-$1T$4');
    return new Date(tmpStr);
}

/**
 * Extract author from given 'dateAndAuthor' field
 * @param dateAndAuthor
 * @returns {string}
 */
function _parseAuthor(dateAndAuthor) {
    var sepIndex = dateAndAuthor.indexOf('par ') + 'par '.length;
    var tmpStr = dateAndAuthor.substr(sepIndex);
    var finalSep = tmpStr.lastIndexOf('(');
    if (finalSep != -1) {
        tmpStr = tmpStr.substr(0, finalSep - 1);
    }
    return tmpStr;
}

/**
 *  Format vdm item: split 'dateAndAuthor' field into two separated fields
 * @param vdmItem
 * @returns {{_id: (string), content: (string), author: (string), date: (Date)}}
 * @private
 */
function _formatVdmItem(vdmItem) {
    var formatedItem = {
        _id: parseInt(vdmItem._id),
        content: vdmItem.content,
        author: _parseAuthor(vdmItem.dateAndAuthor),
        date: _parseDate(vdmItem.dateAndAuthor)
    };
    return formatedItem;
}