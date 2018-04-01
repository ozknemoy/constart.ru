/**
 * Created by ozknemoy on 28.11.2016.
 */
export let inviteViewComponent = {
    bindings: {
        value: '<',// data
        type: '@',
        postedDate: '@',
        isOwn: '@?',// для команды
        statusFilter: '<?'// filter для инвайтов
    },
    templateUrl: 'app/_common/directives/invite-view/invite-view.html',
    controller:inviteTeamCtrl,
    controllerAs: 'iv'
};

function inviteTeamCtrl (dictFactory,httpFactory,handleDataFactory) {
    'ngInject';
    this.baseImgUrl = httpFactory.baseImgUrl;

    //this.id = Math.floor(Math.random()*10000);
    
    if (this.type=='teamInv' && this.value && this.value.length) {
        this.value.forEach(user=> {
            user = extendInvitee(user);//Object.assign(item.user||{},extendInvitee (item))

        });

        console.log("this.value",this.value);

    }

    // для безликих делаю вложеную структуру как у наших
    function extendInvitee (item) {
        // если безликий
        if (!item.user) {
            item.user = {
                email: item.email,
                foto: item.foto,
                id: 0,// назначаю ему ссылку несуществующего юзера
                message: item.message,
                name: item.name,
                project_id: item.project_id,
                role: item.role,
                status: item.status,
                surname: item.surname
            }
        } else {
            item.user.status = item.status
        }
        return item
    }
    
    httpFactory.getGeo().then(d=> {
        this.geo = d.data
    });

    this.userStatuses = function (status) {
        return dictFactory.objToNgRepeat(status,'user_statuses');
    };

    this.getCountryAndRegion = function (cID,regID) {
        return handleDataFactory.getCountryAndRegion(cID,regID,this.geo);
    };

    this.reInviteUser =  (id,idArr) => {
        httpFactory.post('project-team-invite/resend-invite?id=' + id).then(d=>{
            //this.proj.projectTeamInvite[idArr].status = this.proj.posted_date? 2:0
            this.value[idArr].status = this.postedDate!='null'? 2:0
        })
    };

    this.deleteInvite =  (id,idArr) => {
        httpFactory.delete('project-team-invite/delete?id='+id).then(d=>{
            //reloadMasonry();
            this.value.splice(idArr,1)
        })
    };

    this.pushUser = (u)=> {
        u = extendInvitee (u);
        //reloadMasonry();
        this.value.push(u);
    };

    /*function reloadMasonry() {
        angular.element('.masonry').masonry('destroy');
        setTimeout(()=>{
            masonry();
        },400)
    }

    function masonry() {
        angular.element('.masonry').masonry({
            itemSelector: '.masonry--item'
        })
    }
    masonry()*/
}