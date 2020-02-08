module.exports = (template, data) => {

    let res = {}
    for(let field in data)
    {
        if(!(template[field] || template[field] === 0))
        {
            continue;
        }

        if((typeof data[field] == template[field] || (template[field] == 'array' && Array.isArray(data[field]))) )
            res[field] = data[field];
        else
            return false;
    }


    return res;
};