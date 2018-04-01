/**
 * Created by ozknemoy on 30.01.2017.
 */
export const commentWriterComponent = {
    bindings: {
        url: '@',
        key: '@',
        callback: '&'
    },
    controller: commentWriterController,
    templateUrl: 'app/_common/directives/comment-writer/comment-writer.html'
};

function commentWriterController(httpFactory,ngToast,userFactory) {
    'ngInject';

    this.submit = ()=> {
        this.pend = 1;
        httpFactory.post(this.url,{
            [this.key]: this.message
        }).then(d=> {
            ngToast.success({dismissButton: true,content:'Комментарий отправлен'});
            this.pend = 0;
            this.message = '';
            this.commentForm.$setUntouched();
            this.callback({comment:d.data});
        },e=> userFactory.reLogin(e))
    }
}