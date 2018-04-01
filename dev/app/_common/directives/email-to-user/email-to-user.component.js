/**
 * Created by ozknemoy on 07.11.2016.
 */

export var emailToUserComponent = {
    bindings: {
        subject: '@',
        //textHeader: '@?',
        value: '<'
    },
    templateUrl: 'app/_common/directives/email-to-user/email-to-user.html',
    controllerAs: 'u',
    controller: emailToUserController
};

function emailToUserController ($state,httpFactory,handleDataFactory) {
    'ngInject';

    this.subject = this.subject || 'default';
    const id = $state.params.id;
    // определяю что за состояние user or proj
    var url = $state.$current.includes.user?
    'user/send-message-to-user?userId=' +id :
    'project/send-message-to-owner?projectId=' +id;

    this.$onInit = ()=> {
        //this.textHeader = this.textHeader || 'Связаться с пользователем';
        //перезаписываю url в зависимости от темы письма
        if(this.subject=="vacancy") {
            url = 'project-looking/create-response?id=' + this.value
        }
    };

    this.sendEmailToUser = (m) => {
        this.emailIsSending = 1;
        m = handleDataFactory.cleanHTML(m);
        httpFactory.post(url, {
            "message": m
        }).then(d => {
            this.emailIsSend = 1;
            this.emailIsNotSend = 0;
            this.emailIsSending = 0;
        }, e => {
            this.emailIsNotSend = e.data.message || e.data[0].message;
            this.emailIsSending = 0;
        });
    }
}