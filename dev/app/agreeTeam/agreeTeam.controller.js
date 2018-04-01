/**
 * Created by ozknemoy on 06.10.2016.
 */
export class agreeTeamController{
    constructor ($state,$location,$auth,httpFactory) {
        'ngInject';

        const type = $location.search()['type'];
        var token = $location.search()['token'];
        //const type = $location.search()['type'];
        this.project_id = $location.search()['project_id'];

        if(type==='0') {// отказался или какая то херь
            httpFactory.post('project-team-invite/refuse-invite?token=' + token).then(d=> {
                this.success()
            },e => {
                this.error = e.data.message;
            })

        } else if (type==='1') {
            /*if(!$auth.isAuthenticated()) {
                angular.element('login-button').click();//angular.element('#login-modal').modal()
            } else {*/
            httpFactory.post('project-team-invite/accept-invite?token=' + token).then(d=> {
                this.success()
            },e => {
                this.error = e.data.message;
                if(/Вы еще не зарегистрированы у нас/g.test(this.error)) {
                    // если чел не под логином
                    this.notLogin  = 1;
                }
            })

        } else this.error = 'Не верная ссылка';

        this.success = ()=>{
            this.type=type;
            setTimeout(()=>{
                $state.go('home')
            },5000)
        };
        /*
        *http://beta.constart.ru/agreeTeam?token=WutsZIfvr6U2RmnBi3RB6TloRqCQ8HuH_1480324191&type=1
        * */

    }
}