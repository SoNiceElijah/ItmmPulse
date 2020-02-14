function toUTC(date) 
{
    return (date.getTime() + date.getTimezoneOffset() * 60 * 1000);
}

function fromUTC(milliseconds)
{
    return new Date(milliseconds);
}

module.exports = {
    toUTC,
    fromUTC
}