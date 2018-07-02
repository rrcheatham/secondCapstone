//const USER_URL = 'mongodb://localhost/expense-tracker-db/users';

function checkUsername(username, callback) {
    const settings = {
        url: '/users',
        data: {
            query: `${username}`
        },
        dataType: 'json',
        type: 'GET',
        success: callback,
    };
    $.ajax(settings);
}

function createNewUser(callback) {
    var formData = { 
        username: $('#username').val(), 
        password: $('#password').val(),  
        email: $('#email').val(), 	
        firstname: $('#firstname').val(),
        lastname: $('#lastname').val(), 
        age: $('#age').val(), 	
        country: $('#country').val()		
    }; 
    console.log(formData);
    $.ajax({
        method: 'POST',
        url: '/users',
        data: formData,
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

