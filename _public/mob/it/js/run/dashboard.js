function init_dashboard() {    
    User.load(function() {
       if (User.all().length == 0) {
            alert('è necessario effettuare il login');
            window.location.href = '/mob/login';
       }
       else {
            user = User.first();   
            $('#name').text(user.attributes.first_name);
       }   
    });
    
    Training.load(function() {
       if (Training.all().length > 0) {
            if (confirm('Attenzione! ci sono ancora ' + Training.all().length +' allenamenti da trasferire sul server centrale. Vuoi farlo ora?')) {
                window.location.href = '/mob/send';       
            }
       }
       else {
            $("#trasf").remove();
       }
       
    });
}