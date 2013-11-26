//$('#page_registration').live('pageinit', function() {
function init_registration() {

    /** validate signup form on keyup and submit**/
	$("#signupFormRegistration").validate({
		rules: {
			first_name: "required",
			last_name: "required",
			username: {
				required: true,
				maxlength: 12
			},
			password: {
				required: true,
				maxlength: 12
			},
			repassword: {
				required: true,
				maxlength: 12,
				equalTo: "#password"
			},
			email: {
				required: true,
			    email: true
			},
            registration_weight : {
                required: true,
                number: true,
                min: 30
            },
            born_date : {
                required : true,
                date: true
            },
            gender: {
                required : true,
                minlength: 1
            }
		},
		messages: {
			first_name: "Campo obbligatorio",
			last_name: "Campo obbligatorio",
			username: "Campo obbligatorio",
			password: {
				required: "Campo obbligatorio",
				maxlength: "Massimo 12 caratteri"
			},
			repassword: {
				required: "Campo obbligatorio",
				maxlength: "Massimo 12 caratteri",
				equalTo: "Le due password non coincidono"
			},
			email: {
				required: "Campo obbligatorio",
			    email: "Inserisci una email valida"
			},
            registration_weight : {
                required: "Campo obbligatorio",
                number: "Inserisci il tuo peso (solo numero)",
                min: "Pesi cosi poco?"
            },
            born_date : {
                required : "Campo obbligatorio",
                date: "Inserisci una data valida mm/dd/yyyy (Es. 12/31/1974)"
            },
            gender: {
                required : "Seleziona il sesso",
                minlength: "Seleziona il sesso"
            }
		}
	});

}

function registration_send() {

	var xhr = $.ajax({
		  type: "POST",
          headers: {"authkey": "authkey-web", "apikey" : "apikey-web"},
		  url: apiurl + "user",
		  data: registration_formToJSON(),
		  crossDomain: true,
		  dataType: "json",
		  contentType: 'application/json'
		});

	xhr.done(function(data, textStatus, jqXHR) {
        if (data.success) {
        	user = new User(data.user);
            user.save();
            alert('Registrazione effettuata correttamente');
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

function registration_formToJSON() {
	var jsonObj = {};
	jsonObj = JSON.stringify({
		"first_name": $('#first_name').val(),
		"last_name": $('#last_name').val(),
		"username": $('#username').val(),
		"password": $('#password').val(),
		"email": $('#email').val(),
        "registration_weight": $('#registration_weight').val(),
        "born_date": $('#born_date').val(),
        "gender":$('#gender').val()
	});
	return jsonObj;
}