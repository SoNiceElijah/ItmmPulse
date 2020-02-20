function req(path,data,callback,error) {
    console.log(data);
    console.log(JSON.stringify(data));
    $.ajax({
        type : 'POST',
        url : path,
        contentType : 'application/json',
        data : JSON.stringify(data),       
        success : callback,
        error : error
    })
}