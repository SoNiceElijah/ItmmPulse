function toUTC(date) 
{
    return (date).getUTCMilliseconds();
}

function fromUTC(milliseconds)
{
    return new Date(milliseconds);
}

module.exports = {
    toUTC,
    fromUTC
}