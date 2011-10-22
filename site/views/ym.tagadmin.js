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
    this().tagList().remove(function(s){
        s.Name === id;
    });
   
  },
Update: {
        tagName: ko.observable(''),
        description: ko.observable(''),
        add: function(event) {
            if($('#newTag').valid() ){
                var update = this().Update;
                this().tagList().push({tagName: update.tagName, description: update.description });
                $.post('updateTags', {
                    tagList: this().tagList()
                }).success(function(data) {
                   $.routes('set', '/tagadmin');
                })
            }
        }
    }
};
/*
tagadminModel.valid = ko.dependentObservable(function(){
        return this.Update.tagName().length > 0 && this.Update.description().length > 0;
}, questionModel);*/
