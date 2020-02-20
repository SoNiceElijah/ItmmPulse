function req(path,data,callback,error) {
    return $.ajax({
        type : 'POST',
        url : path,
        contentType : 'application/json',
        data : JSON.stringify(data),       
        success : callback,
        error : error
    })
}