var util = {
    randomName: function (length) {
        var text = '';
        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var possibleBig = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        text += possibleBig.charAt(Math.floor(Math.random() * possibleBig.length));
        for( var i=0; i < length - 1; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },

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
    },

    sliceBeforeRegex: function(text, regex){
        if(text.match(regex).length > 0){
            regex.exec(text);
            return text.substring(regex.lastIndex-text.match(regex)[0].length);
        }
        return text;
    },

    sliceAfterRegex: function(text, regex){
        if(text.match(regex).length > 0){
            regex.exec(text);
            return text.substring(0, regex.lastIndex);
        }
        return text;
    },

    extractTextBetweenRegexes: function (text, regex_start, regex_end) {
        text = util.sliceBeforeRegex(text, regex_start);
        return util.sliceAfterRegex(text, regex_end);
    }
};
