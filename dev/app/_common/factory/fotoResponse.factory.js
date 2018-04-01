/**
 * Created by дима on 04.08.2016.
 */
export function fotoResponseFactory() {
    'ngInject';
    //this.data = {filename: null};
    this.data = {somekey: null};
    this.dataArray = {};

    this.setRes = function (id, res) {
        this.data[id] = res;
    };

    this.setResArray = function (id,res) {
        if (!this.dataArray[id]) {
            this.dataArray[id]=[];
        }
        this.dataArray[id].push(res);
    };
    //
}