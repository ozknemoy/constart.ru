

export function routerConfig($locationProvider,$stateProvider, $urlRouterProvider,TYPE) {
  'ngInject';

    // некоторые маршруты только для определенных сайтов

    var routes = {
        all: {
            home: 'app/home/home.html',
            projects: 'app/projects/projects.html'
        },
        cf: {

        },
        air: {
            home: 'app/home/home-air.html',
            projects: 'app/projects/projects-cf.html'
        }
    };
    
    /*var ctrls = {
        all: {
            proj: 'ProjectController'
        },
        cf: {

        },
        air: {

        }
    };*/

    $urlRouterProvider.when('/project/:id', '/project/:id//about');
    $urlRouterProvider.when('/project/:id/', '/project/:id//about');

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $urlRouterProvider.otherwise('/');

  $stateProvider

      .state('home', {
        url: '/',
        templateUrl: routes[TYPE].home,
        controller: 'HomeController',
        controllerAs: 'home'
      })
      .state('homeair', {
          url: '/home',
          templateUrl: routes['air'].home ,
          controller: 'HomeController',
          controllerAs: 'home'
      })
      .state('projects', {
          url: '/projects?category',
          templateUrl: routes[TYPE].projects,
          controller: 'ProjectsController',
          controllerAs: 'projects'
      })

      .state('proj', {
          url: '/project/:id/:num',
          templateUrl: 'app/project/project.html',
          controller: 'ProjectController',//ctrls[TYPE].proj,
          controllerAs: 'project'
      })
      .state('proj.about', {
          url: '/about',
          parent: 'proj',
          templateUrl: 'app/project/project.about.html'
      })
      .state('proj.fin', {
          url: '/fin',
          parent: 'proj',
          templateUrl: 'app/project/project.fin.html',//routes[TYPE].projFin
      })
      .state('proj.team', {
          url: '/team',
          parent: 'proj',
          templateUrl: 'app/project/project.team.html'
      })
      .state('proj.budget', {
          url: '/budget',
          parent: 'proj',
          templateUrl: 'app/project/project.budget.html'
      })
      .state('proj.news', {
          url: '/news',
          parent: 'proj',
          templateUrl: 'app/project/newses/project.news.html'
      })
      .state('proj.news.all', {
          url: '/all',
          parent: 'proj.news',
          template: '<project-news-all own-proj="{{project.proj.isCurrentUserProject}}"></project-news-all>'
      })
      .state('proj.news.one', {
          url: '/one/:id_news',
          parent: 'proj.news',
          template: '<project-news-one></project-news-one>'
      })
      .state('proj.news.editor', {
          url: '/editor/:id_news',
          parent: 'proj.news',
          template: '<project-news-editor></project-news-editor>',
          resolve: {
              load: ['$ocLazyLoad', function($ocLazyLoad) {
                  return $ocLazyLoad.load(['ngCkeditorExt'])
              }]
          }
      })

      .state('proj.vacancies', {
          url: '/vacancies',
          parent: 'proj',
          templateUrl: 'app/project/vacancies/project.vacancies.html'
      })
      .state('proj.vacancies.all', {
          url: '/all',
          parent: 'proj.vacancies',
          template: '<project-vac-all own-proj="{{project.proj.isCurrentUserProject}}"></project-vac-all>'
      })
      .state('proj.vacancies.one', {
          url: '/one/:id_vacancy',
          parent: 'proj.vacancies',
          template: '<project-vac-one own-proj="{{project.proj.isCurrentUserProject}}"></project-vac-one>'
      })
      .state('proj.vacancies.editor', {
          url: '/editor/:id_vacancy',
          parent: 'proj.vacancies',
          template: '<project-vac-editor></project-vac-editor>',
          resolve: {
              load: ['$ocLazyLoad', function($ocLazyLoad) {
                  return $ocLazyLoad.load(['ngCkeditorExt'])
              }]
          }
      })

      .state('proj.comments', {
          url: '/comments',
          parent: 'proj',
          template: '<project-comments rewards="::project.r" is-owner="::project.proj.isCurrentUserProject" owner="::project.owner"></project-comments>'
      })

      .state('proj.reward', {
          url: '/reward/:id_reward',
          parent: 'proj',
          template: '<project-reward-page is-ended="::project.isEnded" value="::project.r"></project-reward-page>'
      })

      .state('projectEditor', {
          url: '/projectEditor/:id',
          templateUrl: 'app/projectEdit/projectEditor.html',
          controller: 'ProjectEditorController',
          controllerAs: 'pe'
      })

      .state('projectEditorZero', {
          url: '/projectEditorZero',
          templateUrl: 'app/projectEdit/projectEditor.zero.html',
          controller: function(TYPE){
              'ngInject';
              this.TYPE = TYPE;
          },
          controllerAs: 'zero'
      })
      .state('projectEditor.about', {
          parent: 'projectEditor',
          url: '/about?type_id',
          templateUrl: 'app/projectEdit/projectEditor.about.html'
      })
      .state('projectEditor.desc', {
          parent: 'projectEditor',
          url: '/description',
          templateUrl: 'app/projectEdit/projectEditor.desc.html',//routes[TYPE].pEDesc,
          resolve: {
              load: ['$ocLazyLoad', function($ocLazyLoad) {
                  return $ocLazyLoad.load(['ngCkeditorExt'])
              }]
          }
      })
      .state('projectEditor.team', {
          parent: 'projectEditor',
          url: '/team',
          templateUrl: 'app/projectEdit/_projectEditor.team.html'
      })
      .state('projectEditor.budget', {
          parent: 'projectEditor',
          url: '/budget',
          templateUrl: 'app/projectEdit/projectEditor.budget.html'
      })



      .state('users', {
          url: '/users',
          templateUrl: 'app/users/users.html',
          controller: 'UsersController',
          controllerAs: 'users',
          pageTrack: '/users'
      })

      .state('user', {
          url: '/user/:id',
          templateUrl: 'app/user/user.html',
          controller: 'UserController',
          controllerAs: 'u',
          pageTrack: '/user'
      })
      .state('user.about', {
          parent: 'user',
          url: '/about',
          templateUrl: 'app/user/user.about.html'
      })
      .state('user.projects', {
          parent: 'user',
          url: '/projects',
          templateUrl: 'app/userEdit/userEditor.projects.html'
      })
      .state('user.history', {
          parent: 'user',
          url: '/history',
          template: '<constart-history></constart-history>'
      })

      .state('userEditor', {
          url: '/userEditor/:id',
          templateUrl: 'app/userEdit/userEditor.html',
          controller: 'UserEditorController',
          controllerAs: 'ue'
      })
      .state('userEditor.about', {
          parent: 'userEditor',
          url: '/about',
          templateUrl: 'app/userEdit/userEditor.about.html'
      })
      .state('userEditor.projects', {
          parent: 'userEditor',
          url: '/projects',
          templateUrl: 'app/userEdit/userEditor.projects.html'
      })
      .state('userEditor.history', {
          parent: 'userEditor',
          url: '/history',
          template: '<constart-history></constart-history>'
      })

      .state('mailVerify', {
          url: '/mailVerify',
          templateUrl: 'app/mailVerify/mailVerify.html',
          controller: 'MailVerifyController',
          controllerAs: 'mailVerify'
      })
      .state('agreeTeam', {
          url: '/agreeTeam',
          templateUrl: 'app/agreeTeam/agreeTeam.html',
          controller: 'agreeTeamController',
          controllerAs: 'at'
      })

      .state('experts', {
          url: '/experts',
          templateUrl: 'app/experts/experts.html',
          controller: 'ExpertsController',
          controllerAs: 'es'
      })

      .state('expert', {
          url: '/expert:id',
          templateUrl: 'app/expert/expert.html',
          controller: 'ExpertController',
          controllerAs: 'e'
      })

      .state('aggreeTeam', {
          url: '/aggreeTeam',
          templateUrl: 'app/aggreeTeam/aggreeTeam.html',
          controller: 'aggreeTeamController',
          controllerAs: 'at'
      })

      .state('help', {
          url: '/help?id',
          templateUrl: 'app/help/help.html',
          controller: 'helpController',
          controllerAs: 'h'
      });


// пути для констарта
    if(TYPE=='all') {
        $stateProvider
            .state('businessCalendar', {
                url: '/businessCalendar',
                templateUrl: 'app/business-calendar/business-calendar.html'
            })
    }


    if(TYPE=='air') {
        $stateProvider
            .state('memorandumOdvf', {
                url: '/memorandumOdvf',
                templateUrl: 'app/odvf/memorandum-odvf/memorandum-odvf.html'
            })
    }

}

