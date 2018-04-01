/**
 * Created by дима on 01.09.2016.
 */
export class AstronautsController {
    constructor (httpFactory,$timeout,Upload) {
        'ngInject';

        this.Upload = Upload;
        this.httpFactory = httpFactory;
        this.baseUrl = 'http://localhost:8888/';///yii2-app-advanced/backend/web
        httpFactory.getLocal(this.baseUrl + 'films').then(d=> {
            this.f = d.data;

        });
        httpFactory.getLocal(this.baseUrl + 'stars').then(d=> {
            this.stars = d.data;
            console.log("this.stars",this.stars);

        });
        httpFactory.getLocal(this.baseUrl + 'astronauts?limit=100&offset=0').then(d=> {
            this.a = d.data;
            console.log("a",this.a[0] );//.films[0]

        });

        $timeout(()=>{
            //angular.element('#astros').modal()
        },100)


    }

    saveAstro(index,id) {
        if (id) {
            this.update(index,id)
        } else {
            this.httpFactory.postLocal(this.baseUrl + 'astronauts',this.a[index]).then(d=> {
                console.log(d.data);
                this.a[index].id = d.data.id;
            },e=>{console.log(e.data)});
        }
    }

    update(index,id) {
        this.httpFactory.putLocal(this.baseUrl + 'astronauts/'+id,this.a[index]).then(d=> {
        },e=>{console.log(e.data)});
    }

    deleteAstro(index,id) {
        this.a.splice(id,1);
        this.httpFactory.deleteLocal(this.baseUrl + 'astronauts/'+id).then(d=> {
            location.reload()
        },e=>{console.log(e.data)});
    }

    upload (file) {
        console.log(file);

        if(!file) return;

        this.Upload.upload({
            url: this.baseUrl+'tests',//?XDEBUG_SESSION_START=13038
            data: {file: file, 'username': 'file'}})
            .then( (resp) => {
                this.u[id] = resp.data.filename;
            }, (err) => {
                console.log('причина: ', err.data);
            }, (evt) => {
                //console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% ' + evt.config.data.file.name);
            });
    };

}