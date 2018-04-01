/**
 * Created by ozknemoy on 18.11.2016.
 * преобразование картинки в base64
 */
export function canvasFactory () {
    let canvasF = {};

    canvasF.createImgFromCanvas = function (imgString,w,h) {
        return new Promise((res)=> {
            let img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');// чтобы не портить канву
            img.src = imgString;
            img.onload = function () {
                res(canvasF.downsizeImage(img,w,h))
            }
        })

    };

    canvasF.downsizeImage = function (img,w=40,h) {
        try {
            var imgCanvas = document.createElement("canvas"),
                imgContext = imgCanvas.getContext("2d");
            imgCanvas.width = w;
            imgCanvas.height = h? h:w;
            // Draw image into canvas element
            imgContext.drawImage(img,0,0, imgCanvas.width, imgCanvas.height);
            // Save image as a data URL
            return imgCanvas.toDataURL("image/png");
        }
        catch (e) {
            return null
        }
    };
    // Converts canvas to an image
    canvasF.convertCanvasToImage = function(canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        return image;
    };

    return canvasF
}