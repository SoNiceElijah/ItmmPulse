particlesJS.load('pjs', 'pconf.json', function() {
    console.log('callback - particles.js config loaded');
});

console.log($('#pjs'))

if($('input'))
  $('input').keyup((e) => {
    $(e.target).removeAttr('style');
  });

if($('#reg'))
  $('#reg').click((e) => {
    
    let color = [];

    let name = $('#name').val();
    if(isEmptyOrSpaces(name))    
      color.push('#name');
    
    let username = $('#login').val();
    if(isEmptyOrSpaces(username))    
      color.push('#login');

    let password = $('#pw1').val();
    if(isEmptyOrSpaces(password))    
      color.push('#pw1');

    let check = $('#pw2').val();
    if(isEmptyOrSpaces(check))    
      color.push('#pw2');

    if(password !== check)
    {
      color.push('#pw1');
      color.push('#pw2');;
    }

    if(color.length != 0) 
    {      
      color.forEach(e => $(e).css('border-bottom','1px solid #af2525'))
      return;
    }

    req('register',{
      name,
      username,
      password
    }, (e) => {
      console.log('Success!');
      $('#resInfo').removeClass('red-color');
      $('#resInfo').addClass('green-color');
      $('#resInfo').html('Успешно!');
    },
    (e) => {
      console.log(e);
      $('#resInfo').removeClass('green-color');
      $('#resInfo').addClass('red-color');
      $('#resInfo').html('Что-то пошло не так, сокрее всего данный login уже занят');
    })

  });

if($('#sin'))
  $('#sin').click(e => {
    let color = [];

    let username = $('#itlogin').val();
    if(isEmptyOrSpaces(username))    
      color.push('#itlogin');
    
    let password = $('#itpassword').val();
    if(isEmptyOrSpaces(password))    
      color.push('#itpassword');

    if(color.length != 0) 
    {      
      color.forEach(e => $(e).css('border-bottom','1px solid #af2525'))
      return;
    }


    req('login',{
      username,
      password
    }, (e) => {
      console.log('Success!');
      document.cookie = `token=${e.token}; expires=Tue, 19 Jan 2038 03:14:07 GMT`;
      location.reload(true);
    },
    (e) => {
      console.log(e);
      $('#resInfo').removeClass('green-color');
      $('#resInfo').addClass('red-color');
      $('#resInfo').html('Неправильный логин/пароль');
    })
  });


function isEmptyOrSpaces(str){
  return str === null || str.match(/^ *$/) !== null;
}