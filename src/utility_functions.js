export function getImage(url = mandatoryArgument()) {
    return new Promise((resolve, reject) => {
        var image = new Image();
        image.onload = resolve(image);
        image.onerror = reject(url);
        image.src = url;
    });
};

export function mandatoryArgument(message = 'Mandatory argument is missing') {
    throw new Error(message);
};