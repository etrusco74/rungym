function init_send() {

    User.load(function() {
       if (User.all().length == 0) {
            alert('è necessario effettuare il login');
            window.location.href = '/mob/login';
       }
       else {
            user = User.first();   
       }   
    });
    
    Training.load(function() {
       if (Training.all().length == 0) {
            alert('è necessario selezonare una attività sportiva');
            window.location.href = '/mob/activity';
       }
       else {
            training = Training.last();   
       }   
    });
    
    /** Scatenato quando si clicca sul bottone send - invia i dati del tracking **/
    $('#btnSend').click(function() {

        /* 
        $.ajax({
    		type: 'POST',
    		contentType: 'application/json',
    	    url: 'https://api.mongolab.com/api/1/databases/rungym/collections/trainings?apiKey=5106ddc5e4b01e6f7259b8b4',
    		dataType: "json",
    		data: JSON.stringify(training.attributes),
    		success: function(data, textStatus, jqXHR){
    			training.destroy();  
                alert('Allenamento trasferito');
                window.location.href = '/mob/dashboard';
    		},
    		error: function(jqXHR, textStatus, errorThrown){
    			alert('error: ' + textStatus);
    		}
    	});
        */
        
        //$('#res').text(JSON.stringify(training.attributes));
        
        var xhr = $.ajax({
        	  type: "POST",
              
              headers: {"authkey" : user.attributes.auth.authkey },
    		  url: apiurl + "training",
    		  data: JSON.stringify(training.attributes),
    		  crossDomain: true,
    		  dataType: "json",
    		  contentType: 'application/json'
    		});
    
    	xhr.done(function(data, textStatus, jqXHR) {
            if (data.success) {
                training.destroy();  
                alert('Allenamento trasferito');
                window.location.href = '/mob/dashboard';
            }
            else {
                alert('error: ' + data.error);
            }
    	});
    
    	xhr.fail(function(jqXHR, textStatus) {
    		    alert('error: ' + textStatus);
    	});
        
        
    });
    
}