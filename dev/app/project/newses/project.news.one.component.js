/**
 * Created by ozknemoy on 06.12.2016.
 */
export const projectNewsOneComponent = {
    templateUrl: 'app/project/newses/project.news.one.html',
    controller: projNewsOneController,
    controllerAs: 'n'
};

export function projNewsOneController($state,httpFactory,$sce) {
    'ngInject';


    const project_id = $state.params.id;
    let startPage = $state.params.id_news;
    var map={};

    this.$onInit = () => {
        this.baseImgUrl = httpFactory.baseImgUrl;

        httpFactory.get(`project-news/get-list?project_id=${project_id}`).then(d=> {
            this.newses = d.data.list;
            this.newses.forEach((n,i)=> {
                map[i] = n.id;    //{0:21,1:26} карта новостей
                if(startPage==n.id) this.currentPage = i
            });

            this.allCount = d.data.allCount
        });

        this.getActualNews(startPage);
    }



    this.getActualNews = (id)=> {
        httpFactory.get(`project-news/view?id=${id}`).then(d=> {
            this.news = d.data;
            this.news.body = $sce.trustAsHtml(this.news.body)
        })
    };
    this.prev = ()=> {
        this.currentPage--;
        $state.go('proj.news.one',{id_news:map[this.currentPage]});
        //this.getActualNews(map[this.currentPage])
    };
    this.next = ()=> {
        this.currentPage++;
        $state.go('proj.news.one',{id_news:map[this.currentPage]});
        //this.getActualNews(map[this.currentPage])
    };

}