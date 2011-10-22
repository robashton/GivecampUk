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
   
  },
Update: {
        tagName: ko.observable(''),
        description: ko.observable(''),
        add: function(event) {
          
          alert(this.Update.tagName);
        }
    }
};
/*
tagadminModel.valid = ko.dependentObservable(function(){
        return this.Update.tagName().length > 0 && this.Update.description().length > 0;
}, questionModel);*/
