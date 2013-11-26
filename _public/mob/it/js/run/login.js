function init_login() {
    
     User.load(function() {
       if (User.all().length > 0) {
            user = User.first();   
            window.location.href = 'dashboard';
       }   
    });
    
    /** validate signup form on keyup and submit**/
	$("#signupFormLogin").validate({
		rules: {
		    username: {
				required: true,
				maxlength: 12
			},
			password: {
				required: true,
				maxlength: 12
			}
		},
		messages: {
			username: "Campo obbligatorio",
			password: {
				required: "Campo obbligatorio",
				maxlength: "Massimo 12 caratteri"
			}
		}
	});
}


function login_send() {

	var xhr = $.ajax({
		  type: "POST",
          headers: {"apikey" : "apikey-web"},
		  url: apiurl + "login",
		  data: login_formToJSON(),
		  crossDomain: true,
		  dataType: "json",
		  contentType: 'application/json'
		});

	xhr.done(function(data, textStatus, jqXHR) {
        if (data.success) {
	    	user = new User(data.user);
            user.save();
            window.location.href = 'dashboard';
        }
        else {
            alert('error: ' + data.error);
        }
	});

	xhr.fail(function(jqXHR, textStatus) {
        alert('error: ' + textStatus);
	});

}

function login_formToJSON() {
	var jsonObj = {};
	jsonObj = JSON.stringify({
		"username": $('#username').val(),
		"password": $('#password').val()
	});
	return jsonObj;
}