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

    init: function (data) {
        this.annotations = data;
		$(document).ready(function() {
			util.checkAnnotationPosition(data);
		});
    }
};
