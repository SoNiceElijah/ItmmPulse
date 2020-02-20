function toUTC(date) 
{
    return (date.getTime() + date.getTimezoneOffset() * 60 * 1000);
}

function fromUTC(milliseconds)
{
    return new Date(milliseconds);
}

function normalStringTime(mil)
{
    let d = new Date(mil);

    let h = parseInt(d.getHours());
    let m = parseInt(d.getMinutes());

    return (Math.floor(h / 10) + '' + h % 10) + ':' + (Math.floor(m / 10) + '' + m % 10);
}

module.exports = {
    toUTC,
    fromUTC,
    normalStringTime
}