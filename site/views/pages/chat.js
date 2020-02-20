$('#messagePanel').load('application/loadMsgs', () => {
    console.log('WOW');
})


let lastChat = ''
let exist = false;

$('.chat-list-item').click(function(e) {

    let element = $(this);
    console.log(element);

    if(lastChat == element.attr('id'))
        return;

    if(lastChat != '')
    {
        $('#'+lastChat).removeAttr('selected');
    }
    lastChat = element.attr('id');
    exist = true;
    $('#'+lastChat).attr('selected','selected');
    

    let cid = lastChat.slice(3);
    $('#messagePanel').load('application/loadMsgs?id='+cid, () => {
        console.log('WOW');
        $("#messagePanel2").scrollTop($("#messagePanel2")[0].scrollHeight);

    })
})

$('.member-list-item').click(function(e) {

    exist = false;
    let element = $(this);
    console.log(element);

    if(lastChat == element.attr('id'))
        return;

    if(element.attr('me'))
        return;

    if(lastChat != '')
    {
        $('#'+lastChat).removeAttr('selected');
    }
    console.log(lastChat);
    lastChat = element.attr('id');
    console.log(lastChat);
    $('#'+lastChat).attr('selected','selected');

    if(!element.attr('exist'))
    {

        $('#messagePanel').load('application/loadMsgs?id=lol', () => {
        })
        return;
    }

    exist = true;

    let cid = lastChat.slice(3);
    $('#messagePanel').load('application/loadMsgs?id='+cid, () => {
        $("#messagePanel2").scrollTop($("#messagePanel2")[0].scrollHeight);
    })
});

$('#send').click(() => {
    send();
});

$('#msg').keyup(function(e) {
    if(e.originalEvent.key == 'Enter')
        send();
})

function send() {   
    let msg = $('#msg').val();

    if(!isEmptyOrSpaces(msg))
    {
        if(exist) {

            let cid = lastChat.slice(3);
            req('api/message/send',{
                msg,
                cid
            }, (e) => {
                console.log('SENT!!!');
                $('#msg').val("");
            },
            (e) => {
                console.log('GOVNO');
                $('#msg').val("");
            });
            }
    }
}


function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

req('api/message/last',{},(e) => {
    let mid = e[0]._id;
    listenServer(mid);

},(e) => {console.log("ID: "+e)});

function listenServer(mid)
{
    req('api/message/updates',{id : mid},(e) => {
        console.log(e[0].name + ' ' + e[0].msg);
        listenServer(e[e.length-1]._id);
    },(e) => {
        listenServer(mid);
    })
}