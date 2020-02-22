
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

function validate(document, ids)
{
  let data = {};
  data.errors = [];
  for(let i = 0; i < ids.length; ++i)
  {
    let input = document.getElementById(ids[i]);
    let val = input.value;

    if(isEmptyOrSpaces(val))
      data.errors.push(ids[i]);
    else
      data[ids[i]] = val;
  }

  return data;
}

function val(document,id) 
{
  return document.getElementById(id).value;
}

module.exports = {
    getCookie,
    isEmptyOrSpaces,
    validate,
    val
}