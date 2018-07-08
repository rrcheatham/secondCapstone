
//call to users API for login 

function loginToAccount(callback, callback2) {
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
        success: callback,
        error: callback2
    };
    $.ajax(settings);
}

//delete 

function accessAccount() {
    $.ajax({
        url: '/account',
        type: 'GET',
        contentType: 'application/json',
        headers: {"Authorization": 'Bearer ' + localStorage.getItem('token')}
    });
}

//callback for successfull login accessing account page

function sucessfullLogin(data) {
    localStorage.setItem('token', data.authToken);
    top.window.location.href = "/account.html";
}

//callback for unsucessfull login alerting user of error

function unsucessfullLogin(data) {
    var message = " Please check your username and password and try again";
    window.alert(message);
}

//listener for login form submission

function watchForSubmit() {
    $('#login-form').submit((event) => {
        event.preventDefault();
        loginToAccount(sucessfullLogin, unsucessfullLogin);
    }); 
}


$(watchForSubmit);
