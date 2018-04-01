/**
 * Created by ozknemoy on 05.12.2016.
 */

export const projectVacAllComponent = {
    bindings: {
        ownProj: '@'
    },
    templateUrl: 'app/project/vacancies/project.vacancies.all.html',
    controller: projVacAllController,
    controllerAs: 'v'
};

export function projVacAllController($auth,$state,httpFactory) {
    'ngInject';

    this.baseImgUrl = httpFactory.baseImgUrl;
    this.isAuth = $auth.isAuthenticated();

    this.$onInit = ()=> {
        const project_id = $state.params.id;
        httpFactory.get(`project-looking/get-list?project_id=${project_id}&limit=100`).then(d=> {
            this.vac = d.data.list
        });
    };

    this.delete = (id) => {
        httpFactory.delete(`project-looking/delete?id=${id}`).then(d=> {
            //this.newses.splice(ind,1)
            $state.reload()
        })
    }
}