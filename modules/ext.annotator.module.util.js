function randomName(length) {
    var text = '';
    var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var possibleBig = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    text += possibleBig.charAt(Math.floor(Math.random() * possibleBig.length));
    for( var i=0; i < length - 1; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function openPopup(url, afterContentFunction) {
    $.featherlight(
        {
            iframe: url,
            iframeMaxWidth: '100%',
            iframeWidth: 800,
            iframeHeight: 600,
            // SET CONFIG HERE
            afterContent: afterContentFunction
        });
}

var util = {

    parseAskApiCall: function (json){
        result = [];
        console.log(json);
        Object.keys(json.query.results).forEach(function(prop) {
            console.log(json.query.results[prop]);
            result.push(util.fromEscapedToJson(json.query.results[prop].printouts.AnnotationMetadata[0]));
        });
        console.info(result);
        return result;
    },

    fromJsonToEscaped: function (json) {
        var string = util.fromJsonToStringIgnoreCycles(json);
        string = util.replaceAll(string, '[', 'Ӷ');
        string = util.replaceAll(string, ']', 'Ӻ');
        string = util.replaceAll(string, '{', '^');
        string = util.replaceAll(string, '}', '°');
        return string;
    },

    fromEscapedToJson: function (string) {
        string = util.replaceAll(string, 'Ӷ', '[');
        string = util.replaceAll(string, 'Ӻ', ']');
        string = util.replaceAll(string, '^', '{');
        string = util.replaceAll(string, '°', '}');
        return JSON.parse(string);
    },

    replaceAll: function(str, find, replace) {
        return str.replace(new RegExp(util.escapeRegExp(find), 'g'), replace);
    },

    escapeRegExp: function(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    },

    fromJsonToStringIgnoreCycles: function(json) {
        seen = [];
        return JSON.stringify(json, function(key, val) {
            if (val != null && typeof val == "object") {
                if (seen.indexOf(val) >= 0) {
                    return;
                }
                seen.push(val);
            }
            return val;
        });
    }
};
