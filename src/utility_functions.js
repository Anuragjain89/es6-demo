function mandatoryArg (message) {
    message = message || 'Mandatory argument is missing';
    throw new Error(message);
}

function getImage (url) {
    var url                 = url || mandatoryArg();
    var imageDefer = $.Deferred();

    var image               = new Image();
    image.onload            = imageDefer.resolve(image);
    image.onerror           = imageDefer.reject(url);
    image.src               = url;

    return imageDefer.promise();
};

module.exports.mandatoryArg = mandatoryArg;
module.exports.getImage = getImage;
