
function createNewUser(callback) {
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
        dataType: 'json',
        contentType: 'application/json'
    });
}

function showSuccessView() {
    $('#success').removeClass('hidden');
    $('#signup-form').addClass('hidden');
}


function watchForSubmit() {
    $('#signup-form').submit((event) => {
        event.preventDefault();
        createNewUser(showSuccessView());
    }); 
}

$(watchForSubmit);

