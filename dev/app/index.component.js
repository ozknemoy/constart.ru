/**
 * Created by ozknemoy on 09.11.2016.
 */

// directives
import {ozkImgDirective} from './_common/directives/ozk-img.directive';
import {InfiniteScroll} from './_common/directives/infiniteScroll';
import {ozkNumberDirective, ozkEnterDirective, ozkCleanDirective,enterForBreakDirective} from './_common/directives/num.directive';
//import {sendEmailDirective} from './_common/directives/send-email/send-email.directive';
import {tryToSeeUserDirective} from './_common/directives/try-to-see-user/try-to-see-user.directive';
import {modalOpenDirective} from './_common/modals/modal-open.directive';
import {notIfDirective} from './_common/directives/notIf.directive';
import {scrollToDirective} from './_common/directives/scrollTo.directive.js';
import {likeButtonComponent} from './_common/directives/like-button';

// components
//import {PayDirective} from './_common/directives/pay/pay.directive';
import {NavbarDirective} from './_common/directives/navbar/navbar.directive';
import {constartHistoryDirective} from './_common/directives/constart-history/constart-history.directive';
import {constartAgreementComponent} from './_common/directives/constart-agreement/constart-agreement.directive';
import {constartProjectComponent} from './_common/directives/constart-project/constart-project.component';
import {fotoeditorComponent} from './_common/directives/fotoeditor/fotoeditor.component';
import {scrollUpComponent} from './_common/directives/scroll-up.component';
import {emailToUserComponent} from './_common/directives/email-to-user/email-to-user.component';
import {constartUserComponent} from './_common/directives/constart-user/constart-user.component';
import {payDeposit} from './_common/modals/pay-deposit/pay-deposit.component';
import {legalsView} from './_common/directives/legals-view/legals-view.component';
import {legalsEdit} from './_common/modals/ue-legals-edit/ue-legals-edit.component';
import {payOwnProject} from './_common/modals/pay-own-project/pay-own-project.component';
import {loginButtonComponent} from './_common/modals/login-button/login-button.component';
import {regButtonComponent} from './_common/modals/reg-button/reg-button.component';
import {smsRequestComponent} from './_common/modals/sms-request/sms-request.component';
import {confirmButtonComponent} from './_common/modals/confirm-button/confirm-button.component';
import {
    masonryReloadComponent,
    menuToggleComponent,
    gridReloadComponent} from './_common/directives/small.component';
import {inviteViewComponent} from './_common/directives/invite-view/invite-view.component';
import {payButtonComponent} from './_common/modals/pay-button/pay-button.component';
import {rewardViewComponent} from './_common/modals/reward-view/reward-view.component';
import {constartRewardsComponent} from './_common/directives/constart-rewards/constart-rewards.component';
import {inviteUserAddComponent} from './_common/modals/invite-user-add/invite-user-add.component';
import {addVideoComponent} from './_common/modals/pe-desc-add-video/pe-desc-add-video.component';
import {projectNewsEditorComponent} from './project/newses/project.news.editor.component';
import {projectNewsAllComponent} from './project/newses/project.news.all.component';
import {projectNewsOneComponent} from './project/newses/project.news.one.component';
import {projectRewardPageComponent} from './project/rewards/project.reward.page.component';
import {photoEditorComponent} from './_common/modals/photo-editor/photo-editor.component';
import {projectGalleryComponent} from './_common/directives/project-gallery/project-gallery.component';
import {regLightComponent} from './_common/directives/registration-light/reg-light.component';
import {phoneVerifyComponent} from './_common/modals/phone-verify/phone-verify.component';
import {rewardEditorComponent} from './_common/modals/reward-editor/reward-editor.component';
import {projectVacEditorComponent} from './project/vacancies/project.vacancies.editor.component';
import {projectVacAllComponent} from './project/vacancies/project.vacancies.all.component';
import {projectVacOneComponent} from './project/vacancies/project.vacancies.one.component';
import {projectCommentsComponent} from './project/comments/project.comments.component';
import {commentWriterComponent} from './_common/directives/comment-writer/comment-writer.component';
import {rewardFreePriceComponent} from './_common/directives/reward-free-price/reward-free-price.component';
import {newsSliderComponent} from './_common/directives/news-slider/news-slider.component.js';
import {regLightButtonComponent} from './_common/modals/reg-light-button/reg-light-button.component.js'



export default angular
    .module('constart.component',[])
    .directive('infiniteScroll', InfiniteScroll)
    .directive('ozkNumber', ozkNumberDirective)
    .directive('ozkEnter', ozkEnterDirective)
    .directive('ozkClean', ozkCleanDirective)
    .directive('ozkImg', ozkImgDirective)
    .directive('modalOpen', modalOpenDirective)
    .directive('tryToSeeUser', tryToSeeUserDirective)
    .directive('notIf', notIfDirective)
    //.directive('enterForBreak', enterForBreakDirective)
    .directive('openModalFoto', function () {
        return {
            scope:{},
            controller: function ($element,$attrs) {
                'ngInject';
                $element.bind('click',()=>{
                    var q = angular.element('body').find('#__' + $attrs.openModalFoto);
                    //var q = document.getElementById('__'+$attrs.openModalFoto);
                    setTimeout(() => {
                        q.trigger("click");
                    },100);
                    /*target.click();*/
                    console.log(q)
                })
            }
        }
    })
    .directive('scrollTo', scrollToDirective)
    .component('likeButton', likeButtonComponent)


    .component('navBar', NavbarDirective)
    .component('fotoEditor', fotoeditorComponent)
    .component('constartProject', constartProjectComponent)
    .component('constartHistory', constartHistoryDirective)
    .component('constartAgreement', constartAgreementComponent)
    .component('scrollUp', scrollUpComponent)
    .component('emailToUser', emailToUserComponent)
    .component('constartUser', constartUserComponent)
    .component('payDeposit', payDeposit)
    .component('legalsView', legalsView)
    .component('legalsEdit', legalsEdit)
    .component('payOwnProject', payOwnProject)
    .component('loginButton', loginButtonComponent)
    .component('regButton', regButtonComponent)
    .component('confirmButton', confirmButtonComponent)
    .component('masonryReload', masonryReloadComponent)
    .component('gridReload', gridReloadComponent)
    .component('menuToggle', menuToggleComponent)
    .component('inviteView', inviteViewComponent)
    .component('payButton', payButtonComponent)
    .component('rewardView', rewardViewComponent)
    .component('constartRewards', constartRewardsComponent)
    .component('inviteUserAdd', inviteUserAddComponent)
    .component('addVideo', addVideoComponent)
    .component('projectNewsEditor', projectNewsEditorComponent)
    .component('projectNewsAll', projectNewsAllComponent)
    .component('projectNewsOne', projectNewsOneComponent)
    .component('projectRewardPage', projectRewardPageComponent)
    .component('photoEditor', photoEditorComponent)
    .component('smsRequest', smsRequestComponent)
    .component('projectGallery', projectGalleryComponent)
    .component('phoneVerifyComponent', phoneVerifyComponent)
    .component('phoneVerify', phoneVerifyComponent)
    .component('regLight', regLightComponent)
    .component('rewardEditor', rewardEditorComponent)
    .component('projectVacEditor', projectVacEditorComponent)
    .component('projectVacAll', projectVacAllComponent)
    .component('projectVacOne', projectVacOneComponent)
    .component('projectComments', projectCommentsComponent)
    .component('commentWriter', commentWriterComponent)
    .component('rewardFreePrice', rewardFreePriceComponent)
    .component('newsSlider', newsSliderComponent)
    .component('regLightButton', regLightButtonComponent)

    .component('ozkButton',  {
        bindings: {
            innerClass:'@?'
            ,callback:'&'
        },
        transclude: true,
        controller: function (Upload,$element,$attrs,$timeout) {
            var b = this;

            b.class = b.innerClass || "btn-success";

            $element.children().bind('click',()=>{
                $timeout(()=>{
                    b.pend = 1;
                });
                $timeout(()=>{
                    b.pend = 0;
                    b.callback({key:11111})
                },1111000)
            });

            b.upload =  (file, id)=> {
                if (!file) return;
                this.pend = 1;
                Upload.upload({
                        url: this.baseUrl + 'file/upload',
                        data: {file: file}
                    })
                    .then((resp) => {
                        this.u.passport[id] = resp.data.filename;
                        this.pend = 0;
                    }, err => {

                    }, evt => {
                        //console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% ' + evt.config.data.file.name);
                    });
            }
        },
        controllerAs: 'b',
        template: `
            <button class="btn btn-animated {{b.class}}"
                 ng-class="{'animated':b.pend}"
                 ng-disabled="b.pend">
                 <span class="btn-visible" ng-transclude></span>
                 <span class="btn-hidden"><i class="fa fa-spinner fa-lg fa-spin"></i></span>
             </button>`

    })


;


