
function loginToAccount(callback) {
    var formData = {
        username: $('#username').val(),
        password: $('#password').val()
    };
    localStorage.setItem('user', $('#username').val());
    formData = JSON.stringify(formData);
    var settings = {
        contentType: "application/json",
        url: '/api/auth/login',
        data: formData,
       // dataType: 'json',
        type: 'POST',
        success: callback
    };
    $.ajax(settings);
}

function accessAccount() {
    $.ajax({
        url: '/account',
        type: 'GET',
        contentType: 'application/json',
        headers: {"Authorization": 'Bearer ' + localStorage.getItem('token')}
    });
}

function sucessfullLogin(data) {
    console.log('client side log-in');
    console.log(data);
    localStorage.setItem('token', data.authToken);
    console.log(localStorage.getItem('token'));
    top.window.location.href = "/account.html";
    //accessAccount();
}

function watchForSubmit() {
    $('#login-form').submit((event) => {
        event.preventDefault();
        loginToAccount(sucessfullLogin);
    }); 
}


$(watchForSubmit);
