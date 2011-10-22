var useradminModel = {
      init: function() {
        $.get('get_all_users', function(data){
            if(!data.error){
                useradminModel.users(data.doc.rows);
            }
        });
    },
    users: ko.observableArray()
};

