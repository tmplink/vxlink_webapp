function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

function toconver(val, label) {
    if (val == 0)
        return '';
    var s = ['点卷', 'K点卷', 'M点卷', 'G点券', 'T点券', 'P点券'];
    var e = Math.floor(Math.log(val) / Math.log(1024));
    var value = ((val / Math.pow(1024, Math.floor(e))).toFixed(2));
    e = (e < 0) ? (-e) : e;
    if (label)
        value += ' ' + s[e];
    return value;
}

function bytetoconver(val, label) {
    if (val == 0)
        return '';
    var s = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(val) / Math.log(1024));
    var value = ((val / Math.pow(1024, Math.floor(e))).toFixed(2));
    e = (e < 0) ? (-e) : e;
    if (label)
        value += ' ' + s[e];
    return value;
}