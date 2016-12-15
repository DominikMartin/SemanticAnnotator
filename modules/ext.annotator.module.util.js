function randomName(length) {
    var text = '';
    var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var possibleBig = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    text += possibleBig.charAt(Math.floor(Math.random() * possibleBig.length));
    for( var i=0; i < length - 1; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function toJSON(object) {
    seen = [];
    return JSON.stringify(object, function(key, val) {
        if (val != null && typeof val == "object") {
            if (seen.indexOf(val) >= 0) {
                return;
            }
            seen.push(val);
        }
        return val;
    });
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
