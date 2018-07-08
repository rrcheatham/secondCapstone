
function createNewUser(callback, callback2) {
    var formData = { 
        username: $('#username').val(), 
        password: $('#password').val(),  
        email: $('#email').val(), 	
        firstName: $('#firstname').val(),
        lastName: $('#lastname').val()	
    }; 
    formData = JSON.stringify(formData);
    $.ajax({
        method: 'POST',
        url: '/api/users',
        data: formData,
        success: callback,
        error: callback2,
        dataType: 'json',
        contentType: 'application/json'
    });
}

function showSuccessView() {
    $('#success').removeClass('hidden');
    $('#signup-form').addClass('hidden');
}

function unsuccessfullPost(err) {
    var message = "There was a problem with your form: " + err.location + " " + err.message;
    window.alert(message);
}

function watchForSubmit() {
    $('#signup-form').submit((event) => {
        event.preventDefault();
        createNewUser(showSuccessView, unsuccessfullPost);
    }); 
}

$(watchForSubmit);

