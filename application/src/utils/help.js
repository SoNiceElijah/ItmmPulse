
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
  }

module.exports = {
    getCookie,
    isEmptyOrSpaces
}