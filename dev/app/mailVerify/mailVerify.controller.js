export class MailVerifyController {
  constructor($timeout, $location, httpFactory) {
    'ngInject';

    var userToken = $location.search()['password_reset_token'];
    if (typeof userToken !== "undefined") {
      // восстановление пароля
      this.restorePassword = 1;

    } else {
      // верификация юзера пришедшего по ссылке с почты
      var id = $location.search()['id'];
      var email_token = $location.search()['email_token'];

      if (typeof id == "undefined" || isNaN(parseInt(id)) || typeof email_token == "undefined") {
        $location.path('/');
        return
      }

      this.confirm = 0;
      //try to confirm email    /mailVerify?id=125&email_token=rtxrntrtxnftxr
      httpFactory.post('user/' + parseInt(id) + '/confirm-email',{id: parseInt(id), email_token: email_token}).then(
          d => {
            this.confirm = 1
          }, err => {
            this.confirm = 2
          }
      )
    }

    this.sendPassword = function () {
      if (this.passwordOne === this.passwordTwo) {
        this.diffPassword = 0;
        // reset-password?password_reset_token=ыфсысфысфывс
        httpFactory.post('user/reset-password?password_reset_token=' + userToken,{password: this.passwordOne}).then(
            d => {
              this.changePassword = 1
            }, err => {
              this.changePassword = 2
            }
        )
      } else {
        this.diffPassword = 1;
      }

    }

  }
}