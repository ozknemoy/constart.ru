/**
 * Created by ozknemoy on 05.12.2016.
 */

export const projectNewsAllComponent = {
    bindings: {
        ownProj: '@'
    },
    templateUrl: 'app/project/newses/project.news.all.html',
    controller: projNewsAllController,
    controllerAs: 'n'
};

export function projNewsAllController($state,httpFactory) {
    'ngInject';
    
    const project_id = $state.params.id;
    this.baseImgUrl = httpFactory.baseImgUrl;

    httpFactory.get(`project-news/get-list?project_id=${project_id}&limit=100`).then(d=> {
        this.newses = d.data.list
    });

    this.delete = (id,ind) => {
        httpFactory.delete(`project-news/delete?id=${id}`).then(d=> {
            //this.newses.splice(ind,1)
            $state.reload()
        })
    }
}