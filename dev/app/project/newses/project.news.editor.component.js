/**
 * Created by ozknemoy on 05.12.2016.
 */
export const projectNewsEditorComponent = {
    templateUrl: 'app/project/newses/project.news.editor.html',
    controller: projNewsEditorController,
    controllerAs: 'n'
};

export function projNewsEditorController($state,httpFactory,ngToast,handleDataFactory,$timeout) {
    'ngInject';

    this.baseImgUrl = httpFactory.baseImgUrl;
    const project_id = $state.params.id;
    this.id = $state.params.id_news;
    this.optionsExt = {
        height: '500',
        language: 'ru',
        allowedContent: true,// вроде теги всякие и подобное
        entities: false
    };
    
    if(this.id=='new') {
        this.news = {};
        this.isNew = 'new';
    } else {
        httpFactory.get(`project-news/view?id=${this.id}`).then(d=> {
            this.news = d.data
        })
    }

    this.save =  ()=> {
        this.pend = 1;
        $timeout(()=>{
            this.news.body = handleDataFactory.cleanHTML(this.news.body);
            let l = this.news.body.length;

            if(l>100000 || l<10) {
                ngToast.danger({dismissButton: true,content:`Запись должна содержать от 10 до 100000 символов. Ваша содержит ${l}`});
                this.pend = 0;
                return
            }
            if(this.isNew) {
                httpFactory.post('project-news/create?project_id=' + project_id,this.news).then(d=> {
                    success('Новость была успешно создана')
                })
            } else {
                httpFactory.put('project-news/update?id=' + this.news.id,this.news).then(d=> {
                    success('Новость была успешно сохранена')
                })
            }
        },1000)
    };

    function success (text) {
        ngToast.success({dismissButton: true,content: text});
        //$state.reload();
        setTimeout(()=>{
            $state.go('proj.news.all');
        },1000)

    }

    this.setFotoUrl = (id,value)=> {
        this.news.image = value;
    }
}