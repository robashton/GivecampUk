var useradminModel = {
    users: ko.observableArray()
};

useradminModel.init = function() {

    $.get('get_all_users').success(function(data) {
console.log(data);
        if(!data.error) {
            useradminModel.users(data.doc.rows);
        }
    });

};

