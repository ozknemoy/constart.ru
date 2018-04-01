/**
 * Created by ozknemoy on 06.12.2016.
 */
export const projectVacOneComponent = {
    bindings: {
        ownProj: '@'
    },
    templateUrl: 'app/project/vacancies/project.vacancies.one.html',
    controller: projVacOneController,
    controllerAs: 'v'
};

export function projVacOneController($auth,$state,httpFactory,$sce) {
    'ngInject';

    const project_id = $state.params.id;
    var map={};

    this.$onInit = () => {
        this.isAuth = $auth.isAuthenticated();
        this.idVac = $state.params.id_vacancy;

        httpFactory.get(`project-looking/get-list?project_id=${project_id}`).then(d=> {
            this.vacancies = d.data.list;
            this.vacancies.forEach((n,i)=> {
                map[i] = n.id;    //{0:21,1:26} карта новостей
                if(this.idVac==n.id) this.currentPage = i
            });

            this.allCount = d.data.allCount
        });

        this.getActualNews(this.idVac);
    };



    this.getActualNews = (id)=> {
        httpFactory.get(`project-looking/view?id=${id}`).then(d=> {
            this.vac = d.data;
            this.vac.body = $sce.trustAsHtml(this.vac.body)
        })
    };

    this.prev = ()=> {
        this.currentPage--;
        $state.go('proj.vacancies.one',{id_vacancy:map[this.currentPage]});
    };

    this.next = ()=> {
        this.currentPage++;
        $state.go('proj.vacancies.one',{id_vacancy:map[this.currentPage]});
    };

}