var tagadminModel = {
    init: function() {
        $.get('updateTags', function(data){
            if(!data.error){
                tagadminModel.tagList(data.tags);
            }
        });
    },
  tagList: ko.observableArray(),
  
  remove: function(event) {
    var id = $(event.currentTarget).parent().siblings().first().text();      
    alert(id);
   
  }
};

/*
loginModel.loginForm.valid = ko.dependentObservable(function(){
        return this.loginForm.email().length > 0 && this.loginForm.password().length > 0;
}, loginModel);*/
