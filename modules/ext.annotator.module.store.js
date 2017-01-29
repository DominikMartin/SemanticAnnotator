var annotationsStore = {

    annotations:[],

    append: function (annotation) {
        if(!annotation.hasOwnProperty('id'))
            return;
        for(var existing in this.annotations){
            if(existing.id == annotation.id)
                return;
        }
        this.annotations.push(annotation);
    },

    remove: function (annotation) {
        this.annotations = $.grep(this.annotations, function(value) {
            return value.id != annotation.id;
        });
    },

    init: function (data) {
        this.annotations = data;
    }
};
