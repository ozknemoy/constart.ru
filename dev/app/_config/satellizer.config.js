export function satConfig ($authProvider,baseUrl) {
  'ngInject';

  $authProvider.authHeader = 'X-AUTH-TOKEN';
  $authProvider.httpInterceptor = true;
  $authProvider.baseUrl = baseUrl;
  $authProvider.loginUrl = 'user/login';
  $authProvider.tokenName = 'token';
  $authProvider.authToken = '';
  $authProvider.tokenPrefix = '';
}
