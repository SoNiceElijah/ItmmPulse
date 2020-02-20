$('#messagePanel').load('application/loadMsgs', () => {
})

STATE.chat.lastChat = '';
STATE.chat.exist = false;
STATE.chat.updateReq = null;

console.log(usrs);

onEvent('newPage',() => {
    if(STATE.chat.updateReq)
        STATE.chat.updateReq.abort();

    onEvent('newPage', () => {})
});

$('.chat-list-item').click(function(e) {

    let element = $(this);
    console.log(element);

    if(STATE.chat.lastChat == element.attr('id'))
        return;

    if(STATE.chat.lastChat != '')
    {
        $('#'+STATE.chat.lastChat).removeAttr('selected');
    }
    STATE.chat.lastChat = element.attr('id');
    STATE.chat.exist = true;
    $('#'+STATE.chat.lastChat).attr('selected','selected');
    

    let cid = STATE.chat.lastChat.slice(3);
    $('#messagePanel').load('application/loadMsgs?id='+cid, () => {
        $("#messagePanel2").scrollTop($("#messagePanel2")[0].scrollHeight);

    })
})

$('.member-list-item').click(function(e) {

    STATE.chat.exist = false;
    let element = $(this);
    console.log(element);

    if(STATE.chat.lastChat == element.attr('id'))
        return;

    if(element.attr('me'))
        return;

    if(STATE.chat.lastChat != '')
    {
        $('#'+STATE.chat.lastChat).removeAttr('selected');
    }
    console.log(STATE.chat.lastChat);
    STATE.chat.lastChat = element.attr('id');
    console.log(STATE.chat.lastChat);
    $('#'+STATE.chat.lastChat).attr('selected','selected');

    if(!element.attr('exist'))
    {

        $('#messagePanel').load('application/loadMsgs?id=lol', () => {
        })
        return;
    }

    STATE.chat.exist = true;

    let cid = STATE.chat.lastChat.slice(3);
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
        if(STATE.chat.exist) {

            let cid = STATE.chat.lastChat.slice(3);
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
    console.log('START LONG POLL');
    STATE.chat.updateReq = req('application/loadMsgsUpdates',{id : mid},(e) => {
        e = $(e);
        console.log(e);
        listenServer(e[e.length-1].id.slice(3));

        $('#messagePanel2').append(e);
        $("#messagePanel2").scrollTop($("#messagePanel2")[0].scrollHeight);

    },(e) => {
        
        if(e.statusText !== 'abort')
            listenServer(mid);
        else
            console.log('LONG POLL CLOSED!');
    })
}
