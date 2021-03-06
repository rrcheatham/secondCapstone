
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
        dataType: 'json',
        contentType: 'application/json',
        success: callback,
        error: callback2
    });
}

function showSuccessView() {
    $('#success').removeClass('hidden');
    $('#signup-form').addClass('hidden');
}

function unsuccessfullPost(request, status, error) {
    var message = "There was a problem with your form: " + request.responseText;
    window.alert(message);
}

function watchForSubmit() {
    $('#signup-form').submit((event) => {
        event.preventDefault();
        createNewUser(showSuccessView, unsuccessfullPost);
    }); 
}

$(watchForSubmit);

