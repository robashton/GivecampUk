var tagadminModel = {
    init: function() {
        $.get('updateTags', function(data){
            if(!data.error){
                tagadminModel.tagList(data.tags);
            }
        });
    },
  tagList: ko.observableArray()
};

/*
loginModel.loginForm.valid = ko.dependentObservable(function(){
        return this.loginForm.email().length > 0 && this.loginForm.password().length > 0;
}, loginModel);*/
