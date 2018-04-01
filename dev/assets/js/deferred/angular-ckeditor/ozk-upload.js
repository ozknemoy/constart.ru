/**
 * Created by ozknemoy on 03.12.2016.
 */
editor.on( 'fileUploadRequest', function( evt ) {
    var fileLoader = evt.data.fileLoader,
        formData = new FormData(),
        xhr = fileLoader.xhr;

    xhr.open( 'PUT', fileLoader.uploadUrl, true );
    formData.append( 'upload', fileLoader.file, fileLoader.fileName );
    fileLoader.xhr.send( formData );

    // Prevented the default behavior.
    evt.stop();
}, null, null, 4 ); // Listener with a priority 4 will be executed before priority 5.