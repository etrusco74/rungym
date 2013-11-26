function init_logout() {
    User.load(function() {
       if (User.all().length != 0) {
            user = User.first();
            user.destroy();  
       }
    });
    
    Training.load(function() {
       if (Training.all().length != 0) {
            Training.each(function() {
              this.destroy();
            });
       }
    });
}