/**
 * Created by ozknemoy on 30.01.2017.
 */
export const projectCommentsComponent = {
    bindings: {
        rewards: '<',
        isOwner: '<',
        owner: '<'
    },
    controller: projectCommentsController,
    templateUrl: 'app/project/comments/project.comments.html'
};

function projectCommentsController($auth,$state,$localStorage,httpFactory,ngToast,userFactory) {
    'ngInject';


    this.$onInit = ()=> {
        this.id = $state.params.id;
        this.userId = $localStorage.user_id;
        this.baseImgUrl = httpFactory.baseImgUrl;
        this.urlComment = `project-comment/${this.id}/create`;
        this.isAuth = $auth.isAuthenticated();
        this.collapse = [];
        httpFactory.get(`project-comment/${this.id}/list`).then(d=> {//?offset=AA&limit=BB
            this.comms = d.data
        })
    };

    this.sendComplain = (n,ind)=> {
        httpFactory.get(`project-comment/${n}/complaint`).then(d=> {//?offset=AA&limit=BB
            this.comms[ind].has_complaint = true;
            ngToast.success({dismissButton: true,content:'Жалоба отправлена'});
        },e=> userFactory.reLogin(e))
    };

    this.delete = (n,ind)=> {
        httpFactory.delete(`project-comment/${n}/delete`).then(d=> {//?offset=AA&limit=BB
            this.comms.splice(ind,1);
            ngToast.success({dismissButton: true,content:'Комментарий удален'});
        },e=> userFactory.reLogin(e))
    };

    this.addComment = (comment)=> {
        this.comms.splice(0,0,comment)
    };

    this.refreshComment = (comment,ind)=> {
        this.comms[ind] = comment;
        
    }
    /*project-comment/YYY/create
     body - тело отзыва
     YYY - ид ПРОЕКТА

     /project-comment/XXX/response
     response_body - ответ
     XXX - ИД КОММЕНТАРИЯ

     /project-comment/XXX/delete
     XXX - ИД КОММЕНТАРИЯ

     /project-comment/YYY/list?offset=AA&limit=BB
     YYY - ид ПРОЕКТА
     AA - сдвиг по умолчанию 0
     ВВ - кол-во по умолчанию 100

     /project-comment/XXX/complaint - пожаловаться
     XXX - ИД КОММЕНТАРИЯ*/
}