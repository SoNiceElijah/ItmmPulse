$('#logout').click(e => {
    setAlert('Выйти?','Выход','Назад',
    () => {
        req('/logout',{},e => {
            location.reload(true);
        },
        e => {
            console.log('WTF');
        });
    },
    () => {
        dismissAlert();
    });

    callAlert();
});

$('#overlayBack').click(e => {

    dismissAlert();

});

function setAlert(msg,ok,cancel,okAction,cancelAction) 
{
    $('#aok').unbind();
    $('#aok').click(e => {
        okAction();
    })

    $('#acancel').unbind();
    $('#acancel').click(e => {
        cancelAction();
    })

    $('#acontent').html(msg);
    $('#aok').html(ok);
    $('#acancel').html(cancel);
}

function callAlert()
{
    $('#overlay').removeClass('ov-hidden');
    $('#alert').removeClass('al-down');
}

function dismissAlert()
{
    $('#overlay').addClass('ov-hidden');
    $('#alert').addClass('al-down');
}

let activeButton = '';

$('#mp').click(e => {
    clickMenuButton('mp');
});

$('#np').click(e => {
    clickMenuButton('np');
});

$('#tp').click(e => {
    clickMenuButton('tp');
});

$('#cp').click(e => {
    clickMenuButton('cp');
});

function clickMenuButton(name) {

    if(activeButton == name)
        return;

    document.cookie = `page=${name}; expires=Tue, 19 Jan 2038 03:14:07 GMT`;
    
    $('#lastContent').html($('#content').html());

    $('#lastContent').addClass('central-panel-transition'); 
    $('#lastContent').removeClass('central-panel-invis');     

    $('#content').css('visibility','hidden');
    $('#content').addClass('central-panel-offset');
    $('#content').addClass('central-panel-invis');

    $('#content').load('application/' + name + 'Page', () => {

        $('#lastContent').addClass('central-panel-shadow');
        $('#lastContent').addClass('central-panel-invis');

        $('#content').css('visibility','visible');
        $('#content').addClass('central-panel-shadow');
        $('#content').addClass('central-panel-transition');
        $('#content').removeClass('central-panel-offset');
        $('#content').removeClass('central-panel-invis');

        setTimeout(() => {
            $('#content').removeClass('central-panel-transition');
            $('#content').removeClass('central-panel-shadow');

            $('#lastContent').removeClass('central-panel-transition');
            $('#lastContent').removeClass('central-panel-shadow');

        },350);
    });
    
    if(activeButton == '') 
    {
        activeButton = 'mp';
    }

    $('#' + activeButton).removeAttr('selected');
    activeButton = name;
    $('#' + activeButton).attr('selected','selected');
}

if(getCookie('page'))
{
    $('#' + getCookie('page')).click();
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}