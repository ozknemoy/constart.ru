/**
 * Created by ozknemoy on 14.12.2016.
 */
export const projectGalleryComponent = {
    bindings: {
        value: '<'// массив [videoStrng,[fotos]]
    },
    templateUrl: 'app/_common/directives/project-gallery/project-gallery.html',
    controller: function (httpFactory,Lightbox) {
        'ngInject';

        this.$onChanges = (changes) => {
            if(changes.value && changes.value.currentValue ) {
                let [video,gallery] = changes.value.currentValue;

                if(gallery) {
                   gallery.forEach((foto)=>{
                       // почему то дважды плюсует httpFactory.baseImgUrl + foto.url
                       if(!/http/i.test(foto.url)) foto.url = httpFactory.baseImgUrl + foto.url;
                       if(!/http/i.test(foto.thumbUrl)) foto.thumbUrl = httpFactory.baseImgUrl + foto.thumbUrl;
                    })
                }

                if (video && gallery) {
                    this.videoANDfotos = [video].concat(gallery);
                } else if (video && !gallery) {
                    this.videoANDfotos = [video];
                } else if (!video && gallery) {
                    this.videoANDfotos = gallery;
                }
                this.galleryHolderNum = 0;
                this.galleryHolder = this.videoANDfotos ? this.videoANDfotos[0] : 0;
                gallery = null;
            }
        };
        
        
        

        this.changeLightbox = function (i, obj) {
            this.galleryHolderNum = i;
            this.galleryHolder = obj;
        };

        this.openLightboxModal = function () {
            Lightbox.openModal(this.videoANDfotos, this.galleryHolderNum ,{
                size:'lg',backdrop : false,appendTo: angular.element('body')//#wrapper
            });
        };
    }

};