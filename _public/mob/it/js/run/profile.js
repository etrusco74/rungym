function init_profile() {
    
    User.load(function() {
       if (User.all().length == 0) {
            alert('è necessario effettuare il login');
            window.location.href = '/mob/login';
       }
       else {
            user = User.first();   
       }   
    });

    /** validate signup form on keyup and submit**/
    $("#signupFormProfile").validate({
		rules: {
			first_name: "required",
			last_name: "required",
			email: {
				required: true,
			    email: true
			},
            story_weight : {
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
			email: {
				required: "Campo obbligatorio",
			    email: "Inserisci una email valida"
			},
            story_weight : {
                required: "Campo obbligatorio",
                number: "Inserisci il tuo peso attuale (solo numero)",
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

    profile_JSONToForm();

}

/** Scatenato quando si clicca sul bottone aggiorna - aggiorna il profilo **/
function profile_send() {
    if (confirm('confermi di voler aggiornare il tuo profilo?'))    {
        var xhr = $.ajax({
              type: "PUT",
              headers: {"authkey" : user.attributes.auth.authkey },
    		  url: apiurl + "user/id/" + user.attributes._id,
    		  data: profile_formToJSON(),
    		  crossDomain: true,
    		  dataType: "json",
    		  contentType: 'application/json'
    		});

    	xhr.done(function(data, textStatus, jqXHR) {
            if (data.success) {
                user.attributes = data.user;
                user.save();
                profile_JSONToForm();
                alert('profilo aggiornato con successo');
            }
            else {
                alert('error: ' + data.error);
            }
    	});

    	xhr.fail(function(jqXHR, textStatus) {
    		    alert('error: ' + textStatus);
    	});
    }
}


/** serializza tutti gli elementi del form in un oggetto JSON **/
function profile_formToJSON() {
    var jsonObj = {};

        jsonObj.first_name = $('#first_name').val();
    	jsonObj.last_name = $("#last_name").val();
    	jsonObj.username = $('#username').val();
        jsonObj.email = $('#email').val();
        if (user.attributes.story_weight[user.attributes.story_weight.length - 1].weight != $('#story_weight').val())
            jsonObj.story_weight = $('#story_weight').val();
        jsonObj.born_date = $('#born_date').val();
        jsonObj.gender = $("#gender").val();

	return JSON.stringify(jsonObj);
}

/** serializza tutti gli elementi del json nei campi del form **/
function profile_JSONToForm() {
    $('#_id').val(user.attributes._id);
    $('#first_name').val(user.attributes.first_name);
    $('#last_name').val(user.attributes.last_name);
    $('#username').val(user.attributes.username);
    $('#registration_date').val(user.attributes.registration_date);
    $('#login_date').val(user.attributes.auth.login_date);
    $('#email').val(user.attributes.email);
    $('#registration_weight').val(user.attributes.registration_weight);
    $('#story_weight').val(user.attributes.story_weight[user.attributes.story_weight.length - 1].weight);
    $('#story_date').val(user.attributes.story_weight[user.attributes.story_weight.length - 1].date);
    $('#born_date').val(user.attributes.born_date);
    $("#gender").val( user.attributes.gender ).attr('selected',true);
}