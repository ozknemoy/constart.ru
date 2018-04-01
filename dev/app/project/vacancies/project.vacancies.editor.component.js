/**
 * Created by ozknemoy on 05.12.2016.
 */
export const projectVacEditorComponent = {
    templateUrl: 'app/project/vacancies/project.vacancies.editor.html',
    controller: projVacEditorController,
    controllerAs: 'v'
};

export function projVacEditorController($state,httpFactory,ngToast,handleDataFactory,$timeout) {
    'ngInject';

    this.baseImgUrl = httpFactory.baseImgUrl;
    const project_id = $state.params.id;
    this.id = $state.params.id_vacancy;
    this.optionsExt = {
        height: '500',
        language: 'ru',
        allowedContent: true,// вроде теги всякие и подобное
        entities: false
    };
    
    if(this.id=='new') {
        this.vac = {};
        this.isNew = 'new';
    } else {
        httpFactory.get(`project-looking/view?id=${this.id}`).then(d=> {
            this.vac = d.data
        })
    }

    this.save =  ()=> {
        this.pend = 1;
        $timeout(()=>{
            this.vac.body = handleDataFactory.cleanHTML(this.vac.body);
            let l = this.vac.body.length;

            if(l>100000 || l<10) {
                ngToast.danger({dismissButton: true,content:`Описание должно содержать от 10 до 100000 символов. Ваше содержит ${l}`});
                this.pend = 0;
                return
            }
            if(this.isNew) {
                httpFactory.post('project-looking/create?project_id=' + project_id,this.vac).then(d=> {
                    success('Вакансия была успешно создана')
                })
            } else {
                httpFactory.put('project-looking/update?id=' + this.vac.id,this.vac).then(d=> {
                    success('Вакансия была успешно сохранена')
                })
            }
        },1000)
    };

    function success (text) {
        ngToast.success({dismissButton: true,content: text});
        //$state.reload();
        setTimeout(()=>{
            $state.go('proj.vacancies.all');
        },600)

    }

}