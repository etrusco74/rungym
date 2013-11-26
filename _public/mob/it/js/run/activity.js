function init_activity() {

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
       training = new Training({
                                    "events": [],
                                    "loc": {
                                        "type" : "LineString",
                                        "coordinates" : []
                                    }
                                });
        Training.add(training);                     
    });
    $.getJSON(apiurl + "activities", activity_getActivities);
    
    /** Scatenato quando si clicca sul bottone training - verifica ed imposta l'attività sportiva selezionata **/
    $('#btnGo').click(function() {

        if ($("#activity").val() == 0) 
                    alert("selezionare l'attività sportiva");
        else    {
                    training.attributes.activity_id = $("#activity :selected").val();
                    training.save();
                    window.location.href = '/mob/training';
        }
    });
//});
}

/** popola la select dei tipi attività **/
function activity_getActivities(data)    {
	var pos = data.length;
	for (var i=0; i<pos; i++)	{	
		$('#activity')
         	.append($("<option></option>")
         	.attr("value",data[i]._id)
         	.text(data[i].description));
	}
}