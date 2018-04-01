/**
 * Created by ozknemoy on 14.12.2016.
 * сравнивает два мыла, при совпадении в колбек в родительский scope
 *
 *  <reg-light callback="rv.email=email"></reg-light>
 */
export const regLightComponent = {
    templateUrl: 'app/_common/directives/registration-light/reg-light.html',
    controller: regLightController,
    controllerAs: 'rl',
    bindings: {
        callback:'&'
    }
};

function regLightController() {
    'ngInject';

    this.check = () => {
        if (this.email != this.emailTwo && this.form.emailTwo.$touched && this.form.email.$touched) {
            this.emailNotEqual = 1;
            this.allOk = 0;
            this.callback({email:null})
        } else if(this.email == this.emailTwo && this.form.$valid){
            this.emailNotEqual = 0;
            this.allOk = 1;
            this.callback({email:this.email})
        }
    }
}