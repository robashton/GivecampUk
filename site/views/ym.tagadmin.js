var tagadminModel = {
    init: function() {
        $.get('updateTags', function(data){
            if(!data.error){
                tagadminModel.tagList(data.tags);
            }
        });
    },
  tagList: ko.observableArray([]),

  remove: function(event) {
        var id = $(event.currentTarget).parent().siblings().first().text(); 
        $.post('removeTag', {  idtoremove: id}, tagadminModel.refresh); 
        
  },
Update: {
        tagName: ko.observable(''),
        description: ko.observable(''),
        add: function(event) {
            if($('#newTag').valid() ){
                var update = this().Update;
                this().tagList().push({tagName: update.tagName, description: update.description });
                $.post('updateTags', {  tagList: this().tagList()}, tagadminModel.refresh); 
            }
        }
    },
refresh: function() {
        $.get('updateTags', function(data) {
            if (!data.error) {
             tagadminModel.tagList(data.tags);
            }
        });
    }
};
