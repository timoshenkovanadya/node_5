
function checkId(id) {
    return id && (typeof id === 'string' || typeof id === 'number');
}

function checkString (str) {
    return typeof str === 'string';
}

function checkRating (rating) {
    return typeof rating === 'string' && !isNaN(rating);
}

function checkYear (year) {
    const currentYear = new Date().getFullYear();
    return Number.isInteger(year) && year >= 1895 && year <= currentYear

}

function checkNumber(num) {
    return Number.isInteger(num) && num >= 0;
}



module.exports = {
    checkId, checkString, checkRating, checkNumber, checkYear
}
