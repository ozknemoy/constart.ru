/**
 * Created by ozknemoy on 26.01.2017.
 *
 * <like-button like="{{project.proj.like}}" callback="project.proj.like=1;project.ret=project.ret+1">
 */

export const likeButtonComponent = {
        bindings: {
           callback: '&',
            like: '@',
            projectId: '@'
        },
        controller: function(httpFactory,$stateParams,$element,$timeout,userFactory) {
            'ngInject';

            this.$onInit = ()=> {
                $element.on('click', this._click);

            };

            this.$onChanges = ()=> {
                if(this.like) this.setClass()
            };

            this._click = () => {
                httpFactory.get(`project/${this.projectId || $stateParams.id}/add-like`).then(d=> {
                    this.setClass();
                    $timeout(()=>{
                        this.callback();
                    })
                },e=> userFactory.reLogin(e,true))
            };

            this.setClass = ()=> {
                $element.addClass('pointer-none')
            };

            this.$onDestroy = ()=> {
                $element.off('click', this._click);
            }
        }
};

