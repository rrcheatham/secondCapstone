
function createNewUser(callback) {
    var formData = { 
        username: $('#username').val(), 
        password: $('#password').val(),  
        email: $('#email').val(), 	
        firstname: $('#firstname').val(),
        lastname: $('#lastname').val()	
    }; 
    $.ajax({
        method: 'POST',
        url: '/api/users',
        data: JSON.stringify(formData),
        success: callback,
        //dataType: 'json',
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
        console.log("submitted");
        createNewUser(showSuccessView());
    }); 
}

$(watchForSubmit);

