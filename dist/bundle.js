var AngularNotifyModule = angular.module('angularNotify', ['ng']);
// 事件监听绑定到rootScope的装饰器
AngularNotifyModule.config(['$provide', function($provide){
	$provide.decorator('$rootScope', ['$delegate', function($delegate){
		Object.defineProperty($delegate.constructor.prototype, '$onRootScope', {
			value: function(name, listener){
				var unsubscribe = $delegate.$on(name, listener);
				this.$on('$destroy', unsubscribe);

				return unsubscribe;
			},
			enumerable: false
		});

		return $delegate;
	}]);
}]);

AngularNotifyModule.directive('notifybar', [
	function(){
		return {
			restrict: 'EAC',
			link: function(scope, elem, attrs){
				var createNotify = function(notifyData){
					notifyContainer = document.createElement('div');
					var title = document.createElement('p');
					title.className += ' title';
					title.innerHTML = notifyData.title;
					notifyContainer.appendChild(title);
					if( typeof notifyData.content == 'string' && notifyData.content.length !== 0 ){
						var content = document.createElement('p');
						content.className += ' content';
						content.innerHTML = notifyData.content;
						notifyContainer.appendChild(content);
					}
					var closeBtn = document.createElement('button');
					closeBtn.className += ' close';
					closeBtn.innerHTML = '<i class="fal fa-times"></i>';
					closeBtn.addEventListener('click',function(){
						notify.hideFunc();
					});
					notifyContainer.appendChild(closeBtn);
					notifyContainer.className += 'angular-notify';
					switch(notifyData.type){
						case 'success':
							notifyContainer.className += (' angular-notify' + '-success');
							scope.$emit('playSound', { message: notifyData.type });
							break;
						case 'info':
							notifyContainer.className += (' angular-notify' + '-info');
							scope.$emit('playSound', { message: notifyData.type });
							break;
						case 'warning':
							notifyContainer.className += (' angular-notify' + '-warning');
							scope.$emit('playSound', { message: notifyData.type });
							break;
						case 'error':
							notifyContainer.className += (' angular-notify' + '-error');
							scope.$emit('playSound', { message: notifyData.type });
							break;
					}
					notifyContainer.className += ' angular-notify-enter';

					var notify = {
						domElem: notifyContainer,
						removeDom: function(){
							$(this.domElem).remove();
						},
						hideFunc : function(){
							$(this.domElem).removeClass('angular-notify-enter');
							$(this.domElem).addClass('angular-notify-hide');
							setTimeout(function(){notify.removeDom();}, 320);
						}
					};

					return notify;
				};
				scope.$onRootScope('notify',function(e,notifyData){
					if($.inArray(notifyData.type, ['success', 'info', 'warning', 'error']) !== -1){
						if( typeof notifyData.title == 'string' && notifyData.title.length !== 0){
							var notify = createNotify(notifyData);
							var timeout = notifyData.timeout || 3200;
							elem[0].appendChild(notify.domElem);

							var timeoutID = setTimeout(function(){notify.hideFunc();}, timeout);
							$(notify.domElem).mouseenter(function(){
								window.clearTimeout(timeoutID);
							}).mouseleave(function(){
								timeoutID = setTimeout(function(){notify.hideFunc();}, timeout);
							});
						}
					}
				});
			}
		};
	}
]);
(function(){
	
    function apiUrl()
    {
      return (location.hostname == 'alpha.iskillmetrics.com') ? 'https://api.iskillmetrics.com/' : 'http://api.io2v3.dvp/';
    }

    function siteUrl()
    {
       return (location.hostname == 'alpha.iskillmetrics.com') ? 'https://alpha.iskillmetrics.com/' : 'http://localhost:8000/';     
    }

    angular.module('io2v3', ['ui.router', 'loadingStatus', 'angularNotify', 'ngSanitize'])
         
     .constant('API_URL', apiUrl())
     .constant('SITE_URL', siteUrl());

})();


angular.module('io2v3').run(['$rootScope','$state', '$stateParams', '$window', 'auth', '$anchorScroll', function ($rootScope, $state, $stateParams, $window, auth, $anchorScroll) {

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams, options) {

       // $window.scrollTo(0, 0);



       if($rootScope.pooling != undefined )
       {
         
          $rootScope.pooling.abort(); 

       }


       if($rootScope.studenExamListPooling != undefined)
       {

          $rootScope.studenExamListPooling.abort();
       }


        if(toState.authenticate == true)
        {

            
             
            if(!auth.hastokenAndUser())
            {

                e.preventDefault();
                $state.go('logout');

              /*
                toState, toParams
                these two params can be attached to $rootScope 
                redirect to login 
                login success we can simply redirect user when from which protected route they were redirected to login
                suppose user click at quiz:42 it requires login we can catch these values redirect to login
                when done we can redirect back to that quiz with corresponing ids.
            */

            }



            if(toState.roles != undefined)
            {
                
                
                var userRole = auth.getUser().role;

                if(toState.roles.indexOf(userRole) != -1)
                {
                    
                }
                else {
                    e.preventDefault();
                    $state.go('logout');
                    
                }
            }

            if (toState.permission != undefined)
            {
              
                if(auth.userHasPermission(toState.permission) == false)
                {
                    e.preventDefault();
                    $state.go('logout');
                }
                
              
            }


        }

        

    });


    $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {

                
          /*  

        setTimeout(function() {

         //   $window.scrollTo(0, 0);

            console.log('page has finised loading');

        }, 3000);

        */

        // only when need to intercept
       // e.preventDefault();

    });

    $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {

        console.log(error);

    });


}]);


angular.module('loadingStatus', [])
 
.config(function($httpProvider) {
  $httpProvider.interceptors.push('loadingStatusInterceptor');
})
 
.directive('loadingStatusMessage', [function() {
  return {
    link: function($scope, $element, attrs) {
      var show = function() {
        $element.css('display', 'block');
      };
      var hide = function() {
        $element.css('display', 'none');
      };
      $scope.$on('loadingStatusActive', show);
      $scope.$on('loadingStatusInactive', hide);
      hide();
    }
  };
}])
 
.factory('loadingStatusInterceptor', ['$q', '$rootScope', function($q, $rootScope) {
  var activeRequests = 0;
  var started = function() {
    if(activeRequests==0) {
      $rootScope.$broadcast('loadingStatusActive');
    }    
    activeRequests++;
  };
  var ended = function() {
    activeRequests--;
    if(activeRequests==0) {
      $rootScope.$broadcast('loadingStatusInactive');
    }
  };
  return {
    request: function(config) {
      started();
      return config || $q.when(config);
    },
    response: function(response) {
      ended();
      return response || $q.when(response);
    },
    responseError: function(rejection) {
      ended();
      return $q.reject(rejection);
    }
  };
}]);
(function(){

    angular.module('io2v3')


    .config(stateConfig);

    stateConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

    function stateConfig($stateProvider, $urlRouterProvider, $locationProvider){

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true  
         });

        $urlRouterProvider.otherwise('notfound');

        $stateProvider

        .state('pub', {
            templateUrl: 'views/templates/publicTemplate.html',
            abstract: true
        })



        .state('pub.home', {

            url: '/',
            templateUrl: 'views/home.html',
            controller : 'homeCtrl'
        })

        .state('pub.about', {

            url: '/about',
            templateUrl: 'views/about.html'
        })

        .state('pub.tos', {

            url: '/term-service',
            templateUrl: 'views/terms-service.html'
        })

        .state('pub.pp', {

            url: '/privacy-policy',
            templateUrl: 'views/privacy-policy.html'
            
        })

        .state('exm', {
            abstract: true,
            templateUrl : 'views/templates/tab.exam.layout.html',
            controller : 'examMgmtAbstractCtrl as exAbs'
            
        })

        .state('exm.exam', {
            url : '/exam-overview/:examID',
            templateUrl : 'views/exams/exam-overview.html',
            controller : 'examOverviewCtrl as vm'
        })
      

        .state('exm.quizQuestions', {
            url : '/quiz-questions/:examID',
            templateUrl : 'views/exams/quiz-questions.html',
            controller : 'quizQuestionsCtrl as vm'
        })

        .state('exm.addQuizQuestions', {
            url : '/add-quiz-questions/:examID',
            templateUrl: 'views/dash/que-add.html',
            controller : 'queAddCtrl as vm',

            resolve : {

                queGlobalData : function(quizDataService)
                {

                   return quizDataService.queGlobalFetch();
                }

            }

        })


        .state('exm.quizOverview', {

            url : '/exam-quiz-overview',
            templateUrl : 'views/exams/quiz-attempt-overview.html'
            
        })


        .state('exm.enroll', {

            url : '/exam-enroll/:examID',
            templateUrl : 'views/exams/exam-enroll.html',
            controller : 'enrollCtrl as vm'
            
        })

        .state('exm.register', {

            url : '/exam-register/:examID',
            templateUrl : 'views/exams/exam-register.html',
            controller : 'registerEnrollCtrl as vm'
            
        })


        .state('exm.progress', {

            url : '/exam-progress/:examID',
            templateUrl : 'views/exams/exam-progress.html',
            controller : 'quizProgressCtrl as vm'
            
        })

        .state('exm.prog-detail', {

            url : '/exam-progress-detail',
            templateUrl : 'views/exams/exam-progress-detail.html',
            
        })

        .state('exm.answer', {
            url : '/exams/answer/:examID/:attemptID',
            templateUrl : 'views/exams/answer-sheet.html',
            controller : 'quizAnswerInpectCtrl as vm'
        })

        .state('exm.consent', {
            url : '/exams/consent/:examID/:attemptID',
            templateUrl : 'views/exams/consent.html',
            controller : 'quizAnswerConsentCtrl as vm'           
        })

        .state('exm.scorecard', {
            url : '/exams/scorecard/:examID/:attemptID',
            templateUrl : 'views/exams/scorecard.html',
            controller : 'quizScoreCardCtrl as vm'           
        })

        .state('exm.quizWeightDistro', {

            url : '/quiz-weight-distro/:examID',
            templateUrl : 'views/exams/quiz-weight-distro.html',
            controller : 'quizWeightDistroCtrl as vm'
            
        })

        .state('exm.quizEvaluate', {

            url : '/quiz-evaluate',
            templateUrl : 'views/exams/quiz-evaluate.html'
            
        })

        .state('exm.notify', {

            url : '/notify',
            templateUrl : 'views/notify.html',
            controller: 'notifyCtrl as vm'
            
        })


        .state('dash', {
            templateUrl : 'views/templates/tab.layout.html',
            controller: 'dashboardCtrl as dash',
            abstract: true
        })


        

        .state('dash.land', {
            url : '/dashboard',
            templateUrl: 'views/dash-landing.html',
            controller : 'dashLandCtrl as vm',
            authenticate: true
            
        })

        .state('dash.profile', {

            url : '/profile',
            templateUrl : 'views/dash/profile.html',
            controller : 'dashProfileCtrl as vm'

        })


        .state('std.profile', {

            url : '/account-details',
            template : '<h2>Profile Settings are not avaialable</h2>'

        })



        .state('dash.admindashboard', {

            url : '/dashboard',
            template : '<h1>Admin dashboard is under  contruction please login with : abf@domain.com to view entity dashboard</h1>'


        })


        .state('dash.entityDashbaord', {
            url : '/dashboard',
            templateUrl: 'views/dashboard-entity.html',
            controller : 'dashboardEntityCtrl as vm',
            authenticate: true,
            roles : ['entity']
        })


        .state('dash.contributorDashbaord', {
            url : '/dashboard',
            template: '<h2>Contributor dashboard is under construction</h2>',
            
            authenticate: true,
            roles : ['contributor']
        })

        .state('dash.contDevDashbaord', {
            url : '/dashboard',
            template: '<h2> Content Developer Dashboard is under construction </h2>',
            
            authenticate: true,
            roles : ['content developer']
        })

        .state('std.studentDashbaord', {
            url : '/dashboard',
            template: '<h2> Dashboard settings for candiates are not yet not available. </h2>',
            controller : 'studentDashboardCtrl as vm',
            authenticate: true,
            roles : ['students', 'candidate']
        })



        .state('dash.quizzes', {

            url : '/quizzes',
            templateUrl: 'views/dash/dash-quizzes.html',
            controller : 'dashQuizzesCtrl as vm',
            authenticate: true,
            roles : ['admin', 'entity', 'invigilator']
        })


        .state('dash.cats', {
            url : '/categories',
            templateUrl: 'views/dash/categories.html',
            controller : 'categoriesCtrl as vm',
            authenticate: true,
            roles : ['admin', 'content developer']
        })

        .state('dash.catree', {
            url : '/cat-tree',
            templateUrl: 'views/dash/cat-tree.html',
            controller : 'catTreeCtrl as vm'
        })

        


        .state('dash.quePool', {
            url : '/que-pool',
            templateUrl: 'views/dash/que-pool.html',
            controller : 'quepoolCtrl as vm'
        })

        .state('dash.questions', {
            url : '/questions',
            templateUrl: 'views/dash/questions.html',
            controller : 'questionsCtrl as vm',
            authenticate: true,
            roles : ['admin', 'content developer', 'contributor', 'entity']
        })

        .state('dash.queadd', {
            url : '/question-add',
            templateUrl: 'views/dash/que-add.html',
            controller : 'queAddCtrl as vm',
            resolve : {

                queGlobalData : function(quizDataService)
                {

                   return quizDataService.queGlobalFetch();
                }

            }
        })


        .state('dash.queupload', {
            url : '/question-upload',
            templateUrl: 'views/dash/questions-upload.html',
            controller : 'questionUploadCtrl as vm',
            resolve : {

                queGlobalData : function(quizDataService)
                {

                   return quizDataService.queGlobalFetch();
                }

            }
        })

        .state('dash.questionedit', {
            url : '/question-edit/:queID',
            templateUrl: 'views/dash/que-edit.html',
            controller : 'questionEditCtrl as vm',
            resolve : {
                
                queGlobalData : function(quizDataService)
                {
                   return quizDataService.queGlobalFetch();
                }


            },

            authenticate: true,
            roles : ['admin', 'entity', 'contributor', 'content developer']


        })


        .state('dash.users', {
            url : '/users',
            templateUrl: 'views/dash/users.html',
            controller : 'usersCtrl as vm',
            authenticate: true,
            roles : ['admin']
        })


        .state('dash.myusers', {
            url : '/my-users',
            templateUrl: 'views/dash/my-users.html',
            controller : 'myusersCtrl as vm',
            authenticate: true,
            roles : ['entity']
        })


        .state('dash.roles', {

            url : '/roles',
            templateUrl : 'views/dash/roles.html',
            controller : 'rolesCtrl as vm',
            authenticate: true,
            roles : ['admin']

        })

        .state('dash.permission', {
            url : '/permissions',
            templateUrl : 'views/dash/permissions.html',
            controller : 'permissionsCtrl as vm',
            authenticate: true,
            roles : ['admin']
        })

        .state('dash.rolePermissions', {
            url : '/role-permissions',
            templateUrl : 'views/dash/role-permissions.html',
            controller : 'rolePermissionsCtrl as vm',
            authenticate: true,
            roles : ['admin']
        })


        .state('dash.library', {

            url : '/library',
            templateUrl : 'views/dash/library.html',
            controller : 'libraryCtrl as vm',
            authenticate: true,
            roles : ['admin']

        })

        .state('dash.modal', {
            url : '/modal',
            templateUrl : 'views/modal.html',
            controller : 'modalCtrl as vm'
        })

        .state('dash.batches', {

            url : '/groups',
            templateUrl: 'views/dash/batches.html',
            controller : 'batchesCtrl as vm',
            authenticate: true,
            permission : ['batch-list']
        })


        .state('ua', {
            abstract: true,
            template: '<ui-view/>'
        })


        .state('ua.login', {
            url : '/login?actiontoken&redirectUrl',
            templateUrl: 'views/login.html',
            controller: 'loginCtrl as vm'
        })

        .state('ua.register', {
            url : '/register',
            templateUrl: 'views/register.html',
            controller : 'registerCtrl as vm'
        })

        .state('ua.forget', {
            url : '/forget',
            controller : 'forgetCtrl as vm',
            templateUrl: 'views/forget.html'
        })

        

        .state('ua.recovery', {
            url : '/recover?accesstoken',
            controller : 'recoverCtrl as vm',
            templateUrl: 'views/recover.html'
        })


        .state('logout', {
            url : '/logout',
            controller: 'logoutCtrl as vm'
        })


        

        .state('onExamRefresh', {
            url : '/examrefreshed/:attempt_id/:quiz_id',
            templateUrl: 'views/student/onexamrefresh.html',
            controller : 'examRefreshedCtrl as vm'
            
            
        })

        .state('quizcomplited', {

            url : '/quizcomplited',
            templateUrl : 'views/student/quizcomplited.html',
            controller : 'quizcomplitedCtrl as vm'

        })


        .state('std', {
            templateUrl: 'views/templates/tab.student.layout.html',
            controller : 'stdCtrl as std',
            abstract: true
        })


        .state('std.exams', {
            url : '/stexams',
            templateUrl : 'views/student/exams.html',
            controller: 'stdExamCtrl as vm'

        })

        .state('std.quiz', {
            url : '/quiz',
            controller : 'stdQuizCtrl as vm',
            templateUrl : 'views/student/quiz.html'

        })


        .state('quizPlay',{

            url : '/quiz-assement/:attempt_id/:quiz_id',
            templateUrl : 'views/student/quiz-play.html',
            controller : 'quizAttemptCtrl as vm',
            resolve : {

                quizPlayData : function(quizPlay, $stateParams)
                {
                    var attempt_id = $stateParams.attempt_id;
                    var quiz_id = $stateParams.quiz_id;
                    return quizPlay.prepQuizQuestion(quiz_id, attempt_id);
                }

            },
            authenticate : true,
            roles : ['students', 'student', 'candidate']
            
        })


        .state('quizPlayDLS', {

            url : '/quiz-assessment/dls/:attempt_id/:quiz_id',
            templateUrl : 'views/student/dynamic-quiz.html',
            controller : 'quizDlsCtrl as vm',
            resolve : {

                quizPlayData : function(quizPlay, $stateParams)
                {
                    var attempt_id = $stateParams.attempt_id;
                    var quiz_id = $stateParams.quiz_id;
                    return quizPlay.dlsPrep(quiz_id, attempt_id);
                }

            },

            authenticate : true,
            roles : ['students', 'student', 'candidate']
            

        })



        .state('inv', {

            templateUrl : 'views/templates/inv.invited.html',
            abstract : true,
            controller : 'invitedAbstractCtrl as vm'
        })


        .state('inv.invited', {

            url : '/i/:entityslug/:invitetoken',
            templateUrl : 'views/student/invited.html',
            controller : 'invitedbyentityCtrl as vm'

        })


        .state('dash.quizWizard', {

            url : '/new-quiz-wizard',
            templateUrl : 'views/new-quiz-wizard.html',
            controller : 'newQuizWizardCtrl as vm',

            resolve : {

                wizardPreset : function(quizWizardService)
                {

                   return quizWizardService.getPresetValues();     
                }

            }

        })


        .state('message', {
                url : '/message',
                templateUrl : 'views/message.html',
                controller : 'messageCtrl as vm'
        })
        

        .state('quizui', {

            url : '/quizui',
            templateUrl: 'views/student/quizui.html'

        })

        .state('mob', {
            templateUrl: 'views/templates/tab.mobile.layout.html',
            controller : 'mobileAbstractCtrl as vm',
            abstract: true
        })


        .state('mob.activity', {

            url : '/activity',
            templateUrl: 'views/mobile/activity.html',
            controller: 'mobileActivityCtrl as vm',
            authenticate: true,
            permission: 'activity-monitor'

        })


        .state('notfound', {
            url: '/notfound',
            templateUrl: 'views/404.html'
        });

 };

 })();




angular.module('io2v3').component('quizInfoComponent', {

            templateUrl: 'views/shared/quizInfo.html',
            controller: ['$scope', '$http', 'quizDataService', function($scope, $http, quizDataService) {

            	var vm  = this;
            	
            	quizDataService.getMasterQuiz(vm.param).then(

	        	function(res) {
	        		vm.Quiz = res.data.quiz[0];
		    		
	        	},


	        	function(res) {

	        		vm.loadProgress = false;
	        		
	        	});
                
            }],
            bindings: {
                param: '='
            }
        });
  angular.module('io2v3')

    .directive('backButton', [function() {

    return {
        restrict : 'A',
        link : function(scope, ele, attr, ngModel){
            ele.on('click', function(e) {

                history.back();

                e.preventDefault();


            });     
        }
    };


}])
angular.module('io2v3').directive('ckeditor', [function () {
  return {
    require: '?ngModel',
    link: function ($scope, elm, attr, ngModel) {


        /*

        var ck = CKEDITOR.replace(elm[0]);

        */

        
       var ck = CKEDITOR.replace(elm[0],
            {
                on :
                {
                    instanceReady : function( ev )
                    {
                        

                        this.focus();

                         $('iframe.cke_wysiwyg_frame', ev.editor.container.$).contents().on('click', function() {
                            ev.editor.focus();
                        });

                        
                    }
                }
            });


       

       ck.on('pasteState', function () {
            
            $scope.$apply(function () {
                ngModel.$setViewValue(ck.getData());
            });



        });

        

        ngModel.$render = function (value) {
            ck.setData(ngModel.$modelValue);
        };
    }
  };
}]);
        

    
        


    angular.module('io2v3')

    .directive('pickDt', [function() {

        return {

            restrict: 'C',
            require: 'ngModel',

            link: function(scope, ele, attr, ngModel)
            {
                ele.datetimepicker({
                format: 'yyyy-MM-dd hh:mm',
                pickDate: true,
                pickTime: true,
                pick12HourFormat: false,   
                pickSeconds: false,
                language: 'en',
                
                    onSelect: function(dateText) {
                      scope.$apply(function() {
                        ngModel.$setViewValue(dateText);

                    });
                 }
                

                });
            }

        };

    }]);

/**
 * An AngularJS directive for Dropzone.js, http://www.dropzonejs.com/
 * https://gist.github.com/compact/8118670#file-dropzone-directive-js
 * Usage:
 * 
 * <div ng-app="app" ng-controller="SomeCtrl">
 *   <button dropzone="dropzoneConfig">
 *     Drag and drop files here or click to upload
 *   </button>
 * </div>
 */


angular.module('io2v3').directive('dropzone', [function () {
  return function (scope, element, attrs) {

    element.addClass('dropzone');

    var config, dropzone;

    config = scope[attrs.dropzone];

    // create a Dropzone for the element with the given options
    dropzone = new Dropzone(element[0], config.options);

    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
  };
}]);




/**
 * An AngularJS directive for Dropzone.js, http://www.dropzonejs.com/
 * https://gist.github.com/compact/8118670#file-dropzone-directive-js
 * Usage:
 * 
 * <div ng-app="app" ng-controller="SomeCtrl">
 *   <button dropzone="dropzoneConfig">
 *     Drag and drop files here or click to upload
 *   </button>
 * </div>
 */


 angular.module('hdtest', [])


 .controller('dzCtrl', ['$scope', function ($scope) {

  
  $scope.dropzoneConfig = {
    'options': { 
      'url': 'http://api.haladrive.local/uploadslides/69'
    },
    'eventHandlers': {
      'sending': function (file, xhr, formData) {

      },
      'success': function (file, response) {
        console.log('file is sent');
      }
    }
  };
}])
.directive('dropzone', [function () {
  return function (scope, element, attrs) {

    element.addClass('dropzone');

    var config, dropzone;

    config = scope[attrs.dropzone];

    // create a Dropzone for the element with the given options
    dropzone = new Dropzone(element[0], config.options);

    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
  };
}]);


angular.module('io2v3').directive("fileInput", ['$parse', function($parse){
    return{
        link: function($scope, element, attrs){
            element.on("change", function(event){
                var files = event.target.files;
                /*
                console.log(files[0].name);
                */
                $parse(attrs.fileInput).assign($scope, element[0].files);
                $scope.$apply();
            });
        }
    }
}]);

(function(){
    angular.module('io2v3')

    .directive('modalTrigger', [function() {

        return {

            restrict: 'C',
            link: function(scope, ele, attr, ngModel)
            {
                ele.bind('click', function(e) {

                    console.log(attr.href);

                    var targetModel = angular.element( document.querySelector( attr.href ) );
                    targetModel.modal();

                    e.preventDefault();

                });
            }

        };





    }]);

})();
angular.module('io2v3').directive('permissions', permissionDirective);

permissionDirective.$inject = ['auth'];

function permissionDirective(auth)
{
  return {
       restrict: 'A',
       scope: {
          permissions: '='
       },
 
       link: function (scope, elem, attrs) {

         
            scope.$watch(auth.isLoggedIn(), function() {
                if (auth.userHasPermission(scope.permissions)) {

                     elem.show();

                    
                  
                } else {
                  
                    elem.remove();


                    

                }
              });          
       }
   }


}
(function(){
    
    angular.module('io2v3')

    .directive('staticLink', [function() {

    vm = this;

    return {
        restrict : 'C',
        link : function(scope, ele, attr, ngModel){
            ele.on('click', function(e) {
            e.preventDefault();
            });     
        }
    };


}])
    .directive('dropdownButton', [function() {


        vm = this;

    return {
        restrict : 'C',
        link : function(scope, ele, attr, ngModel){
        ele.on('click', function(e) {
        e.preventDefault();
        });
        }
    };
}])



    .directive('ngEnter', [function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
}]);



})();




angular.module('io2v3').directive('stringToNumber', [function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value);
      });
    }
  };
}]);
(function(){
    angular.module('io2v3')

    .directive('timePicker', [function() {

        return {

            restrict: 'C',
            link: function(scope, ele, attr, ngModel)
            {
                ele.pickatime({
                    default: 'now',
                    fromnow: 3000,       // set default time to * milliseconds from now (using with default = 'now')
                    twelvehour: true, // Use AM/PM or 24-hour format
                    donetext: 'OK', // text for done-button
                    cleartext: 'Clear', // text for clear-button
                    canceltext: 'Cancel', // Text for cancel-button
                    autoclose: true, // automatic close timepicker
                    ampmclickable: true, // make AM PM clickable
                    aftershow: function(){} //Function for after opening timepicker
                });
            }

        };





    }]);

})();
angular.module('io2v3').directive('passwordVerify', passwordVerify);


function passwordVerify() {
    return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController
      link: function(scope, elem, attrs, ngModel) {
        if (!ngModel) return; // do nothing if no ng-model

        // watch own value and re-validate on change
        scope.$watch(attrs.ngModel, function() {
          validate();
        });

        // observe the other value and re-validate on change
        attrs.$observe('passwordVerify', function(val) {
          validate();
        });

        var validate = function() {
          // values
          var val1 = ngModel.$viewValue;
          var val2 = attrs.passwordVerify;

          // set validity
          ngModel.$setValidity('passwordVerify', val1 === val2);
        };
      }
    }
  }

(function(){
	angular.module('io2v3')
	.controller('authAppCtrl', ['$state', 'auth', '$scope', 'API_URL', '$http', function($state, auth, $scope, API_URL, $http){

		vm = this;

		vm.auMessage = "This message is delivered from authAppCtrl"; 
		
       
		

		var allowedRoles = [1,3];
		var roleID = auth.getUser().role_id;
		roleID = parseInt(roleID);

		if( ( auth.isLoggedIn() ) && ( roleID !== 1 && roleID !== 3) )
		{
			$state.go('app.logout');
		}

       
	}]);

})();
(function(){
	angular.module('io2v3')
	.controller('baseCtrl', ['$scope', 'auth', 'langSer', 'API_URL', '$state', '$http', function($scope, auth, langSer, API_URL, $state, $http){

		var vm = this;

        


        vm.branding = "IO2 Version 3";

		$scope.baseUrl = API_URL;


        $scope.masterData = null;

		//$scope.lang = 'en';

        $scope.lang = langSer.init();


        $scope.soundObject = null;


        $scope.isPlaying = false;


        $scope.entityLogo = 'assets/images/demo-logo.jpg';




        $scope.soundWavListCollection = [

        API_URL+'assets/audio/notify-success.wav',
        API_URL+'assets/audio/notify-error.wav',
        API_URL+'assets/audio/notify-info.wav',
        API_URL+'assets/audio/notify-warning.wav',
        API_URL+'assets/audio/quiz-next.wav',
        API_URL+'assets/audio/quiz-prev.wav',
        API_URL+'assets/audio/quiz-timeout.wav',
        API_URL+'assets/audio/quiz-end.wav',
        API_URL+'assets/audio/modal-open.wav',

        ];



        $scope.soundWavListCollection.forEach(function(soundLinkUrl) {

          console.log(soundLinkUrl);


        });



        $scope.$on('playSound', function (event, args) {

             $scope.message = args.message;

             var audioUrl = null;

             if($scope.isPlaying === true)
             {
                console.log('stop previous audio'); 
                $scope.soundObject.pause();
                $scope.soundObject.currentTime = 0;
             }

             
             if($scope.message === 'success')
             {

                audioUrl= API_URL+"assets/audio/notify-success.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;


             } 
             else if ($scope.message === 'error')
             {
                audioUrl= API_URL+"assets/audio/notify-error.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }

             else if ($scope.message === 'warning')
             {
                audioUrl= API_URL+"assets/audio/notify-warning.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }

             else if ($scope.message === 'info')
             {
                audioUrl= API_URL+"assets/audio/notify-info.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }

             else if ($scope.message === 'modal-open')
             {
                audioUrl= API_URL+"assets/audio/modal-open.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }

             else if ($scope.message === 'quiz-next')
             {
                audioUrl= API_URL+"assets/audio/quiz-next.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }

             else if ($scope.message === 'quiz-prev')
             {
                audioUrl= API_URL+"assets/audio/quiz-prev.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }

             else if ($scope.message === 'quiz-timeout')
             {
                audioUrl= API_URL+"/assets/audio/quiz-timeout.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }

             else if ($scope.message === 'quiz-end')
             {
                audioUrl= API_URL+"assets/audio/quiz-end.wav";
                $scope.soundObject = new Audio();
                $scope.soundObject.src = audioUrl;
             }


             console.log($scope.message);


             $scope.soundObject.play().then(function(res){
                    

                    console.log($scope.soundObject);

                    $scope.isPlaying = true;


             });


             $scope.soundObject.addEventListener('ended', (event) => {

                    $scope.isPlaying = false;
                        
            });







        });



        vm.slugify = function(string) {
          const a = 'àáäâãåăæąçćčđďèéěėëêęǵḧìíïîįłḿǹńňñòóöôœøṕŕřßśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
          const b = 'aaaaaaaaacccddeeeeeeeghiiiiilmnnnnooooooprrssssttuuuuuuuuuwxyyzzz------'
          const p = new RegExp(a.split('').join('|'), 'g')

          return string.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
            .replace(/&/g, '-and-') // Replace & with 'and'
            .replace(/[^\w\-]+/g, '') // Remove all non-word characters
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
        };



        vm.decodeUrlToken = function(urlToken)
        {

            var decodedUri = decodeURIComponent(urlToken);
            var decodedObject = atob(decodedUri);
            return JSON.parse(decodedObject);

        };




            /*
            setTimeout(function() {

                document.addEventListener('contextmenu', event => event.preventDefault());

            })
            */



		$scope.gval = {

                "exams": ['Exams', 'الامتحانات'],
                "about" : ['About', 'حول'],
                "terms" : ['Terms', 'شروط'],
                "privacy" : ['Privacy Policy', 'سياسة خاصة'],
                

                'details': ['Details', 'تفاصيل'],



                'status': ['Status', 'الحالة'],
                'available' : ['Available', 'متوفر'],

                'options': ['Actions', 'خيارات'],
                'details': ['Details', 'تفاصيل'],
                

                'addnew': ['Add New', 'اضف جديد'],
                'update': ['Update', 'تحديث'],
                'save': ['Save', 'حفظ'],
                'cancel': ['Cancel', 'حذف'],
                'edit': ['Edit', 'تصحيح'],
                'remove': ['Remove', 'حذف'],
                'next' : ['Next', 'تالي'],
                'previous' : ['Previous', 'السابق'],


                'back': ['Back', 'الى الخلف'],

                'profile': ['Profile', 'الملف الشخصي'],
                'setting': ['Setting', 'ضبط'],
                'logout': ['Logout', 'الخروج']

        };


        vm.updateDashboardLogo = function()
        {

            var successLogoFetch = function(res)
            {

                 var fetchedLogo = res.data.logo;

                 if(res.data.logo == undefined && res.data.logo == null)
                 {
                     $scope.entityLogo = 'assets/images/demo-logo.jpg';    
                 }

                 else {

                    $scope.entityLogo = API_URL+fetchedLogo;

                 }

                 

                 

            };        

            var errorLogoFetch = function(res)
            {


                $scope.entityLogo = 'assets/images/demo-logo.jpg';

            };

            
            if(auth.isLoggedIn())
            {
           
                var roleName = auth.getUser().role;

                if(roleName == 'entity')
                {

                    // get self profile logo
                    $http.get(API_URL+'profile-authlogo').then(successLogoFetch, errorLogoFetch);
                    
                }

            }


        };




        

        



		vm.isLoggedIn = function()
		{
			return auth.isLoggedIn();	
		};

		$scope.getAuthUsername = function()
		{
                return vm.authUser().name;
		};

        $scope.isAdmin = function()
        {
          
            if(auth.isLoggedIn())
            {
                return (vm.authUser().role_id == 1) ? true : false;
                
            }
            else {

                return false;

            }

            
        };


		vm.authUser = function()
		{

            if(this.hastokenAndUser())
            {
                var user = localStorage.getItem('hdauEn');
                user = atob(user);
                return  user = JSON.parse(user);
            }

		};

        vm.hastokenAndUser = function()
        {
            if(localStorage.hasOwnProperty('auth_token') && localStorage.hasOwnProperty('hdauEn'))
            {
                return true;
            }
            else {
                return false;
            }
        };



		$scope.langLabel = function()
		{
			if($scope.lang == 'en')
			{
				return 'English';
			}
			else {
				return 'Arabic';
			}
		};


        vm.getIndex = function(array, attr, value) {
            for(var i = 0; i < array.length; i += 1) {
                if(array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        };

		


		$scope.switchLang = function()
        {

            $scope.lang = langSer.switchLang();

        };

        $scope.authUser = vm.authUser();

        $scope.langIndex = function()
        {
            if($scope.lang == 'en')
            {
                return 0;
            }
            else {
                return 1;
            }
        };

        /*
            return decoded string
            usage from controller : $scope.$parent.base.decodeData(encodedString);
        */


        vm.inboundDecode = function(string)
        {          
            return JSON.parse(decodeURIComponent(atob(string)));

        };


        /*
            return encoded string to send to server
            usage from controller : $scope.$parent.base.encodeData(encodedString);
        */


        vm.outboundEncode = function(string) 
        {

            return encodeURIComponent(window.btoa(string));

        };


        $scope.getUSerRole  = function()
        {

            return vm.authUser().role;

        };



        vm.generatePassword  = function() {

        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
                for (var i = 0, n = charset.length; i < length; ++i) {
                    retVal += charset.charAt(Math.floor(Math.random() * n));
                }
                return retVal;
        };




    }]);


})();
(function() {

    angular.module('io2v3').controller('batchesCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;

        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Batches";

        

        vm.revealQuizList = false;

        vm.loadingStatus = null;

        vm.showProgress = false;

        vm.revealCandProgress = false;


        vm.showEnrollment = false;

        vm.showBatchDetails = false;



        vm.getEligQuiz = function()
        {
            
            


            function getEligQuizSuccess(res)
            {
                vm.eligQuiz = res.data.eligQuiz;

                vm.revealQuizList = true;

                
            }

            function getEligQuizError(res)
            {


                var notify = {
                                type: 'error',
                                title: 'Error While Fetching Eligible Quiz',
                                content: res.data.message,
                                timeout: 5000 //time in ms
                            };
                            $scope.$emit('notify', notify);  

                vm.revealQuizList = false;

            }

            $http.get(API_URL+'batches/elig/quiz').then(getEligQuizSuccess, getEligQuizError);

        };


        vm.enrollProcess = function()
        {

            console.log(vm.nbt.email);


            vm.activeBatchId;

            $http({

                url : API_URL+'batches/enrollprocess/'+vm.activeBatchId,
                method: 'POST',
                data: {email: vm.nbt.email}

            }).then(


            function(res)
            {

                vm.nbt.email = "";


                if(vm.enrollCanidateList == undefined)
                {
                    vm.enrollCanidateList = res.data.lastCandiate;
                    vm.enrollContents = true;    
                }

                else {

                    vm.enrollCanidateList.push(res.data.lastCandiate[0]);

                }


                var notify = {
                                type: 'success',
                                title: 'Batch Enrollment',
                                content: res.data.message,
                                timeout: 8000 //time in ms
                            };
                            $scope.$emit('notify', notify);

                


            },


            function(res)
            {
                      var notify = {
                                type: 'error',
                                title: 'Failed Batch Enrollment',
                                content: res.data.message,
                                timeout: 8000 //time in ms
                            };
                            $scope.$emit('notify', notify);              

            });

        };


        vm.triggerEnroll = function(batch_id)
        {

            vm.showEnrollment = true;


            vm.activeBatchId = batch_id;



            $http.get(API_URL+'batches/tagged/canidates/'+batch_id).then(

            function(res) {


                if(res.status == 206)
                {
                    vm.enrollContents = false;
                }

                else if (res.status == 200)
                {
                    
                    vm.enrollContents = true;

                    vm.enrollCanidateList = res.data.candidates;

                    
                }




            }, function(res) {

            });

            /*

            1. make ajax get the list of student enrolled by batch_id
            2. show input box for new enrollment
            3. show errors 
            4. show new student enrolled
            5. show close button

            */

        };


        vm.closeCandProgress = function()
        {
            
            

            vm.revealCandProgress = false;
            vm.progressData = vm.lastBatchProgress;
            vm.showProgress = true;    


        }

        vm.nb = {};

        vm.batchQuizList = [];


        $http({
            url : API_URL+'batches',
        	method: 'GET',
        	cache: false
        })
        .then(function(res){

        		vm.dataList = res.data;
                vm.loadingStatus = true;

        }, function(res){

            vm.loadingStatus = false;
          

        });


        vm.enableQuizSelect = function()
        {          

            vm.getEligQuiz();
            
                
        }


        vm.addtoBatch = function(quizId)
        {

            var idx = $scope.$parent.base.getIndex(vm.eligQuiz, 'id', quizId);
            var targetItem = vm.eligQuiz[idx];
            vm.batchQuizList.push(targetItem);
            vm.calcMinMax();

        /*
        get the index of the item copy from that index and push that to the added list array
        */

        };


        vm.unlinkQuizFromBatch = function(quizId)
        {

            var idx = $scope.$parent.base.getIndex(vm.batchQuizList, 'id', quizId);
            vm.batchQuizList.splice(idx, 1); 
            vm.calcMinMax();

        };


        vm.hasItemAdded = function(quizId)
        {

            var idx = $scope.$parent.base.getIndex(vm.batchQuizList, 'id', quizId);

            if(idx == -1)
            {
                return false;
            }

            return true;

        };


        vm.calcMinMax = function()
        {

            var max = 0;
            var min = 0;

            for(var key in vm.batchQuizList)
                {
                    if(vm.batchQuizList.hasOwnProperty(key))
                    {

                       max += parseInt(vm.batchQuizList[key].maxScore);
                       min += parseInt(vm.batchQuizList[key].minScore);

                    }
                }

                vm.nb.minScore = min;
                vm.nb.maxScore = max;

        };



        vm.addBatchProcess = function()
        {


            /*
                what I need
                object containng the master details
                array of quizId that are in the batch
            */

            function sanitzieQuizIds()
            {

                var quizIds = [];

                for(var key in vm.batchQuizList)
                {
                    if(vm.batchQuizList.hasOwnProperty(key))
                    {

                       quizIds.push(vm.batchQuizList[key].id);
                       
                    }
                }

                return quizIds;

            }

            var newBatch = {

                title: vm.nb.title,
                maxScore : vm.nb.maxScore,
                passingScore: vm.nb.minScore,
                quizIds : sanitzieQuizIds()

            };

            console.log(newBatch);



            $http({

                method: 'POST',
                url : API_URL+'batches',
                data: newBatch 

            }).then(

                function(res)
                {
                    
                    vm.revealQuizList = false;
                    vm.addBatch = false;

                    vm.nb = {};

                    vm.batchQuizList = [];

                    vm.nb.minScore = 0;
                    vm.nb.maxScore = 0;

                    

                    


                    if(vm.dataList == undefined)
                    {
                        vm.loadingStatus = true;

                        vm.dataList = {};

                        vm.dataList.batches = res.data.lastBatch;

                    }
                    else {


                        vm.dataList.batches.push(res.data.lastBatch[0]);

                    }



                }, 

                function(res)
                {
                    console.log(res);

                });

        };



        vm.activateProgress = function(itemId)
        {

            vm.activeBatchId = itemId;

            vm.addBatch = false;


            $http.get(API_URL+'batches/'+itemId).then(
            
            function(res){

                vm.showProgress = true;

                vm.progressData = res.data.batchProgress;
    
            }, 

            function(res){




            });    


        };



        vm.closeProgress = function()
        {
            vm.showProgress = false;
            vm.progressData = null;

            vm.activeBatchId = null;
        };


        vm.closeEnroll = function()
        {
          
            vm.showEnrollment = false;

            vm.activeBatchId = null;

        }


        vm.activateCanidateProgress = function(candiateId)
        {

            /*
                
                store current batchh progress for later back functionality 
                so we don't need to make another ajax request to the server
                make another ajax to the server to get the student progress
                then acitvate another view and hide this one
            */
            vm.lastBatchProgress = vm.progressData;

            $http.get(API_URL+'batches/candidate/overview/'+vm.activeBatchId+'/'+candiateId).then(

                function(res){

                  vm.candProgress =  res.data.batchCanidateOverview;

                  vm.candSummary = res.data.summary;     

                  vm.showProgress = false;

                  vm.revealCandProgress = true;

                }, 

                function(res){


                });

        };

        


        vm.activateDetails = function(batchId)
        {
         
            vm.activeBatchId = batchId;

            $http.get(API_URL+'batch/details/'+batchId).then(


                function(res){

                    vm.batchMasterDetails = res.data;
                    vm.showBatchDetails  = true;

                    console.log(res.data);

                    vm.proceedToX = false;

                }, 

                function(res){

                    var notify = {
                                type: 'error',
                                title: 'Not Found',
                                content: res.data.message,
                                timeout: 5000 //time in ms
                            };
                            
                            $scope.$emit('notify', notify);

                            vm.closeBatchDetails();



                });


        };

        


        vm.closeBatchDetails = function()
        {
            
            vm.activeBatchId = null;
            vm.showBatchDetails  = false;
            vm.proceedToX = false;

        };


    }]);

})();

(function() {

    angular.module('io2v3').controller('categoriesCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;

        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Categories";


        vm.ncat = {

            'name' : "",
            'pcat_id' : "Select Parent",
            'catLabel' : "Select Parent"

        }


        vm.selectedCategory = 'Parent';


        vm.newParentCategory = function(currentSelection)
        {

            console.log(currentSelection);

            if(currentSelection != 0 && currentSelection != 'Parent')
            {

                var idx = $scope.$parent.base.getIndex(vm.dataList, 'category', currentSelection);
                vm.ncat.pcat_id = vm.dataList[idx].id;
                vm.selectedCategory = vm.dataList[idx].category;
                console.log(vm.ncat.pcat_id);

            }

            else {
                vm.ncat.pcat_id = 'root';
                vm.selectedCategory = 'Parent';
            }
            

        };




        vm.loading = null;




        vm.deactivateAddNew = function()
        {
            
            vm.pageMode = 'list';

            vm.ncat = null;

        };


        console.log('working from categories controller');

        var url = API_URL+'cats';


        vm.fethList = function()
        {

            vm.loading = 'loading';

            $http({
            method: 'GET',
            url : url,
            cache: false
        })
        .then(function(res){

            
            vm.dataList = res.data.cats;


            vm.loading = true;


        }, function(res){

            if(res.status < 1)
            {
                vm.loading = false;
            }

            vm.loading = false;

            vm.dataList = false;

        });


        };


        vm.addNew = function()
        {


             


            var url =  API_URL+'cats';
            
            if(!parseInt(vm.ncat.pcat_id))
            {
               delete vm.ncat.pcat_id;
            }

            $http({
            method: 'POST',
            url : url,
            data : vm.ncat
            })
            .then(function(res){


                if(res.status == 200)
                {

                 vm.dataList.push(res.data.cat[0]);

                }

                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    vm.ncat.name = "";
                
                


            }, function(res){


                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                

            });

        };


        vm.edit = function(itemid)
        {
            
            console.log(itemid);

            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemid);

            vm.edata = vm.dataList[idx];

            vm.pageMode = 'edit';


            vm.updatePcatId = function(parentCat_Name)
            {

                if(parentCat_Name == 0)
                {
                    vm.edata.pcat_id = 0;
                    vm.edata.parent  = null;
                }

                else {
                    var catIndex = $scope.$parent.base.getIndex(vm.dataList, 'category', parentCat_Name);
                    parent_id = vm.dataList[catIndex].id;
                    vm.edata.pcat_id  = parent_id;

                }

            };

        }


        vm.udpateCategory = function()
        {
            
            if(vm.edata.parent == null || vm.edata.parent == 0)
            {
                var dataPayload = {
                    name : vm.edata.category,
                    pcat_id : 0
                };
            }
            else {

               var dataPayload = {
                   name : vm.edata.category,
                    pcat_id : vm.edata.pcat_id
                };
                
            }

            console.log(dataPayload);


            function udpateSuccess(res)
            {

                console.log(res.data);

                vm.pageMode = 'list';

                vm.edata = {};


                var notify = {
                    type: 'success',
                    title: 'Category Updated',
                    content: res.data.message,
                    timeout: 3000 //time in ms
                };
                $scope.$emit('notify', notify);


                // update the row

                var id = res.data.cat.id;
                var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', id);

                vm.dataList[idx] = res.data.cat;

            }

            function updateError(res)
            {

             var notify = {
                    type: 'error',
                    title: 'Operation Failed',
                    content: res.data.message,
                    timeout: 3000 //time in ms
                };
                $scope.$emit('notify', notify);

            }

            var id = vm.edata.id;
            var url = API_URL+'cat/'+id;

            $http({

                url : url,
                method: 'PUT',
                data: dataPayload

            }).then(udpateSuccess, updateError);

        };



        vm.checkvalue = function()
        {

            console.log(typeof(vm.edata.pcat_id));

        };


        vm.update = function(itemId)
        {
            
            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);
            console.log(vm.edata);

        }


        vm.remove = function(itemId)
        {

            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);
            console.log(idx);

            var url = API_URL+'cat/'+itemId;


            $http({
            method: 'DELETE',
            url : url,
            })
            .then(function(res){

                vm.dataList.splice(idx, 1);

                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            }, function(res){


                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            });



        };


        vm.fethList();

    }]);

})();

(function() {

    angular.module('io2v3').controller('catTreeCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;

        $scope.$parent.base.pageUrl = $state.current.url; 


        var treeUrl = API_URL+'cat-tree';

        $http.get(treeUrl).then(function(res){

        	vm.dataList = res.data.tree;

        });


    }]);

})();

(function(){
	angular.module('io2v3')

	.controller('dashboardCtrl', dashboardCtrl);

	function dashboardCtrl($scope, auth){
		var vm = this;
		vm.name = 'salman ahmed';
		console.log('dashboard abract controller is activated');
		$scope.pageHeading = "";

	}

	dashboardCtrl.$inject = ['$scope', 'auth'];

})();
(function() {

    angular.module('io2v3').controller('dashboardEntityCtrl', ['API_URL', 'SITE_URL', '$scope', '$http', '$state', 'auth', '$rootScope', function(API_URL, SITE_URL, $scope, $http, $state, auth, $rootScope){


        var vm = this;


        $scope.stage = 1;


       $scope.$parent.base.pageUrl = $state.current.url; 

       vm.loadingStatus = null;
       vm.hasWeekSchedule = false;
       $scope.currentactivity = false;

       vm.topPerformer = false;

       vm.hasRecentFinished = false;


        $http.get(API_URL+'dashboard').then(

        	function(res) {

        		if(res.data.logo != undefined)
        		{


        			$scope.$parent.base.updateDashboardLogo();

        		}


        		if(res.data.actvity != undefined && res.data.actvity.length != 0)
        		{
        		
        			$scope.activeCandidates = res.data.actvity;
        			$scope.currentactivity = true;


        		}

        		if(res.data.weekSchedule != undefined)
        		{
        			vm.hasWeekSchedule = true;
        			vm.weekSchedule = res.data.weekSchedule;		
        		}

        		if(res.data.recentFinished != undefined || res.data.recentFinished != false)
        		{
        			vm.hasRecentFinished = true;

        			vm.recentFinished = res.data.recentFinished;
        		}

        		if(res.data.topPerformer != undefined || res.data.topPerformer != false)
        		{
        			vm.topPerformer = true;

        			vm.topScorerList = res.data.topPerformer;
        		}


        		


        	}, function(res) {

        		$scope.currentactivity = false;

        	});



        /*
        
        API	/dasboard/activity?


        */


		setTimeout(function() {

			if($rootScope.pooling == undefined || $rootScope.pooling.statusText == 'abort')
			{
				vm.getContent(null);

				console.log('run when null assinged');
			}

		});

        
        vm.getContent = function(timestamp)
		{
		    var queryString = {'timestamp' : timestamp || null};

		$rootScope.pooling =  $.ajax(
		        {
		            type: 'GET',
		            url: API_URL+'dasboard/activity',
		            data: queryString,
		            headers: {
		            	'token' : localStorage.auth_token
		            },
		            success: function(res){
		                // put result data into "obj"

		              //  console.log(res);

		                if(res.activity)
		                {
		                	$scope.currentactivity = true;

		                	$scope.activeCandidates = res.activity;	

		                	console.log($scope.activeCandidates);


		                	
        			$("#actIndicator").addClass('wobble').removeClass('c-blue');
        			
        			setTimeout(function() {
        				
        				

        				$("#actIndicator").removeClass('wobble').addClass('c-blue');
					

        			}, 1000);


		                	
		                }

		                else {

		                	$scope.currentactivity = false;

		                }

		                

		                vm.getContent(res.timestamp);

		                $scope.$apply();
		                
		            }
		        }
		    );
		};



		vm.getContent(null);


  		var randomScalingFactor = function() {
			return Math.round(Math.random() * 100);
		};


						window.chartColors = {
			red: 'rgb(255, 99, 132)',
			orange: 'rgb(255, 159, 64)',
			yellow: 'rgb(255, 205, 86)',
			green: 'rgb(75, 192, 192)',
			blue: 'rgb(54, 162, 235)',
			purple: 'rgb(153, 102, 255)',
			grey: 'rgb(201, 203, 207)'
				};


		var config = {
			type: 'doughnut',
			data: {
				datasets: [{
					data: [
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
						randomScalingFactor(),
					],
					backgroundColor: [
						window.chartColors.red,
						window.chartColors.orange,
						window.chartColors.yellow,
						window.chartColors.green,
						window.chartColors.blue,
					],
					label: 'Dataset 1'
				}],
				labels: [
					'Terminated',
					'Failed',
					'In progress',
					'Passed',
					'High Performant'
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio : true,
				legend: {
					position: 'left',
				},
				title: {
					display: true,
					text: ''
				},
				animation: {
					animateScale: true,
					animateRotate: true
				}
			}
		};
		

		var ctx = document.getElementById('myChart').getContext('2d');

		ctx.canvas.parentNode.style.height = '240px';
		ctx.canvas.parentNode.style.width = '420px';


		var myDoughnutChart = new Chart(ctx, config);




		vm.clearActivity = function(attemptId)
		{

			
			var requestSuccess = function(res)
            {

                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    var idx = $scope.$parent.base.getIndex($scope.activeCandidates, 'attemptID', attemptId);
               
                	$scope.activeCandidates.splice(idx, 1);

                	if($scope.activeCandidates.length == 0)
                	{

                		$scope.currentactivity = false;

                	}




            };


            var requestError = function(res)
            {

                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);






            };


            $http({
                url : API_URL+'dashboard/markactivityinactive/'+attemptId,
                method : 'PUT',
                data : {'payload' : 'empty'}
            }).then(requestSuccess, requestError); 


		};


    }]);

})();

(function() {

    angular.module('io2v3').controller('dashLandCtrl', ['API_URL', '$scope', '$http', '$state', 'auth', function(API_URL, $scope, $http, $state, auth){


        var vm = this;


       //  $state.go('dash.admindashboard');

       $scope.$parent.base.pageUrl = $state.current.url; 


       $scope.$parent.dash.pageHeading = "Main";

       if(auth.isLoggedIn())
       {

			   var authenticatedUser = auth.getUser();     		
			   UserRole = authenticatedUser.role;


       		if(UserRole == 'admin')
       		{
				    $state.go('dash.admindashboard');
       		}

       		else if (UserRole == 'entity')
       		{

            if(authenticatedUser.profileLogo)
            {
              $state.go('dash.entityDashbaord');  
            }

            else {

              console.log(authenticatedUser);

             $state.go('dash.profile');

            }

       			
       		}

       		else if (UserRole == 'contributor')
       		{
       			// create a dashbaord for contributor

            $state.go('dash.contributorDashbaord');

       		}

       		else if (UserRole == 'content developer')
       		{
       			// create a dashboard for content developer

            $state.go('dash.contDevDashbaord');
       		}

          else if (UserRole == 'students' || UserRole == 'candidate')
          {
            
              $state.go('std.studentDashbaord');

          }

          else if (UserRole == 'proctor' || UserRole == 'invigilator')
          {
            
              $state.go('mob.activity');

              

          }

          

       		else {

       			// if there no role specified then route to the logout

       		}

       }


       $scope.$parent.base.pageUrl = $state.current.url; 


        vm.loadingStatus = null;
  		

    }]);

})();

(function() {

    angular.module('io2v3').controller('dashProfileCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$state', function(API_URL, $scope, $http, $stateParams, $state){


        var vm = this;


        vm.token = localStorage.getItem('auth_token');


        vm.slugValidity = null;

        


        $scope.$parent.base.pageUrl = $state.current.url; 
        $scope.$parent.dash.pageHeading = "Profile";


        vm.uploadUrl = API_URL+'profile/logo';

        $scope.dropzoneConfig = {
            'options': { 
              'url': vm.uploadUrl,
              'multiple' : false,
              'maxFiles' : 1,
              'thumbnailWidth': null,
              'thumbnailHeight': null,
              
              'acceptedFiles': ".pdf,.png,.jpg,.gif,.bmp,.jpeg",
              'dictDefaultMessage': 'Drag or upload logo image here',
              headers: {"token": vm.token}
            },
            'eventHandlers': {
              'sending': function (file, xhr, formData) {

                console.log(xhr);

              },
              'success': function (file, response) {

                  console.log('file is sent');

                  

                  


              }
            }
        };

        

        vm.loadingStatus = null;


        vm.profileData = false;


        vm.slugify = function(string) {
          const a = 'àáäâãåăæąçćčđďèéěėëêęǵḧìíïîįłḿǹńňñòóöôœøṕŕřßśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
          const b = 'aaaaaaaaacccddeeeeeeeghiiiiilmnnnnooooooprrssssttuuuuuuuuuwxyyzzz------'
          const p = new RegExp(a.split('').join('|'), 'g')

          return string.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
            .replace(/&/g, '-and-') // Replace & with 'and'
            .replace(/[^\w\-]+/g, '') // Remove all non-word characters
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
        }



        vm.sayHello  = function(brandTtext)
        {


        		slug = vm.slugify(brandTtext);
	        	vm.profileData.slug = slug;	
                vm.slugAvailable(slug);

        };



        vm.getProfile = function()
        {


        	var profileUrl = API_URL+'profile';

        	$http.get(profileUrl).then(

        		function(res) {

        			if(res.data.status == true)
        			{
        				
        				vm.loadingStatus = true;
        				vm.profileData = res.data.profile[0];

                        vm.logoUrl = API_URL+vm.profileData.logo;


        			}

        			else {

        				vm.loadingStatus = false;

        			}


        		}, 

        		function(res){

        			vm.loadingStatus = false;

        		})

        };



        vm.getProfile();


        vm.saveProfile = function()
        {
        	

             $http({

                url : API_URL+'profile',
                method : 'POST',
                data : vm.profileData
            }).then(

            function(res) {

            }, 

            function(res){

            })


        };



        vm.updateProfile = function()
        {


            
            $http({

                url : API_URL+'profile',
                method : 'PUT',
                data : vm.profileData
            }).then(

            function(res) {

            }, 

            function(res){

            })

        };



        vm.slugAvailable = function(slug)
        {

            


            var successSlugCheck = function(res, status, xhr)
            {
                vm.slugValidity = true;
            };

            var errorSlugCheck = function(res, status, xhr)
            {



                if(res.status == 406)
                {

                    vm.slugValidity = false;

                    
                    
                    vm.slugValidity = false;

                    var notify = {
                        type: 'error',
                        title: 'Critical Error',
                        content: res.responseJSON.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                }

            };

            var slugurl = API_URL+'profile/slugavailable';


            $.ajax({

                url : slugurl,
                method : 'POST',    
                data:  {'slug': slug}

            }).then(successSlugCheck, errorSlugCheck);



        };



    }]);

})();

(function() {

    angular.module('io2v3').controller('dashQuizzesCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;


        $scope.sortType = '$';
        vm.searchQuery = '';
        $scope.sortReverse  = false;



        vm.selectSortfield = function(fieldName)
        {

            $scope.sortType = fieldName;

        };


        vm.clearFilters = function()
        {

            $scope.sortType = '$';
            vm.searchQuery = '';
            $scope.sortReverse  = false;

        };

        vm.toggleSort = function()
        {

            $scope.sortReverse = !$scope.sortReverse;

        };



        vm.loadingStatus = null;

        $scope.$parent.base.pageUrl = $state.current.url; 



        $scope.$parent.dash.pageHeading = "Quizzes";


        vm.updateDateTimeModal = false;


        vm.deleteConfirmModal = false;




        vm.fetchQuiz = function()
        {

        	var url = API_URL+'quiz';

        	function success(res)
        	{
        		
                vm.dataList = res.data.quiz;
                vm.loadingStatus = true;    


        	}

        	function error(res)
        	{

        		vm.dataList = res.data.quiz;
                vm.loadingStatus = false;

        	}

        	$http({

        		url : url,
        		method : 'GET',
                cache: false

        	}).then(success, error);

        };


        vm.fetchQuiz();

        

        vm.toggleEnroll = function(itemId, value)
        {


            console.log('fired');
            
            var enrolltoggleUrl = API_URL+'quiz-enrollment-toggle/'+itemId;


            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);

            var row = vm.dataList[idx];


            $http({

                url : enrolltoggleUrl,
                method : 'PUT',
                data : {'enrollment' : value}

            }).then(successEnrollToggle, errorEnrollToggle);


            function successEnrollToggle(res)
            {
                console.log(res);

                var notify = {
                        type: 'success',
                        title: 'Enrollment',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            }

            function errorEnrollToggle(res)
            {
                
                var notify = {
                        type: 'error',
                        title: 'Enrollment',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    row.enrollment = !res.data.value;

            }

        };


        vm.statusToggle = function(itemId, value)
        {


            var statusToggleUrl = API_URL+'quiz-status-toggle/'+itemId;

            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);

            var row = vm.dataList[idx];


            $http({

                url : statusToggleUrl,
                method : 'PUT',
                data : {'status' : value}

            }).then(toggleSuccess, toggleError);


            function toggleSuccess(res)
            {


                var notifyType = (res.data.qstatus == 1) ? 'success' : 'warning';

                console.log('type'  + res.data.qstatus);


                var notify = {
                        type: notifyType,
                        title: 'Status',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);               

            }

            function toggleError(res)
            {



            }
            


        };



        vm.launchDateTimeModal = function(itemId)
        {


            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);
            vm.dateTimeModalData = vm.dataList[idx];


    

            /*
                get the object of the quiz by id
           */


            vm.updateDateTimeModal = true;

        };

        vm.closeDateTimeModal = function()
        {

          vm.dateTimeModalData = null;
          vm.updateDateTimeModal = false;



        };


        vm.udpateQuizdateTime = function()
        {

            var itemId = vm.dateTimeModalData.id;

            var newStartDate = document.getElementById('adate'+vm.dateTimeModalData.id).value;           
            var newEndDate = document.getElementById('edate'+vm.dateTimeModalData.id).value;
            
            /*
            vm.dateTimeModalData.startDateTime = newStartDate;
            vm.dateTimeModalData.endDateTime = newEndDate;
            */


            var dateRangeCheck = vm.checkDates(newStartDate, newEndDate);

            if(dateRangeCheck.status == true)
            {
                
                
                console.log('procceed');


                


                $http({

                    url : API_URL+'quiz-update-datetime/'+itemId,
                    method : 'PUT',
                    data : {
                        startDateTime: newStartDate,
                        endDateTime : newEndDate
                    }

                }).then(
                    function(res){


                        vm.dateTimeModalData.startDateTime = newStartDate;
                        vm.dateTimeModalData.endDateTime = newEndDate;




                        vm.closeDateTimeModal();


                        var notify = {
                        type: 'success',
                        title: 'Operation Successful',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                        $scope.$emit('notify', notify);   

                    },


                    function(res){


                        var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);   



                    });




            }

            else {

                var notify = {
                        type: 'error',
                        title: 'Invalid Date Range',
                        content: dateRangeCheck.error,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);     

            }




        };



        vm.checkDates = function(startDateTime, endDateTime)
        {       

            
            var currentDateTime = new Date().toJSON().slice(0, 19).replace('T', ' ');
            vm.dateVerified = null;
            vm.datesError = null;

            
            if(endDateTime <= startDateTime)
            {
                
                return {    
                    status : false,
                    error : 'End datetime must be greater than start datetime'
                }

            }

            else {

                return {    
                    status : true,
                    error : null
                }

                
            }



        };



        vm.launchDeleteConfirmation = function(itemId)
        {

            
            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);
            vm.deleteModalItem = vm.dataList[idx];

            vm.deleteConfirmModal = true;

            console.log(itemId);

        };


        vm.dissmissDeleteModal = function()
        {

            vm.deleteModalItem.proceedToX = false;

            vm.deleteModalItem = null;
            
            vm.deleteConfirmModal = false;

        };


        vm.removeQuiz = function()
        {


            var id = vm.deleteModalItem.id;


            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', id);

            var Quiztitle = vm.deleteModalItem.title;



            $http.delete(API_URL+'quiz/'+id).then(

                function(res) {


                    vm.dissmissDeleteModal();

                    vm.dataList.splice(idx, 1);


                    var notify = {
                        type: 'success',
                        title: 'Operation Successful',
                        content: Quiztitle+' '+res.data.message,
                        timeout: 5000 //time in ms
                    };

                    $scope.$emit('notify', notify);  



                }, 

                function(res) {


                    var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    vm.dissmissDeleteModal();  

            });



        };




        
        
        

        


    }]);

})();

(function() {

    angular.module('io2v3').controller('enrollCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        vm.examID = $stateParams.examID;

        $scope.$parent.absExamId = vm.examID;

        var enrollUrl = API_URL+'enroll/'+vm.examID;


        $scope.$parent.exAbs.pageHeading = "Enrollment";

        vm.interceptModal = false;


        vm.nenroll = {};


        vm.dataList;


        vm.sendInvitation = function(itemId)
        {

            console.log(itemId);

            var inviteUrl = API_URL+'sendinvitation/'+itemId;

            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);

            vm.dataList[idx].invited = 1;


            $http({

                url : inviteUrl,
                method : 'POST',
                data : {}
            }).then(

            function(res){


                var notify = {
                        type: 'info',
                        title: 'Invitation',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    
                    $scope.$emit('notify', notify);

            }, 
            function(res){


                var notify = {
                        type: 'error',
                        title: 'Invitation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            });



        }



        function successEnroll(res)
        {
            
            if(res.data.status == true)
            {
                vm.dataList = res.data.enroll;
            }

        }

        function errorEnroll(res)
        {

            console.log(res);

            vm.dataList = false;
        }


        $http.get(enrollUrl).then(successEnroll, errorEnroll);


        vm.quizEnroll = function()
        {
            var newEnrollUrl = API_URL+'enroll';

            vm.nenroll.quiz_id = vm.examID;


            function successEnrollSave(res)
            {

              if(vm.dataList == undefined || vm.dataList == false)
              {
                    
                    vm.dataList = res.data.lastEnroll;     
              }

              else {

                vm.dataList.push(res.data.lastEnroll[0]);
              }

              vm.nenroll = {};

            }

            function errorEnrollSave(res)
            {
                var notify = {
                        type: 'error',
                        title: 'Enrollment Error',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);
            }

            $http({

            url : newEnrollUrl,
            method : 'POST',
            data : vm.nenroll
            }).then(successEnrollSave, errorEnrollSave);

        };



        vm.toggleRetake = function(itemId)
        {

            var Idx = parseInt($scope.$parent.base.getIndex(vm.dataList, 'id', itemId));
            var retake = vm.dataList[Idx].retake;

            $http({
                url : API_URL+'enroll/retake/'+itemId,
                method : 'PUT',
                data : {retake : retake}
            }).then(
                
                function(res)
                {

                    
                    var notifyType = (res.data.value == 1) ? "success" : "warning";



                    var notify = {
                        type: notifyType,
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                }, 

                function(res){

                    vm.dataList[Idx].retake = (vm.dataList[Idx].retake == 1)  ? "0" : "1";

                    var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                })



        };


        vm.updateScheduleDateTime = function(itemId, quizid, scheduleDateTime)
        {


            var Idx = parseInt($scope.$parent.base.getIndex(vm.dataList, 'id', itemId));
            
            var mewDatetime = document.getElementById('adate'+itemId).value;
            
            
            $http({

                url : API_URL+'enroll/schedule-datetime/'+itemId+'/'+quizid,
                method : 'PUT',
                data : {dtsScheduled: mewDatetime}

            }).then(
            function(res){



                var notify = {
                        type: 'success',
                        title: 'Reschedule Success',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                

            }, 

            function(res){


                    var notify = {
                        type: 'error',
                        title: 'Reschedule Failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                

            });


        };


        vm.removeEnroll = function(itemId)
        {

            
            

            var removeSuccess = function(res)
            {

                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);

                
                vm.dataList.splice(idx, 1);
            

            };


            var removeError = function(res)
            {


                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            };


            $http.delete(API_URL+'enroll/'+itemId).then(removeSuccess, removeError);



        };



        

        vm.resetEnroll = function(itemid)
        {


            var resetSuccess = function(res)
            {

                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            };


            var resetError = function(res)
            {

                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            };



            $http({
                url : API_URL+'enroll-reset/'+itemid,
                method : 'PUT',
                data : {'payload' : 'empty'}
            }).then(resetSuccess, resetError); 


        };


        vm.activateIntercept = function(itemId)
        {          

            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);
            vm.interceptItem =  vm.dataList[idx];
            vm.interceptModal = true;

        };


        vm.deactivateintercept = function()
        {

            vm.interceptItem = null;
            vm.interceptModal = false;

        };


        vm.udpateIntercept = function(enrollId)
        {

            vm.updatePayload = {

                intercept: vm.interceptItem.intercept,
                direction: vm.interceptItem.direction,
                lastLimit : vm.interceptItem.lastLimit

            };

            var successIntercept = function(res) 
            {

                var notify = {
                        type: 'info',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    
                    $scope.$emit('notify', notify);

                    vm.deactivateintercept();


            };

            var errorIntercept = function(res)
            {

                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    
                    $scope.$emit('notify', notify);


            };

        
            $http({

                url : API_URL+'intercept/'+enrollId+'/'+vm.interceptItem.quiz_id,
                method: 'PUT',
                data : vm.updatePayload

            }).then(successIntercept, errorIntercept);    

        };






    }]);

})();

(function() {

    angular.module('io2v3').controller('examMgmtAbstractCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;
        $scope.absExamId = null;
        $scope.masterQuizData = null;


        $scope.pageHeading = "";


        console.log('exam abstract is activated');

        $scope.$parent.base.updateDashboardLogo();


    }]);

})();

(function() {

    angular.module('io2v3').controller('examOverviewCtrl', ['API_URL', '$scope', '$http', '$stateParams', 'quizDataService', function(API_URL, $scope, $http, $stateParams, quizDataService){


        var vm = this;

        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = $stateParams.examID;


        $scope.$parent.exAbs.pageHeading = "Overview Details";


        vm.loadProgress = null;




        quizDataService.getMasterQuiz(vm.examID).then(

	    	function(res){

	    		console.log(res);

	    		vm.Quiz = res.data.quiz[0];
	    		vm.Distro = res.data.quizBaseDistro;


	    	}, 

	    	function(res){

	    		console.log(res);
  	    		vm.loadProgress = false;

	        });


        vm.toggleEnroll = function(itemId, value)
        {


            console.log('fired');
            
            var enrolltoggleUrl = API_URL+'quiz-enrollment-toggle/'+itemId;



            $http({

                url : enrolltoggleUrl,
                method : 'PUT',
                data : {'enrollment' : value}

            }).then(successEnrollToggle, errorEnrollToggle);


            function successEnrollToggle(res)
            {
                

                var notify = {
                        type: 'success',
                        title: 'Enrollment',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            }

            function errorEnrollToggle(res)
            {
                
                var notify = {
                        type: 'error',
                        title: 'Enrollment',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    vm.Quiz.enrollment = !res.data.value;




            }

        };



        vm.optionsToggle = function(typeKey, quizId, statusValue)
        {


            var optionToggleUrl = API_URL+'quiz-option-toggle/'+quizId;


            var dataPayload = {typeKey :  typeKey, statusValue :  statusValue};

            var successOptiontoggle = function(res)
            {

            };


            var errorOptiontoggle = function(res)
            {
                if(typeKey == 'dls')
                {
                    
                    vm.Quiz.dls = 0;

                    var notify = {
                        type: 'error',
                        title: 'DLS OPeration failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                }
            };

            
             $http({

                    url : optionToggleUrl,
                    method : 'PUT',
                    data : dataPayload

                }).then(successOptiontoggle, errorOptiontoggle);


        };



		
        

    }]);

})();

(function() {

    angular.module('io2v3').controller('examRefreshedCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;


        vm.countdown = 0;


        	setTimeout(function($window) {


        		window.close();

        		

        	}, 3000);




    }]);

})();

(function() {

    angular.module('io2v3').controller('forgetCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$state', function(API_URL, $scope, $http, $stateParams, $state){


        var vm = this;


        console.log('forget ctrl is actvitated');



        vm.sendRecover = function()
        {

        	var recoverSuccess = function(res){


                var notify = {
                        type: 'info',
                        title: 'Successful',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);



        	};
        	var recoverError = function(res){


                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

        	};


        	$http({

        		url : API_URL+'residue',
        		method : 'POST',
        		data : {'email' : vm.email}

        	}).then(recoverSuccess, recoverError);


        };

       

    }]);

})();

(function(){

	angular.module('io2v3')
	.controller('homeCtrl',	['$state', function($state) {
		var vm = this;

		
	}]);



})();
(function() {

    angular.module('io2v3').controller('invitedAbstractCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$state', function(API_URL, $scope, $http, $stateParams, $state){

        var vm = this;

        console.log('invited abstract is activated');


        vm.message = "hello world";

        vm.pageHeading = "Invitation"


        vm.brandLogo = 'assets/images/iSkillMetrics-logo.svg';
        


    }]);

})();

(function() {

    angular.module('io2v3').controller('invitedbyentityCtrl', ['API_URL', 'SITE_URL', '$scope', '$http', '$stateParams', '$state', '$rootScope', function(API_URL, SITE_URL, $scope, $http, $stateParams, $state, $rootScope){

        var vm = this;


        vm.quizModal = false;
        vm.hasQuizEnrolled = null;
        vm.hasPendingQuiz = false;
        vm.hasAttemptedQuiz = false;
        vm.isInitiatStart = false;



        vm.entityProfileStatus = null;

        vm.decodedUriObj = false;


        vm.interceptRedirect = false;


        localStorage.removeItem('lastStoredDurationSeconds');


        if($stateParams.entityslug == undefined || $stateParams.entityslug == "" || $stateParams.invitetoken == undefined)
        {

       		vm.interceptRedirect = true;

        }

        vm.entityslug = $stateParams.entityslug;

        var encodedString = $stateParams.invitetoken;
       	

        var decodedUriObj = $scope.$parent.base.decodeUrlToken(encodedString);


        if(typeof(decodedUriObj) == "object")
        {

            vm.decodedUriObj = decodedUriObj;

        }

        else {
            vm.interceptRedirect = true;
        }


        console.log(decodedUriObj);


        vm.fetchEntityProfile = function()
        {

        	var profileUrl = API_URL+'profile/entity-by-slug/'+vm.entityslug;

        	$http.get(profileUrl).then(

        		function(res) {

        			vm.entityProfileStatus = true;

                    vm.profileData = res.data.profile[0];

                    var logo = vm.profileData.logo;
                    var logoUrl = API_URL+'/'+logo;

                  
                    $scope.$parent.vm.brandLogo = logoUrl;

                    

        		}).then(function(res) {

        		/*			
				    throw it out because entity profile did not matched;
        		*/		

        		vm.entityProfileStatus = false;

        		});



        };	


        vm.fetchEntityProfile();



        vm.getInvitedQuizList = function()
        {


            successFetchQuizList = function(res)
            {
            
            if(res.data.quiz != 0)
            {               
                vm.hasQuizEnrolled = true;
                vm.hasPendingQuiz = true;

            }

            if (res.data.attempted != 0)
            {
                vm.hasAttemptedQuiz = true;
                vm.hasQuizEnrolled = true;
            }

            if (res.data.quiz == 0 && res.data.attempted == 0){

                vm.hasQuizEnrolled = false; 

            }

            vm.dataList = res.data;

            };


            errorFetchQuizList = function(res)
            {           

            if(res.data.quiz == 0 && res.data.attempted == 0)
            {
                vm.hasQuizEnrolled = false;    
            }

            };
            
            var enroll_id = vm.decodedUriObj.enroll_id;
            
            $http.get(API_URL+'invitation-quizzes/'+enroll_id)
            .then(successFetchQuizList, errorFetchQuizList);

        };


        vm.getInvitedQuizList();


        vm.initiateQuiz = function(enroll_id)
        {
          
            vm.isInitiatStart = true;
            /*
            var popup = window.open("http://localhost:8000/quiz-assement/177/24", "myPopup", 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=1000,height=800')
            */

            $http({
                url : API_URL+'std-quiz-initiate',
                method : 'POST',
                data : {'enroll_id' : enroll_id}
            }).then(function(res){

                
                var resData = res.data;


                if(resData.usedXTimes != 0)
                {

                    vm.quizModal = false;

                    var notify = {
                        type: 'error',
                        title: 'Error',
                        content: resData.warning_message,
                        timeout: 8000 //time in ms
                    };

                    $scope.$emit('notify', notify);
                    return false;

                }


                else if(resData.type == 'static')
                {
                    var attempt_id = res.data.attempt_id;
                    var stateargs = {'attempt_id' : attempt_id, 'quiz_id': vm.actQuiz.id};

                    var popupUrl = SITE_URL+'quiz-assement/'+attempt_id+'/'+vm.actQuiz.id;

                    vm.quizModal = false;
                    vm.isInitiatStart = false;

                    vm.actQuiz.validity = "progress";



                    window.open(popupUrl, "Quiz", 

                        'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=0,fullscreen=yes,width='+screen.availWidth+',height='+
                        screen.availHeight 
                        );

                 //   $state.go('quizPlay', stateargs);


                }

                else if (resData.type == 'dls')
                {

                                        
                    

                    var attempt_id = res.data.attempt_id;
                    var stateargs = {'attempt_id' : attempt_id, 'quiz_id': vm.actQuiz.id};


                    dlsPopupUrl = SITE_URL+'/quiz-assessment/dls/'+attempt_id+'/'+vm.actQuiz.id;



                    vm.quizModal = false;
                    vm.isInitiatStart = false;

                    vm.actQuiz.validity = "progress";


                    window.open(dlsPopupUrl, "Quiz", 

                        'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=0,fullscreen=yes,width='+screen.availWidth+',height='+
                        screen.availHeight 
                        );                        


                    // $state.go('quizPlayDLS', stateargs);

                    

                }

                else {

                    console.log('quiz type is unknown');

                }
                

            },
            function(res){

                console.log(res);

            });

        };



          vm.launchQuizModal = function(quizId, reattempt = false)
        {

            

            if(!reattempt)
            {
                var idx = $scope.$parent.base.getIndex(vm.dataList.quiz, 'id', quizId);
                vm.actQuiz = vm.dataList.quiz[idx];    
            }
            else {
                var idx = $scope.$parent.base.getIndex(vm.dataList.attempted, 'id', quizId);
                vm.actQuiz = vm.dataList.attempted[idx];
            }

            vm.quizModal = true;
            
        };



        vm.showCountdown = function(quizId, dtEnrolled, dtsScheduled)
        {



        var enrolledDT =  new Date(dtEnrolled).getTime();    
        var scheduleDT = new Date(dtsScheduled).getTime();
        var currentDT = new Date().getTime();

        if(scheduleDT > currentDT)
        {

            console.log('work for countdown');


                var inc = 1;
            

            var countdownHandle = $interval(function(){


            var now = new Date().getTime();

            var distance = scheduleDT - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);


            if(distance <= 0)
            {
                
                $interval.cancel(countdownHandle);
                var idx = $scope.$parent.base.getIndex(vm.dataList.quiz, 'id', quizId);
                vm.dataList.quiz[idx].schedule = 'eligible';

            }

            

                if(days == 0 && hours == 0)
                {
                    $scope.counter[quizId] = minutes + " mins " + seconds + " secs ";
                }

               else {

                    $scope.counter[quizId] = days + " DD " + hours + " HH "
                + minutes + " mm " + seconds + " ss ";

                }

                console.log(distance);

            },1000);



        }


            
        };



         vm.updateOnFinish = function(timestamp)
        {
            var queryString = {'timestamp' : timestamp || null};

          $rootScope.studenExamListPooling =  $.ajax(
                {
                    type: 'GET',
                    url: API_URL+'std-quiz-polling',
                    data: queryString,
                    headers: {
                        'token' : localStorage.auth_token
                    },
                    success: function(res){
                        

                        if(res.timestamp > 0)
                        {
                            
                            vm.poolCounter += 1;
                            
                        }


                        if(vm.poolCounter > 1)
                        {
                           
                           
                           vm.getInvitedQuizList();


                           console.log(res);




                        }

                        

                        $scope.$apply();
                       
                        vm.updateOnFinish(res.timestamp);

                        

                    }
                }
            );
        };


        vm.updateOnFinish(null);












    }]);

})();

(function() {

    angular.module('io2v3').controller('libraryCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$state', function(API_URL, $scope, $http, $stateParams, $state){


        var vm = this;


        vm.loadingStatus = null;

        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Media Libraray";


        vm.myFormData = {

            category_id : 'Select Category'

        };



        vm.sendFile = function()
        {

            var file = $scope.photo;
            var uploadUrl = API_URL+'media';

            var form_data = new FormData();
            angular.forEach(file, function(file){
                form_data.append('file', file);
            });


            var formpostdata = vm.myFormData;

            for (var key in formpostdata) {
                form_data.append(key, formpostdata[key]);
            }

            $http.post(uploadUrl, form_data,
                {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined, 'Process-Data': false}
            }).then(
            function(res){

                console.log(res);
                var lastItem = res.data.lastItem[0];
                vm.dataList.push(lastItem);


            }, 

            function(res){


                var notify = {
                        type: 'error',
                        title: 'Error',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                
            });

        };


        vm.fetchMediaList = function()
        {

            $http.get(API_URL+'media', {cache: false}).then(
            function(res) {

                vm.loadingStatus = true;

                vm.dataList = res.data.media;


            }, 
            function(res)
            {

                vm.loadingStatus = false;



            });

        };


        vm.fetchCategoryFlatRoot = function()
        {

            $http.get(API_URL+'category-flat-root', {cache: true}).then(

            function(res) {
                vm.loadingStatus = true;
                vm.categoryList = res.data.categories;
            }, 
            function(res)
            {

                vm.loadingStatus = false;


            });


        };


        vm.fetchMediaList();

        vm.fetchCategoryFlatRoot();


    }]);

})();

(function(){
	angular.module('io2v3')

	.controller('loginCtrl',['$state', 'auth', 'API_URL', '$scope', '$stateParams', function ($state, auth, API_URL, $scope, $stateParams){

		auth.clearAllhttpCache();

		var vm = this;

		vm.loginStatus = null;
		vm.wrongCreds = null;

		vm.actionTokenObj = null;

		vm.interceptDefaultRedirect = false;



		if($stateParams.actiontoken != undefined)
		{

		
			var decodedUriObj = $scope.$parent.base.decodeUrlToken($stateParams.actiontoken);


			if(typeof(decodedUriObj) == "object")
			{
				vm.actionTokenObj = decodedUriObj;	
				vm.interceptDefaultRedirect = true;
			}


		}



		vm.handleRedirect = function()
		{

			if(!localStorage.getItem('auth_token'))
			{			
				return false;
			}



			if(!vm.interceptDefaultRedirect)
			{
				$state.go('dash.land');
			}

			else if(vm.actionTokenObj.action == 'quizInvitation') {

				$state.go('inv.invited', {'entityslug': vm.actionTokenObj.entitySlug, 'invitetoken': $stateParams.actiontoken});
			}

			else {

				$state.go('dash.land');

			}


		};




		vm.handleRedirect();

		
		vm.login = function() 
		{		
			 var promise  = auth.login(vm.creds);
			 promise.then(success, error);

		};


		var success = function(response){
			

			vm.loginStatus = true;
			vm.wrongCreds = false;

			// console.log(response.data.token[0].token);


			

            var auth_token = null;

			if(response.data.token != undefined)
			{
				auth_token = response.data.token;
                localStorage.setItem('auth_token', auth_token);
                var user = response.data.user;

                var hdAuthUser = JSON.stringify(user);

                // btoa() encode
                // atob() decode

                hdAuthUser = btoa(hdAuthUser);
                localStorage.setItem('hdauEn', hdAuthUser);

				
				auth.getUser();


				vm.handleRedirect();


			}

			var AuthUser = auth.getUser();
			

		};
		var error = function(response){
			console.log('error ran');

			vm.loginStatus = false;
			vm.wrongCreds = true;

			 var notify = {
                        type: 'error',
                        title: 'Error Heading',
                        content: response.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);
		};

	}]);



})();
(function(){
	angular.module('io2v3')

	.controller('logoutCtrl', ['$state', '$timeout', 'auth', function ($state, $timeout, auth, $cacheFactory){
		
		var vm = this;



		auth.clearAllhttpCache();


		localStorage.removeItem('auth_token');
       	localStorage.removeItem('hdauEn');	
		$state.go('ua.login');



	}]);



})();
(function() {

    angular.module('io2v3').controller('messageCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        const channel = new BroadcastChannel('sw-idxsaved');

        vm.message = {};



        console.log($stateParams);



        vm.loadMaster = function()
        {


          
          $http.get(API_URL+'masterdatalist').then(function(res) {}, function(res){});




        };






        vm.handleMessagePost = function()
        {

        /*
      	var url = API_URL+"message";       
        */

        var liveUrl = 'https://api.iskillmetrics.com/message';
        var url = liveUrl;

        vm.idbPayload = {
          "url" : url,
          "method": 'POST',
          "data" : vm.message
        };

          vm.triggerBackgroundSync = function()
          {
              
              var swPost = {
                 'form_data': vm.idbPayload
              };

      
              navigator.serviceWorker.controller.postMessage(swPost);


            channel.addEventListener('message', event => {

              if(event.data.status == 1 && window.cachedRegisterSW != undefined)
              {
                 window.cachedRegisterSW.sync.register('exam');
              }

            });
          };

        $http(vm.idbPayload).then(

        function(res){

        }, 

        function(res){
          if(res.status < 1){vm.triggerBackgroundSync()}
        });

        };

        


    }]);

})();

(function() {

    angular.module('io2v3').controller('mobileAbstractCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        console.log('mobileAbstractCtrl activated')

        vm.slideMenuActive = false;




        vm.toggleSlideMenu = function()
        {

        	vm.slideMenuActive = !vm.slideMenuActive;

        };



        


    }]);

})();

(function() {

    angular.module('io2v3').controller('mobileActivityCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$rootScope', function(API_URL, $scope, $http, $stateParams, $rootScope){


        var vm = this;

        $scope.currentactivity = false;


        console.log('mobile activity');


        setTimeout(function() {

			if($rootScope.pooling == undefined || $rootScope.pooling.statusText == 'abort')
			{
				vm.getContent(null);

				console.log('run when null assinged');
			}

		});


		vm.getContent = function(timestamp)
		{
		    var queryString = {'timestamp' : timestamp || null};

		$rootScope.pooling =  $.ajax(
		        {
		            type: 'GET',
		            url: API_URL+'dasboard/activity',
		            data: queryString,
		            headers: {
		            	'token' : localStorage.auth_token
		            },
		            success: function(res){
		                // put result data into "obj"

		              //  console.log(res);

		                if(res.activity)
		                {
		                	$scope.currentactivity = true;

		                	$scope.activeCandidates = res.activity;	

		                	console.log($scope.activeCandidates);


		                	
        			$("#actIndicator").addClass('wobble').removeClass('c-blue');
        			
        			setTimeout(function() {
        				
        				

        				$("#actIndicator").removeClass('wobble').addClass('c-blue');
					

        			}, 1000);


		                	
		                }

		                else {

		                	$scope.currentactivity = false;

		                }

		                

		                vm.getContent(res.timestamp);

		                $scope.$apply();
		                
		            }
		        }
		    );
		};



		vm.getContent(null);

        


    }]);

})();

(function(){

	angular.module('io2v3')
	.controller('modalCtrl', modalCtrl);




	

	modalCtrl.$inject = ['$state', '$scope', '$http'];

	function modalCtrl($state, $scope, $http)
	{
		var vm = this;

		vm.modalOpen = false;

		$scope.$parent.base.pageUrl = $state.current.url; 


		vm.triggetEmit = function(soundEventType)
		{

			var msg = 'this is triggered from modalCtrl and function is reponding from baseCtrl';

			$scope.$emit('playSound', { message: soundEventType });

		};




		vm.dataList = [
		{'id': '1', 'email': 'sa@isystematic.com'},
		{'id': '2', 'email': 'nk@isystematic.com'},
		{'id': '3', 'email': 'ak@isystematic.com'},
		{'id': '4', 'email': 'ua@isystematic.com'}
		];


		vm.launchModal = function(idx)
		{
			vm.modalId = idx;
			vm.modalOpen = true;
			vm.modalData = vm.dataList[idx];
			console.log(vm.modalData);
		}



		$http.get(API_URL+'test-enc-data').then(
		function(res){
			

			console.log(res.data.users);
			vm.encodedMessage = res.data.users;
			vm.decodedMessage = $scope.$parent.base.inboundDecode(vm.encodedMessage);


			console.log(vm.decodedMessage);



		}, 
		function(res){

		});





		vm.convertDates = function(dateInput)
		{

			var dt = new Date(dateInput);


			var offset = dt.getTimezoneOffset();

			if(offset > 0)
			{

				dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());

			}

			else {

				dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());

			}


			var year = dt.getFullYear();

			var month = (dt.getMonth() <= 9) ? '0'+dt.getMonth() : dt.getMonth();

			var day = (dt.getDate() <= 9) ? '0'+dt.getDate() : dt.getDate();

			var hour = (dt.getHours() <= 9 ) ? '0'+dt.getHours() : dt.getHours();

			var minutes = (dt.getMinutes() <=9) ? '0'+dt.getMinutes() : dt.getMinutes();

			var seconds = (dt.getSeconds() <= 9) ? '0'+dt.getSeconds() : dt.getSeconds();

			var dateString =  year+'-'+month+'-'+day +' '+hour+':'+minutes+':'+seconds;

			return dateString;

			

		};

	}


	
	
})();
(function() {

    angular.module('io2v3').controller('myusersCtrl', ['API_URL', '$scope', '$http', '$state', 'auth', function(API_URL, $scope, $http, $state, auth){


        var vm = this;


        $scope.sortType = '$';
        vm.searchQuery = '';
        $scope.sortReverse  = false;


        vm.dualColumn = false;


        vm.roleLabel = function(role)
        {

            if(role == 'students')
            {
                return 'Candidate';
            }
            else if(role == 'contributor')
            {
                return 'Test Developer';
            }

            else {
                return role;
            }

        };



        vm.selectSortfield = function(fieldName)
        {

            $scope.sortType = fieldName;

        };


        vm.clearFilters = function()
        {

            $scope.sortType = '$';
            vm.searchQuery = '';
            $scope.sortReverse  = false;

        };




        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Users";


        vm.loadingStatus = null;


        vm.forceCategoryBound = false;


        vm.modalOpen = false;

        vm.modalData;

        vm.permssionModal = false;


        vm.deleteConfirmModal = false;

        vm.xUSer = null;

        vm.nUser = {};


        vm.addUser = false;


        vm.userRole = auth.getUser()['role'];


        vm.changePassword = false;




        vm.userBindCheck = function()
        {

            console.log();


            var idx = $scope.$parent.base.getIndex(vm.roles, 'id', vm.nUser.role_id);

            var chosenRole = vm.roles[idx]['role'];


            if(chosenRole == 'contributor' || chosenRole == 'content developer')
            {

                vm.forceCategoryBound = true;

            }

            else {
                vm.forceCategoryBound = false;
                
            }





        }


        vm.generateFromRandom = function()
        {

           vm.generatedPassword = $scope.$parent.base.generatePassword();
           vm.nUser.password =  vm.generatedPassword;
           vm.nUser.passwordConfirm =  vm.generatedPassword;

        };


        vm.activateAddUser = function()
        {

            vm.generatedPassword = "";
            vm.nUser = "";
            vm.addUser = true;
            vm.dualColumn = true;

        };

        vm.deactivateAddUser = function()
        {

            vm.generatedPassword = "";
            vm.nUser = "";
            vm.addUser = false;
            vm.dualColumn = false;         

        };





        vm.addNewUser = function()
        {


            var url = API_URL+'users';

                $http({

                    url : url,
                    method: 'POST',
                    data : vm.nUser

                }).then(registerSuccess, registerError);


                function registerSuccess(res)
                {


                    var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    vm.addUser = false;
                    vm.nUser = {};

                    if(vm.dataList != undefined)
                    {
                        
                        vm.dataList.push(res.data.lastCreatedUser[0]);

                        console.log('with existing list');


                    }

                    else {

                        console.log('on empty user list');

                        vm.dataList = res.data.lastCreatedUser;

                        vm.loadingStatus = true;

                    }

                    


                }

                function registerError(res)
                {


                        var notify = {
                        type: 'error',
                        title: 'User Creations Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                }

            
        };





        vm.launchDeleteConfirmation = function(itemId)
        {

            vm.deleteConfirmModal = true;
            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);
            vm.xUSer = vm.dataList[idx];

        };

        vm.closeDeleteModal = function()
        {

            vm.deleteConfirmModal = false;
            vm.xUSer = null;

        }


        vm.loadPermissions = function(itemId)
        {

            
            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);
            vm.modalData = vm.dataList[idx];


                $http({
                    method: 'GET',
                    url : API_URL+'user-permissions/'+itemId,

                })
                .then(function(res){


                        vm.userPermissions = res.data.userPermissions;
                        vm.permssionModal = true;  


                        if(res.data.customPermissionList == false)
                        {
                            vm.newCustomPermission = false;
                        }
                        else {

                            vm.newCustomPermission = true;

                            vm.customPermissionList = res.data.customPermissionList;

                        }                     

                        console.log(res.data);


                }, function(res){

                    var notify = {
                        type: 'error',
                        title: 'User Permissions',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                });

        };






        vm.launchModal = function(user_id)
		{
			
			var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', user_id);
			vm.modalData = vm.dataList[idx];
			vm.modalOpen = true;
			console.log(vm.modalData);

		};

        vm.cpGenerateFromRandom = function()
        {
            vm.cpGenerated = $scope.$parent.base.generatePassword();
            vm.modalData.password =  vm.cpGenerated;
            vm.modalData.cpassword =  vm.cpGenerated;

        };



        vm.deactivateChangePassword = function()
        {

            vm.modalOpen = false;
            vm.modalData.password = "";
            vm.modalData.cpassword = "";
            vm.modalData = null;

            vm.cpGenerated = false;

        };


        vm.udpatePassword = function()
        {


            var url = API_URL+'changepassword/'+vm.modalData.id;

            var updatePayload = {
                'password': vm.modalData.password
            };

            function successPasswordChange(res)
            {

                
                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    vm.deactivateChangePassword();

            }

            function errorPasswordChange(res)
            {
                console.log('failed while updating password');
            }



            if(vm.modalData.password == vm.modalData.cpassword)
            {

                $http({
                url : url,
                method : 'PUT',
                data: updatePayload
            }).then(successPasswordChange, errorPasswordChange);



            }

            else {


                var notify = {
                        type: 'error',
                        title: 'Validation Error',
                        content: 'Both Password must be same',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                
            }


        };




        


        $http({
        	method: 'GET',
        	url : API_URL+'my-users',
            cache: false
        })
        .then(function(res){

            vm.topCategories = res.data.topCategories;
            vm.roles = res.data.roles;

        	if(res.status == 200)
        	{
        		vm.dataList = res.data.users;

                
                
                vm.loadingStatus = true;
        	}
            else if (res.status == 206)
            {
                vm.loadingStatus = 'no contents';

                
            }

            

        }, function(res){

        	vm.loadingStatus = false;

        });

        

        
        vm.statustoggle = function(user_id, userStatus)
        {

        	var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', user_id);


        	$http({
        		method: 'PUT',
        		url : API_URL+'users/status-toggle/'+user_id,
        		data : {'status': userStatus}
        	})

        	.then(function(res){


                if(res.data.user[0].status == 1)
                {

    	        	var notify = {
                            type: 'success',
                            title: 'Operation Successfull',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);
                }

                else {

                    var notify = {
                            type: 'warning',
                            title: 'Operation Successfull',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);

                }


	        }, function(res){

	        	var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    vm.dataList[idx].status = (userStatus == 1) ? '0' : '1';



	        	

	        });

        };



        vm.resetUserPermissions = function(user_id, role_id)
        {

            var url = API_URL+'users-permissons/reset/'+user_id+'/'+role_id;


            $http({

                url : url,
                method: 'PUT',
                data : {}


            }).then(

            function(res){

                var notify = {
                            type: 'success',
                            title: 'User Permissions',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);

            }, 

            function(res){


                var notify = {
                        type: 'error',
                        title: 'User Permission',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);



            });


        };



        vm.addNewUserPermission = function(user_id)
        {

            


            if(isNaN(vm.nctp))
            {
                
                var notify = {
                        type: 'error',
                        title: 'Validation',
                        content: 'Missing Permission ID',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                return false;

            }


            var url = API_URL+'user-permissions';


            $http({

                url : url,
                method: 'POST',
                data: {user_id : user_id, permission_id : vm.nctp}

            }).then(
            
            function(res){

                var notify = {
                        type: 'success',
                        title: 'User Permissions',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);
                    
                    vm.userPermissions.push(res.data.lastAdded[0]);


            }, 

            function(res){


                var notify = {
                        type: 'error',
                        title: 'User Permissions',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            });

        };



        vm.privatePermissionToggle = function(permissionID, user_id, pStatus)
        {

            var url = API_URL+'users-permissons/status-toggle/'+user_id+'/'+permissionID;

            $http({

                url : url,
                method : 'PUT',
                data : {pStatus: pStatus}

            }).then(

            function(res){


                var notifyType = (res.data.permissionStatus == 0) ? 'warning' : 'success';


                var notify = {
                            type: notifyType,
                            title: 'User Permissions',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);



            }, 
            function(res){


                var notify = {
                        type: 'error',
                        title: 'User Permission',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            });


        };


        vm.deleteUser = function(itemId)
        {


            $http({

                url : API_URL+'users/'+itemId,
                method: 'DELETE',
                data : {}
            }).then(

            function(res){

                /*
                    
                    remove from the list


                */

                var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);


                vm.dataList[idx].proceedToX = false;

                vm.deleteConfirmModal = false;

                vm.xUSer.proceedToX = false;



                vm.dataList.splice(idx, 1);

                var notify = {
                            type: 'warning',
                            title: 'OPeration Successfull',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);


            }, 

            function(res){

                var notify = {
                            type: 'error',
                            title: 'OPeration Failed',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);


            });


        };

        vm.activateUserUpload = function()
        {

            vm.uploadUser = true;
            vm.dualColumn = true;

        };



        vm.deactivateUserUpload = function()
        {

            vm.uploadUser = false;
            
            vm.dualColumn = false;


            vm.uploadSuccessFull = false;

            vm.uploadedUsersList = undefined;

        };


        vm.processUserUPload = function()
        {

            

             var file = $scope.photo;


            if(file == undefined)
            {


                var notify = {
                        type: 'error',
                        title: 'Validation Error',
                        content: 'Please attach CSV file',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    return false;

            }



            var form_data = new FormData();
            angular.forEach(file, function(file){

                form_data.append('file', file);




                
            });


            var uploadUrl = API_URL+'my-users/upload';

            vm.uploadSuccessFull = false;


            var successUserUpload = function(res) {

                

                    if(res.data.info != undefined && res.data.info.length != 0)
                    {
                        vm.uploadSuccessFull = true;

                        vm.uploadedUsersList = res.data.info;
                    }


                   

                   var notify = {
                        type: 'success',
                        title: 'Upload Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };

                    $scope.$emit('notify', notify);

                    /*
                    catch info payload and do something with it.
                    */

              

            };

            var errorUserUpload = function(res) {

                 var notify = {
                        type: 'error',
                        title: 'Upload Error',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);   

            };


            
            $http.post(uploadUrl, form_data,
                {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined, 'Process-Data': false}
            }).then(successUserUpload, errorUserUpload);

            


        };


    }]);

})();

(function() {

    angular.module('io2v3').controller('newQuizWizardCtrl', ['API_URL', '$scope', '$http', '$state', '$stateParams', 'wizardPreset', 'quizWizardService', function(API_URL, $scope, $http, $state, $stateParams, wizardPreset, quizWizardService){


        var vm = this;

        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Add New Quiz";


        vm.parentId = null;
        vm.subCategory = null;
        vm.subjectIds = [];


        $scope.stage == 2;


        vm.PresetData = wizardPreset.data;

        vm.categories = vm.PresetData.categories;

        vm.poolSummary = vm.PresetData.pool;

        vm.nQuiz = {};

        vm.nQuiz.reTakeUnique = 0;

        vm.nQuiz.dls = 0;

        vm.nQuiz.scoreVisible = 0;

        vm.nQuiz.showGradings = 0;

        vm.nQuiz.showGPA = 0;
        
        vm.chosenSubjects = [];

        vm.allDone = false;


        vm.hasValidDistribution = false;



        vm.phaseOneStatus = 'inactive';    
        vm.phaseTwoStatus = 'inactive';
        vm.phaseThreeStatus = 'inactive';
        vm.phaseFourStatus = 'inactive';


        vm.navigateToLastCreated = function()
        {
            $state.go("exm.exam", { examID: vm.lastCreatedId });
        }


        vm.calcMaxAllocation = function(maxX)
        {

            vm.maxAllocated = parseInt(vm.nQuiz.noQues) * parseInt(maxX);

        };


        vm.saveQuiz = function(saveNature)
        {


              if(saveNature == 1)
              {
                vm.hasValidDistribution = true;
              }  

              else {
                vm.hasValidDistribution = false;
              }


            /*
                preparePayload
                checkpoints 
                -----------
                attempt to save quiz
                attempt to allocate questions
                attempt to update subjects distribution
            */


            vm.moveToStep(6);



            vm.phaseOneStatus = 'working';                 



            var newQuizPayload = {

                title : vm.nQuiz.title,
                category_id : vm.parentId,
                cleanDesp : [vm.subCategory],
                cleanSubDesp : vm.subjectIds,
                duration: vm.nQuiz.duration,
                maxScore: vm.nQuiz.maxScore,
                minScore: vm.nQuiz.minScore,
                startDateTime: vm.nQuiz.startDateTime,
                endDateTime: vm.nQuiz.endDateTime,
                noques: vm.nQuiz.noQues,
                code: vm.nQuiz.code,
                venue: vm.nQuiz.venue,

                threshold: vm.nQuiz.threshold,
                dls : vm.nQuiz.dls,
                uniqueOnRetake: vm.nQuiz.reTakeUnique,
                showScore: vm.nQuiz.scoreVisible,
                showResult: vm.nQuiz.showResults,
                showGrading: vm.nQuiz.showGradings,
                showGPA : vm.nQuiz.showGPA,
                maxAllocation: vm.nQuiz.maxAllocation
                
            
            };

            vm.phaseOneStatus = 'done';

            vm.phaseTwoStatus = 'working';  


            function saveWizardSuccess(res)
            {

                vm.phaseTwoStatus = 'done';

                var notify = {
                        type: 'success',
                        title: 'Operation Successful',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                   var lastId = res.data.last_id;

                   vm.lastCreatedId = lastId;    

                   /*

                   if distribution is not valid then we must exit 
                   distribution save 
                   and we must not go to the allocation 

                   */



                   if(vm.hasValidDistribution)
                   {
                      vm.phaseFourStatus = 'working';    
                      vm.saveDistribution(lastId);  
                   }
                   
                   else {

                        vm.allDone = true;

                   }    




            }


            function saveWizardError(res)
            {

                vm.phaseTwoStatus = 'error';

                var notify = {
                        type: 'error',
                        title: 'Save Operation Failed',
                        content: res.data.message,
                        timeout: 8000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            }


            console.log(newQuizPayload);

              

            $http({
                url : API_URL+'quiz/wizard',
                method: 'POST',
                data: newQuizPayload


            }).then(saveWizardSuccess, saveWizardError);


        };


        vm.checkDates = function()
        {       

            
            var currentDateTime = new Date();

            currentDateTime.setMilliseconds(0);
            currentDateTime.setSeconds(0);

            var startDateTime = document.getElementById('startDateTime').value;
            var endDateTime = document.getElementById('endDateTime').value;

            vm.nQuiz.startDateTime =  startDateTime;   
            vm.nQuiz.endDateTime = endDateTime;

            vm.dateVerified = null;
            vm.datesError = null;

            var inputStartDateTime = new Date(startDateTime);

            inputStartDateTime.setMilliseconds(0);
            inputStartDateTime.setSeconds(0);

            var inputEndDateTime = new Date(endDateTime);

            inputEndDateTime.setMilliseconds(0);

            inputEndDateTime.setSeconds(0);


            if(inputStartDateTime < currentDateTime)
            {
                vm.datesError = 'start datetime cannot be less than current date time';
                vm.dateVerified = false;
            }


            else if(inputEndDateTime <= inputStartDateTime)
            {
                vm.datesError = 'End Date Time must be greater!';
                vm.dateVerified = false;
            }

            else {

                vm.dateVerified = true;
                vm.datesError =  null;
                
            }


            if(vm.dateVerified == true && vm.datesError == null)
            {
                vm.moveToStep(4);
            }



        };


        vm.toggleFeatures = function(featureName)
        {

        	(vm.nQuiz.featureName == 1) ? 0 : 1;       	
        	console.log('attempt to toogle retake' + vm.nQuiz.reTakeUnique);

        };


        vm.moveStage = function(currentStage, nextStage)
        {



        };


        console.log('new quiz wizard executed');


        vm.setParent = function(catId)
        {

        	vm.subCategory = null;
        	vm.parentId = catId;		
        	vm.availableInPool = 0;
            vm.chosenSubjects = [];

        };


        vm.setSubCategory = function(subCategory)
        {

        	
        	vm.subjectIds = [];
        	vm.subCategory = subCategory;
        	vm.availableInPool = 0;
            vm.chosenSubjects = [];

        };


        vm.toggleSelectSubjects = function(subjectId)
        {
        	var Idx = vm.subjectIds.indexOf(subjectId);	
        	if(Idx == -1)
        	{
        		vm.subjectIds.push(subjectId);
        	}
        	else {
        		vm.subjectIds.splice(Idx, 1);			
        	}

        	vm.setAvailableQuestions();

            vm.setChoosenSubjects();

        };

        vm.setAvailableQuestions = function()
        {

        	vm.availableInPool = 0;		
			   	
        	for(var key in vm.poolSummary)
        	{

        		 if (vm.poolSummary.hasOwnProperty(key)) {

        		 	var Idx = vm.subjectIds.indexOf(vm.poolSummary[key]['section_id']);	

        				 if(Idx != -1)
        				 {
        				 		vm.availableInPool += parseInt(vm.poolSummary[key]['noQues']);	     				 	
        				 }

    				}
        	}


        };


        vm.setChoosenSubjects = function()
        {


            vm.chosenSubjects = [];
             
            for(var key in vm.categories)
            {

                 if (vm.categories.hasOwnProperty(key)) {

                    var Idx = vm.subjectIds.indexOf(vm.categories[key]['id']);

                         if(Idx != -1)
                         {
                                
                                vm.chosenSubjects.push(vm.categories[key]);
                         }

                    }
            }


        };


        vm.isSubjectActive = function(subjectId)
        {

        	var Idx = vm.subjectIds.indexOf(subjectId);
        	if(Idx == -1)
        	{
        		return false;
        	}
        	return true;
        };

        vm.stepOneisValid = function()
        {

        	if(vm.subjectIds.length < 1)
        	{
        		return false;
        	}

        	return true;

        };

        vm.moveToStep = function(stepNo)
        {

            if(stepNo == 5)
            {
                vm.activateDistroState();
                $scope.stage = stepNo;
            }
            else {
                $scope.stage = stepNo;
            }


        };



        vm.activateDistroState = function()
        {


            if(vm.subjectIds.length == 0)
            {
                 var notify = {
                        type: 'error',
                        title: 'Categorization',
                        content: 'Select all 3 levels in category',
                        timeout: 8000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    $scope.stage = 1;

                    return false;
            }


            var dataPayload = {

               threshold : vm.nQuiz.threshold,
               subject_ids : vm.subjectIds 

            };


            quizWizardService.loadPreDistributionInfo(dataPayload).then(

                function(res){

                    if(res.data.distro != undefined && res.data.distro.length != 0)
                    {


                        vm.preDistro = res.data.distro;

                        if($scope.stage != 5) 
                        {
                           $scope.stage = 5;     
                        }



                    }
                    else {
                       

                    }


                }, 

                function(res){

                    console.log('cannot move the state at this point');

                });




        };



        $scope.$watch('vm.nQuiz.entDateTime', function (newValue, oldValue, scope) {
               
            if(newValue != oldValue)
            {
                console.log('the value has been changed');
  
            }
            
        }, true);



        vm.detectChange = function()
        {

            console.log('change has beeen detected');

        };



        vm.getTotal =  function()
          {


            vm.Qtotal  = 0;
            vm.pointsTotal = 0;
            vm.subjecTotal = 0;

            for(var property  in vm.preDistro)
            {
                if(vm.preDistro.hasOwnProperty(property))
                {
                    
                    var item = vm.preDistro[property];

                    item.quePerSection = parseInt(item.quePerSection);
                    item.points = parseFloat(item.points);
                    item.questions = parseFloat(item.questions);

                    if(parseInt(item.quePerSection) == 'NaN')
                    {
                        item.quePerSection = 0;
                    }


                    if(parseFloat(item.points) == 'NaN')
                    {
                        item.points = 0;   
                    }

                    

                    if(parseFloat(item.questions) == 'NaN')
                    {
                        item.questions = 0;
                    }


                    vm.subjecTotal += parseFloat(item.questions);
                    vm.Qtotal += item.quePerSection;
                    vm.pointsTotal += parseFloat(item.points);

                }

            }

          }



          vm.saveDistribution = function(lastID)
          {

              var saveDistroUrl = API_URL+'quiz/distribution/'+lastID; 

              

              $http({

                url : saveDistroUrl,
                method : 'PUT',
                data : vm.preDistro

              }).then(
              function(res){

                vm.phaseFourStatus = 'done';

                vm.phaseThreeStatus = 'working';


                var allocateQuestionUrl = API_URL+'quiz-question-allocate/'+lastID;

                function allocateSuccess(res)
                {
                    
                     var notify = {
                        type: 'info',
                        title: 'Question Allocation',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };

                    $scope.$emit('notify', notify);
                    vm.phaseThreeStatus = 'done';

                    vm.allDone  = true;

                    
                }

                function allocateError(res)
                {

                     var notify = {
                        type: 'error',
                        title: 'Question Allocation',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };

                    $scope.$emit('notify', notify);

                }


                $http.post(allocateQuestionUrl).then(allocateSuccess, allocateError);

                

                var notify = {
                        type: 'info',
                        title: 'Distrbution',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };

                    $scope.$emit('notify', notify);

                 //   $state.go("exm.exam", { examID: lastID });


              }, 

              function(res){
              
                vm.phaseFourStatus = 'error';

                var notify = {
                        type: 'error',
                        title: 'Distrbution',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };

                    $scope.$emit('notify', notify);

              });
     
          }

    }]);

})();

(function(){
	angular.module('io2v3')
	.controller('notFoundCtrl', notFoundCtrl);

	function notFoundCtrl(){
		var vm = this;

		console.log('not found controller activated');
		
	}



})();
(function() {

    angular.module('io2v3').controller('permissionsCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;

        $scope.$parent.base.pageUrl = $state.current.url; 


        $scope.$parent.dash.pageHeading = "Permissions";


        
        vm.pageMode = null;


        $http({
        	method: 'GET',
        	url : API_URL+'permissions',
            cache: false

        })
        .then(function(res){

        		vm.dataList = res.data;
                vm.pageMode = 'list';

        }, function(res){


        	console.log('failed');

            vm.pageMode = 'error';

        });



        vm.savePermission = function() 
        {

            var saveUrl = API_URL+'permissions';

            vm.npermission.name = $scope.$parent.base.slugify(vm.npermission.name);


            $http({

                url : saveUrl,
                method: 'POST',
                data : vm.npermission

            }).then(

            function(res) {

                console.log(res.data);
                vm.dataList.permissions.push(res.data.permission[0]);

                vm.npermission = {};

                vm.pageMode = 'list';

                var notify = {
                        type: 'success',
                        title: 'Success',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);


            },
            function(res){

                console.log(res.data);

                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);


            });

        };



        vm.removePermission = function(itemId)
        {

            


            var idx = $scope.$parent.base.getIndex(vm.dataList.permissions, 'id', itemId);


            console.log(idx);

            function deleteSuccess(res)
            {

                var notify = {
                                type: 'success',
                                title: 'Delete Permission',
                                content: res.data.message,
                                timeout: 5000 //time in ms
                            };
                            $scope.$emit('notify', notify);  

                            vm.dataList.permissions.splice(idx, 1);  
            }

            function deleteError(res)
            {


                  var notify = {
                                type: 'error',
                                title: 'Delete Permission',
                                content: res.data.message,
                                timeout: 5000 //time in ms
                            };
                            $scope.$emit('notify', notify);    


            }


            $http.delete(API_URL+'permissions/'+itemId).then(deleteSuccess, deleteError);





        };

        


        console.log('controller is activated');




    }]);

})();

(function() {

    angular.module('io2v3').controller(['nameCtrl', 'API_URL', '$scope', function(API_URL, $scope){


        var vm = this;

        console.log('publc root controller is activated');


    }]);

})();

(function() {

    angular.module('io2v3').controller('queAddCtrl', ['API_URL', '$scope', '$http', '$state', '$stateParams', 'quizDataService', 'queGlobalData', 'auth', function(API_URL, $scope, $http, $state, $stateParams, quizDataService, queGlobalData, auth){

        var vm = this;

        vm.token = localStorage.getItem('auth_token');


        vm.showMediaLibrary = false;
        vm.mediaLoaded = null;

        vm.questionMedia = [];

        $scope.$parent.base.pageUrl = $state.current.url; 


        vm.optionImageModal = false;

        vm.enableLink = false;



        vm.bindTopCategory = true;

        console.log(queGlobalData);



        vm.userRole = auth.getUser()['role'];


        vm.isNumber = angular.isNumber;

        vm.myFormData = {};


        



        if(vm.userRole == 'content developer' || vm.userRole == 'contributor')
        {

            vm.bindTopCategory = true;




            if(queGlobalData.data.topCategory == false)
            {

                var notify = {
                        type: 'error',
                        title: 'Permission Denied',
                        content: 'Top level category was not assinged ',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                $state.go('dash.questions');

                return false;

            }

            else {

                vm.topBindCategory = queGlobalData.data.topCategory;

                setTimeout(function() {

                    
                    vm.queCategory = vm.topBindCategory;

                    console.log();
                    
                    var idx = $scope.$parent.base.getIndex(vm.globalList.cat, "id", vm.queCategory.toString());

                    vm.topPreSelectCategory = vm.globalList.cat[idx]['tree'];



                })    
                

            }

        }

        else {


            vm.bindTopCategory = false;

        }











        if($stateParams.examID != undefined)
        {
           $scope.$parent.exAbs.pageHeading = "Add New Questions";
        }
        else {

            $scope.$parent.dash.pageHeading = "Add New Questions";

        }    


        

        vm.addMediaToQuestion = function(item)
        {

            if(!vm.mediaAddedTolist(item.id))
            {
                vm.questionMedia.push(item);    
            }

        };

        vm.mediaAddedTolist = function(itemid)
        {

            var idx = $scope.$parent.base.getIndex(vm.questionMedia, 'id', itemid);
            if(idx == -1)
            {
                return false;
            }

            return true;

        };


        vm.unlinkFromLibrary = function(itemId)
        {

            var idx = $scope.$parent.base.getIndex(vm.questionMedia, 'id', itemId);


            vm.questionMedia.splice(idx, 1);            

        };


        vm.enableLibrary = function()
        {
            vm.showMediaLibrary = true;            
        };


        vm.closeLibrary = function()
        {

            vm.showMediaLibrary = false;            

        };


        vm.removeMedia = function(index)
        {

            vm.questionMedia.splice(index, 1);


        };


        if($stateParams.examID != undefined)
        {

            vm.QuizPrivate = true;
            

            vm.examID = $stateParams.examID;
            $scope.$parent.absExamId = $stateParams.examID;


            quizDataService.getMasterQuiz(vm.examID).then(function(res) {

                vm.quizData = res.data;
                vm.queCategory = vm.quizData.quiz[0].category_id;


            });

            vm.queSection = "Select Section";


        }

        else {
            vm.QuizPrivate = false;

            vm.queCategory = "Select Category";
            vm.queSection = "Select Section";
            vm.queDecipline = "Sub Descipline"

        }


        vm.saveReturn = false;
        vm.queLevel = "Select Level";
        vm.queType = "Select Type";

        


        vm.nque = {};


        vm.optAns = {
            a : false,
            b : false,
            c : false,
            d : false
        }



        vm.fetchGlobal = function()
        {

            vm.globalList = queGlobalData.data;
            

        };


        vm.saveQuestion = function(type = null)
        {

        	
        	if(type == 'more')
        	{
        		vm.saveReturn = true;
        	}
        	else {
        		vm.saveReturn = false;	
        	}


            if(vm.queType == 3)
            {


                console.log('condition matched');

                // build string for multiple choice
                var tempArrOPtions = [];

                for(var key in vm.optAns)
                {
                    if(vm.optAns.hasOwnProperty(key))
                    {
                        if(vm.optAns[key] == true)
                        {
                            tempArrOPtions.push(key);
                        }
                    }
                }


               vm.nque.answer = tempArrOPtions.join(",");


               console.log(vm.nque.answer);

            }






        	var url = API_URL+'questions';

        	vm.nque.category_id = vm.queCategory;
        	vm.nque.section_id = vm.queSection;
        	vm.nque.level_id = vm.queLevel;
        	vm.nque.type_id = vm.queType;


            

            if(vm.questionMedia.length > 0)
            {

                vm.nque.mediaIds = [];

                vm.questionMedia.forEach(function(item) {

                    vm.nque.mediaIds.push(item);

                });



            }

            if($stateParams.examID != undefined)
            {
                vm.nque.quiz_id =  $stateParams.examID;               
            }

        		
        	$http({

        		url : url,
        		method : 'POST',
        		data : vm.nque

        	}).then(saveSuccess, saveError);



        	function saveSuccess(res)
        	{
        		

        		 vm.nque = {};
                 vm.questionMedia = [];

                 var notify = {
                        type: 'success',
                        title: 'Operartion Successful',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };

                    $scope.$emit('notify', notify);


            if(vm.queType == 3)
            {

                // build string for multiple choice   
                for(var key in vm.optAns)
                {
                    if(vm.optAns.hasOwnProperty(key))
                    {
                        vm.optAns[key] = false;
                        
                    }
                }
            }


            vm.nque.answer = "";



        	}

        	function saveError(res)
        	{
        		
                    var notify = {
                        type: 'error',
                        title: 'Operartion Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };

                    $scope.$emit('notify', notify);

        	}


        }



        vm.fetchMedia = function()
        {

            $http.get(API_URL+'media').then(

                function(res) {

                    vm.mediaLoaded = true;

                    vm.mediaList = res.data.media;

                }, 
                function(res) {

                    vm.mediaLoaded = false;

                });

        };


        vm.fetchGlobal();
        vm.fetchMedia();


        


        vm.sendFile = function()
        {

            if($stateParams.examID != undefined)
            {
                vm.myFormData.category_id = vm.quizData.quiz[0].category_id;
            }
            else {

                vm.myFormData.category_id = vm.queCategory;

            }

            var file = $scope.photo;
            var uploadUrl = API_URL+'media';

            var form_data = new FormData();
            angular.forEach(file, function(file){
                form_data.append('file', file);
            });


            var formpostdata = vm.myFormData;

            for (var key in formpostdata) {
                form_data.append(key, formpostdata[key]);
            }

            $http.post(uploadUrl, form_data,
                {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined, 'Process-Data': false}
            }).then(
            function(res){

                var lastItem = res.data.lastItem[0];
                vm.mediaList.push(lastItem);

            }, 

            function(res){


                var notify = {
                        type: 'error',
                        title: 'Error',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                
            });

        };



        vm.activateImageOption = function(optionLabel)
        {

            vm.optionLabel = optionLabel;
            console.log(optionLabel);
            vm.optionImageModal = true;
            vm.uploadUrl = API_URL+'queoptionimages/'+optionLabel;


            $scope.dropzoneConfig = {
            'options': { 
              'url': vm.uploadUrl,
              'multiple' : false,
              'maxFiles' : 1,
              'thumbnailWidth': null,
              'thumbnailHeight': null,
              
              'acceptedFiles': ".pdf,.png,.jpg,.gif,.bmp,.jpeg",
              'dictDefaultMessage': 'Drag or upload option image here',
              headers: {'token': vm.token}
            },
            'eventHandlers': {
              'sending': function (file, xhr, formData) {

                console.log(xhr);

              },
              'success': function (file, response) {

                  if(response.status)
                  {
                    
                    console.log('met condition');
                    
                    vm.enableLink = true;

                    var imageUrl = response.imageUrl;

                    var optionOrder = 'option'+optionLabel.toUpperCase();

                    vm.nque[optionOrder] = imageUrl;


                    vm.closeOptionAttachModal();


                    $scope.$apply();



                  }

                  

                  


              }
            }
        };



        };


        vm.closeOptionAttachModal = function()
        {

            vm.optionImageModal = false;

        };




    }]);

})();

(function() {

    angular.module('io2v3').controller('quepoolCtrl', ['API_URL', '$scope', '$http', function(API_URL, $scope, $http){


        var vm = this;

        $scope.$parent.dash.pageHeading = "Questions Stats";


        console.log('que pool is activated');


        var url = API_URL+'question-section-summary';


        $http.get(url, {cache: false}).then(function(res) {


        	vm.dataList = res.data.queSum;

        });

        


    }]);

})();

(function() {

    angular.module('io2v3').controller('questionEditCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$state', function(API_URL, $scope, $http, $stateParams, $state){

        var vm = this;

        vm.nque = {};

        

        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Edit Question";

        vm.questionID = $stateParams.queID;

        vm.pageloading == null

        vm.queData = null;





        $http.get(API_URL+'question/'+vm.questionID).then(

        	function(res){

        		vm.pageloading = true;

        		vm.queData = res.data;

        		vm.selectedAnswer = vm.queData.question.answer;


                if(vm.queData.question.type_id == 3)
                {
                    vm.initCheckbox();

                }
        		
        	}, 

        	function(res){

        		vm.pageloading = false;

        	});



        vm.initCheckbox = function()
        {


            vm.optAns = {};

                    vm.optAns.a = false;
                    vm.optAns.b = false;
                    vm.optAns.c = false;
                    vm.optAns.d = false;

                     var ansOptArray = vm.queData.question.answer.split(',');
                     

                     for(key in vm.optAns)
                     {

                        if(vm.optAns.hasOwnProperty(key))
                        {

                            if(ansOptArray.indexOf(key) != -1)
                            {
                                vm.optAns[key] = true;
                            }

                            
                        }

                       

                     }

        };


        vm.prepareCheckboxString = function()
        {

            var tempArrOPtions = [];

                for(var key in vm.optAns)
                {
                    if(vm.optAns.hasOwnProperty(key))
                    {
                        if(vm.optAns[key] == true)
                        {
                            tempArrOPtions.push(key);
                        }
                    }
                }

               vm.nque.answer = tempArrOPtions.join(",");

        };


        vm.preparePayload = function()
        {

             payload = {

                queDesc : vm.queData.question.queDesc,
                type_id : vm.queData.question.type_id
                
            };


            if(vm.queData.question.type_id != 4)
            {

                payload.optionA = vm.queData.question.optionA;
                payload.optionB = vm.queData.question.optionB;
                if(vm.queData.question.type_id != 2)
                {
                    payload.optionC = vm.queData.question.optionC;
                    payload.optionD = vm.queData.question.optionD;    
                }               

            }


            if(vm.queData.question.type_id == 1 || vm.queData.question.type_id == 2)
            {
                /*
                radion and boolean
                */

                payload.answer = vm.selectedAnswer;
            }
            else if(vm.queData.question.type_id == 4) {

                payload.answer =  vm.queData.question.answer;  
                
            }

            else {

                payload.answer =  vm.nque.answer;  

            }



            vm.payload = payload;



        };


        vm.triggerUpdate = function(res)
        {
            
            if(vm.queData.question.type_id == 3)
            {
                vm.prepareCheckboxString();
            }

            vm.preparePayload();


            vm.pushChanges();


        };


        vm.pushChanges = function()
        {


            var updateError = function(res)
            {

                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };

                    $scope.$emit('notify', notify);

            };


            var updateSuccess = function(res)
            {

                var notify = {
                        type: 'success',
                        title: 'Operation Success',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };

                    $scope.$emit('notify', notify);


                    $state.go('dash.questions');


            };


            $http({

                url : API_URL+'question/'+vm.questionID,
                method : 'PUT',
                data : vm.payload

            }).then(updateSuccess, updateError);



        };




    }]);

})();

(function() {

    angular.module('io2v3').controller('questionsCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$window', '$state', function(API_URL, $scope, $http, $stateParams, $window, $state){


        var vm = this;


        vm.togglers = false;


        $scope.sortType = '$';
        vm.searchQuery = '';
        $scope.sortReverse  = false;



        vm.selectSortfield = function(fieldName)
        {

            $scope.sortType = fieldName;

        };


        vm.clearFilters = function()
        {

            $scope.sortType = '$';
            vm.searchQuery = '';
            $scope.sortReverse  = false;

        };

        vm.toggleSort = function()
        {

            $scope.sortReverse = !$scope.sortReverse;

        };


        

        

        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Questions";




        $scope.fields = [

        {'cat': false},
        {'decip': false},
        {'author': false},
        {'dated': false},
        {'desc': true},
        {'answer': false},
        {'diff': false},
        {'type': false},
        {'hits': false},
        {'scope': true},
        
        {'description': false},
        {'hits': false},
        {'status': true}
        ];


        


        vm.toggleFields = function(field, index)
        {

          $scope.fields[index].field  =! $scope.fields[index].field;


          console.log($scope.fields[index].field);

        };


        vm.questionStatusToggle = function(id, queStatus)
        {

            console.log(id, queStatus);

            var toggleUrl = API_URL+'questions/status-toggle/'+id;


            var toggleUpdateSuccess = function(res)
            {


                  var notifyType = (queStatus == 1) ? 'success' : 'warning';

                var notify = {
                        type: notifyType,
                        title: 'Status Updated',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            };


            var toggleUpdateError = function(res)
            {


                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


            };

            $http({

               url : toggleUrl,
               method : 'PUT',
               data : {'status': queStatus}

            }).then(toggleUpdateSuccess, toggleUpdateError);



        };



        vm.loading = null;


        $http.get(API_URL+'questions', {cache: false}).then(

        	function(res) {

                if(res.status == 200)
                {
                    vm.loading = true;
                    vm.dataList = res.data;
                    vm.questions = vm.dataList.questions;
                }

        		

                if(res.status == 204)
                {
                    vm.loading = 'no contents';
                }

        	},

        	function(res)
        	{

        		vm.loading = false;

        	});


        var onScrollAction = function (e) {

        	if($state.current.name == 'dash.questions')
        	{
        		
        		var currentScrollPosition = e.currentTarget.scrollTop;
        		var scrollHeight = (e.currentTarget.scrollHeight - (screen.height - 161) );

        		if(currentScrollPosition >= (scrollHeight - 300 ) )
        		{
        			console.log('load more triggered');
        		}

        		console.log(currentScrollPosition + ' : ' + scrollHeight);

        		/*
				
				Total Height of a div : scrollHeight: 9127
				--------------------- : 
        		scrollHeight: 9127
				scrollLeft: 0
				scrollTop: 400
				scrollWidth: 1258

        		*/


        	}



  				
			};


        

        $('.scrollable.wrapper').on('scroll', onScrollAction);

        //$('.scrollable.wrapper').off('scroll', onScrollAction);
		
        


    }]);

})();

(function() {

    angular.module('io2v3').controller('questionUploadCtrl', ['API_URL', '$scope', '$http', '$state', '$stateParams', 'quizDataService', 'queGlobalData', 'auth', function(API_URL, $scope, $http, $state, $stateParams, quizDataService, queGlobalData, auth){

        var vm = this;

        vm.isNumber = angular.isNumber;

        vm.userRole = auth.getUser()['role'];


        $scope.$parent.base.pageUrl = $state.current.url; 


        if($stateParams.examID == undefined)
        {
           $scope.$parent.dash.pageHeading = "Upload Questions";
        }
        else {

            $scope.$parent.exAbs.pageHeading = "Upload Quiz Questions";

        }


        vm.bindTopCategory = true;

        vm.myFormData = {};


                if(vm.userRole == 'content developer' || vm.userRole == 'contributor')
        {

            vm.bindTopCategory = true;

            if(queGlobalData.data.topCategory == false)
            {

                var notify = {
                        type: 'error',
                        title: 'Permission Denied',
                        content: 'Top level category was not assinged ',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                $state.go('dash.questions');

                return false;

            }

            else {

                vm.topBindCategory = queGlobalData.data.topCategory;

                setTimeout(function() {

                    
                    vm.queCategory = vm.topBindCategory;

                    console.log();
                    
                    var idx = $scope.$parent.base.getIndex(vm.globalList.cat, "id", vm.queCategory.toString());

                    vm.topPreSelectCategory = vm.globalList.cat[idx]['tree'];



                })    
                

            }

        }

        else {


            vm.bindTopCategory = false;

        }



        if($stateParams.examID != undefined)
        {

            vm.QuizPrivate = true;
            

            vm.examID = $stateParams.examID;
            $scope.$parent.absExamId = $stateParams.examID;


            quizDataService.getMasterQuiz(vm.examID).then(function(res) {

                vm.quizData = res.data;
                vm.queCategory = vm.quizData.quiz[0].category_id;


            });

            vm.queSection = "Select Section";


        }

        else {
            vm.QuizPrivate = false;

            vm.queCategory = "Select Category";
            vm.queSection = "Select Section";
            vm.queDecipline = "Sub Descipline"

        }



        vm.fetchGlobal = function()
        {

            vm.globalList = queGlobalData.data;
            

        };



        vm.fetchGlobal();

        vm.sendUploadRequest = function()
        {

            
            var file = $scope.photo;


            if(file == undefined)
            {


                var notify = {
                        type: 'error',
                        title: 'Validation Error',
                        content: 'Please attach CSV file',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    return false;

            }


            var uploadUrl = API_URL+'questions-bulk';



            vm.myFormData.category_id = vm.queCategory;
            vm.myFormData.section_id = vm.queSection;

            vm.myFormData.type_id = vm.queType;

            vm.myFormData.level_id = vm.queLevel;

            

            console.log(vm.myFormData);
            

            var form_data = new FormData();
            angular.forEach(file, function(file){
                form_data.append('file', file);

                console.log(file);


            });

            var formpostdata = vm.myFormData;

            for (var key in formpostdata) {
                form_data.append(key, formpostdata[key]);
            }


            var successQuestionUpload = function(res)
            {

                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    $state.go('dash.questions');

            };

            var errroQuestionUpload = function(res)
            {

                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            };



            $http.post(uploadUrl, form_data,
                {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined, 'Process-Data': false}
            }).then(successQuestionUpload, errroQuestionUpload);
        


        };



    }]);

})();

(function() {

    angular.module('io2v3').controller('quizAnswerConsentCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;


        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = vm.examID;

        var attempt_id = $stateParams.attemptID;


        var answerUrl = API_URL+'quiz/inspectanswers/'+vm.examID+'/'+attempt_id;

        $scope.$parent.exAbs.pageHeading = "Consent";


        $http.get(answerUrl).then(

        	function(res){
		       	console.log(res);

		       	vm.dataList = res.data;
        	}, 

        	function(res){

        		console.log(res);

        	});

        


    }]);

})();

(function() {

    angular.module('io2v3').controller('quizAnswerInpectCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;


        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = vm.examID;

        var attempt_id = $stateParams.attemptID;


        $scope.$parent.exAbs.pageHeading = "Inspection";


        var answerUrl = API_URL+'quiz/inspectanswers/'+vm.examID+'/'+attempt_id;


        $http.get(answerUrl).then(

        	function(res){
		       	console.log(res);

		       	vm.dataList = res.data;
        	}, 

        	function(res){

        		console.log(res);

        	});

        


    }]);

})();

(function() {

    angular.module('io2v3').controller('quizAttemptCtrl', ['API_URL', '$scope', '$http', '$state', '$stateParams', 'quizPlayData', '$timeout', function(API_URL, $scope, $http, $state, $stateParams, quizPlayData, $timeout){


        var vm = this;
        vm.quizData = quizPlayData.data;
        vm.timeexpiration = false;

        $scope.cachedImages = [];



        if(vm.quizData.imagesPreload.length != false)
        {

            $scope.imageLocations = vm.quizData.imagesPreload;

            var absoluteUrlPattern = new RegExp("^(http|https)://", "i");

            $scope.imageLocations.forEach(function(imageUrl) {



                imageUrl = decodeURIComponent(imageUrl);

                
                


                

                if(!absoluteUrlPattern.test(imageUrl))
                {

                   console.log(imageUrl + 'is absolute');
                   imageUrl = API_URL+imageUrl;
                }

                
                let imageUrlRequest = new Request(imageUrl);

                

                fetch(imageUrlRequest, {mode: 'no-cors'}).then(function(res) {


                        caches.open('quizImageCache').then(function(cache) {

                            cache.put(imageUrlRequest, res.clone());

                        });


                }).catch(function(erro) {

                    console.log(error);

                });


            });    
         
        }
    

    
        

        vm.entityLogo = function()
        {


            if(vm.quizData.entityLogo[0].logo)
            {
                return API_URL+vm.quizData.entityLogo[0].logo;
            }

            else {
                return 'assets/images/iSkillMetrics-logo.svg';
            }


        };

        
        /*    
        terminate broadcast api not working in safari
        const channel = new BroadcastChannel('sw-idxsaved');
        */

        vm.lightBoxEnabled  = false;


        /*
        if(vm.quizData.action != undefined && vm.quizData.action == 'redirect')
        {
          return $state.go('onExamRefresh', {'quiz_id': $stateParams.quiz_id, 'attempt_id': $stateParams.attempt_id});
        }
        */

        vm.optionhasImage = function(optionsSTring)
        {

            myRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg))/i
            return myRegex.test(optionsSTring);
        };

        
        

        vm.closeCurrentWindow = function() {

            console.log('attempt to close window');

            console.log(window.quizWindow);


            if(window.quizWindow != undefined)
            {
               console.log('quiz window attached to root');
               window.quizWindow.close();
            }

            else {

                console.log('redirect compilted page');
                    
                $state.go('quizcomplited');

            }
            
        };

        

        vm.questionIndex = 0;

        // new line added for decoding strings of object 

       // vm.quizData.questions = $scope.$parent.base.inboundDecode(vm.quizData.questions);

        vm.endActivated = false;

        vm.reviewAll = false;



        vm.activeQuestion = vm.quizData.questions[vm.questionIndex];

        var attempt_id = $stateParams.attempt_id;


        vm.ShowPulse = false;


        vm.TimeStatus = 'high';


        $scope.baseUrl = API_URL;


        vm.hasPre = false;
        vm.hasMore = true;
        vm.showEndQuiz = false;


        vm.save = function()
        {

            var answerSaveUrl = API_URL+'std-patch-answers';

            $timeout.cancel(vm.quizTimeInterval);
            

            var timeLeft = localStorage.getItem('lastStoredDurationSeconds');

            var endState = (vm.timeexpiration) ? 'timeout' : 'explicit';


            vm.quizMeta = {"endState" : endState,  "timeLeft" : timeLeft};


            vm.idbPayload = {
            "url" : answerSaveUrl,
            "method": 'POST',
            "data" : {'answers' : vm.payloadAnswers, 'quizMeta' : vm.quizMeta}
            };

            $http(vm.idbPayload).then(

                function(res){

                 //   $state.go('std.exams');


                 $scope.$emit('playSound', { message: 'quiz-end' });
                       
                       vm.closeCurrentWindow();


                }, 

                function(res){
                if(res.status < 1)
                {
                    
                    console.log('LOST IC Trigger BackgroundSync');


                    vm.idbPayload.data.quizMeta.endState = 'Network Lost';



                    vm.triggerBackgroundSync(vm.idbPayload);


                    var notify = {
                        type: 'warning',
                        title: 'Internet Disconnected',
                        content: 'Progress has been saved and pushed to server as connection resumes',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);



                    setTimeout(function() {

                        vm.closeCurrentWindow();
                        
                        $scope.$emit('playSound', { message: 'quiz-end' });

                    }, 2000)

                }      
                 

                });


            localStorage.removeItem('lastStoredDurationSeconds');

        };


        vm.triggerBackgroundSync = function(payload)
        {

            var swPost = {
                 'form_data': payload
              };
      
            navigator.serviceWorker.controller.postMessage(swPost);


            /*    
            channel.addEventListener('message', event => {

            if(event.data.status == 1 && window.cachedRegisterSW != undefined)
            {
                 window.cachedRegisterSW.sync.register('exam');
            }

            });
            */


            navigator.serviceWorker.addEventListener('message', event => {

            if(event.data.status == 1 && window.cachedRegisterSW != undefined)
                {
                    window.cachedRegisterSW.sync.register('exam');
                }
                        
            });


        };


         vm.validAnswer = function()
         {


            if(vm.activeQuestion.answer == undefined)
            {                   
                
                return false;
            }

            else if (typeof(vm.activeQuestion.answer) === 'object')
            {
                
                for(var key in vm.activeQuestion.answer)
                {
                    if(vm.activeQuestion.answer.hasOwnProperty(key))
                    {
                        if(vm.activeQuestion.answer[key] == true)
                        {
                            return true;   
                        }
                    }
                }
                return false;
            }

            else if (vm.activeQuestion.answer == "")
            {
                return false;
            }

            else {
                return true;
            }

         };


        vm.ansPrep = function()
        {
            
            vm.answerAvailable = true;
            vm.payloadAnswers = [];

            vm.endActivated = true;

            for(var key in vm.providedAnswers)
            {             
                
                var answer = vm.providedAnswers[key].answer;
                if(typeof(answer) == "object")
                {

                    var tempArrOPtions = [];
                    for(var k in answer)
                    {
                        if(answer.hasOwnProperty(k))
                        {
                            if(answer[k] == true)
                            {
                                tempArrOPtions.push(k);
                            }
                        }
                    }
                    tempArrOPtions.sort();
                    answer = tempArrOPtions.join(",");
                }
                
                var tempObj = {
                        "attempt_id" : attempt_id,
                        "question_id" : vm.providedAnswers[key].questionId,
                        "answer" : answer
                }
                vm.payloadAnswers.push(tempObj);



            }

            vm.answerAvailable = true;
            vm.save();

        }


        vm.markedQuestions = [];
        vm.providedAnswers = [];
        vm.startReviewWizard = null;


        vm.startReview = function()
        {

            vm.startReviewWizard = true;
            vm.quizData.questions = vm.markedQuestions;
            vm.questionIndex = 0;            
            vm.activeQuestion = vm.markedQuestions[vm.questionIndex];
       
       };


       vm.startReviewAll = function()
       {


            vm.quizData.questions = vm.providedAnswers;


            for (var key in vm.quizData.questions) {

                if (vm.quizData.questions.hasOwnProperty(key)) {

                        if(vm.quizData.questions[key]['marked'] != undefined)
                        {
                            delete vm.quizData.questions[key]['marked'];
                        }

                    }
            }



            vm.questionIndex = 0;            
            vm.activeQuestion = vm.quizData.questions[vm.questionIndex];
            vm.reviewAll = true;

            vm.startReviewWizard = false;

            vm.markedQuestions = [];

            vm.isLastQue = false;


            



       };


        vm.revNext = function()
        {

            if(vm.validAnswer() && vm.questionIndex + 1 <= vm.markedQuestions.length)
            {
                vm.providedAnswers.push(vm.activeQuestion);
                vm.pushActivity(vm.questionIndex);
                vm.questionIndex += 1;
                vm.activeQuestion = vm.markedQuestions[vm.questionIndex];
                $scope.$emit('playSound', { message: 'quiz-next' });
            }
            else {

                return false;
            }

        };




        vm.isReviewEnabled = function()
        {

            if(vm.hasMore == false && vm.markedQuestions.length != 0)
            {
                return true;
            }

            else {
                return false;
            }

        }


        vm.nextQuestion = function()
        {




             var answerIndex = parseInt($scope.$parent.base.getIndex(vm.providedAnswers, 'id', vm.activeQuestion.id));
             var markedIndex = parseInt($scope.$parent.base.getIndex(vm.markedQuestions, 'id', vm.activeQuestion.id));


             if(!vm.validAnswer() && (vm.activeQuestion.marked == undefined || vm.activeQuestion.marked == false) )
             {

               vm.ShowPulse = true;

               $scope.$emit('playSound', { message: 'error' });

                return false;

             }
             else if (vm.activeQuestion.marked == true)
             {
                // add to mark
                
                if(markedIndex == -1 && vm.reviewAll == false)
                {
                    vm.markedQuestions.push(vm.activeQuestion); 


                    
                    vm.ShowPulse = false;
                } 


                if(answerIndex != -1)
                {
                    vm.providedAnswers.splice(answerIndex, 1);
                    vm.ShowPulse = false;
                    
                }

             }

             else if ( (vm.validAnswer() ) && (vm.activeQuestion.marked == undefined || vm.activeQuestion.marked == false) )
             {
                          
               if(answerIndex == -1)
               {
                    vm.providedAnswers.push(vm.activeQuestion);
                    vm.ShowPulse = false;
                    
               }

               if(markedIndex != -1)
               {
                    
                    vm.markedQuestions.splice(markedIndex, 1);
                    vm.ShowPulse = false;
               }

             }


                vm.pushActivity(vm.questionIndex);

    			vm.questionIndex +=1;
	   		    vm.activeQuestion = vm.quizData.questions[vm.questionIndex];
    			vm.checkNextPre();

                $scope.$emit('playSound', { message: 'quiz-next' });

        }


        vm.preQuestion = function()
        {
            $scope.$emit('playSound', { message: 'quiz-prev' });
			vm.questionIndex -=1;
			vm.activeQuestion = vm.quizData.questions[vm.questionIndex];
			vm.checkNextPre();       	
        }

     	vm.checkNextPre = function()
        {

            if(vm.questionIndex == 0)
        	{
        		vm.hasPre = false;
        		vm.isLastQue = false;
        		vm.hasMore = true;
        	}
        	
        	else if( vm.questionIndex + 1 >= vm.quizData.questions.length + 1)
        	{
        		vm.hasMore = false;
                if(vm.markedQuestions.length == 0)
                {
                    vm.isLastQue = true;    
                }
        	}

        	else if (vm.questionIndex != 0)
        	{
        		vm.hasPre = true;		
        	}

        	else {

        	}

        	if (vm.questionIndex + 1 < vm.quizData.questions.length + 1)
        	{
        		vm.hasMore = true;
        		vm.isLastQue = false;
        	}


        };


        vm.checkNextPre();


        vm.getLeftDurationInSeconds = function()
        {

            if(localStorage.hasOwnProperty('lastStoredDurationSeconds') && !isNaN(localStorage.getItem('lastStoredDurationSeconds')))
            {
                 
                 return localStorage.getItem('lastStoredDurationSeconds');

            }

             return parseInt(vm.quizData.quiz[0].duration) * 60;


        };


        
       


        //vm.durationMins = parseInt(vm.quizData.quiz[0].duration);

        var durationSeconds = vm.getLeftDurationInSeconds();

        var startMinutes = (durationSeconds / 60) | 0;
        var startSeconds = (durationSeconds % 60) | '00';

        $scope.timeLeft = startMinutes+':'+startSeconds;


        


        vm.startTimer = function (duration) {

		// converting minutes to seconds
        /*
		duration =  duration * 60;       	
        */


        



	    var start = Date.now(),
	        diff,
	        minutes,
	        seconds;

		    function timer() {
		        // get the number of seconds that have elapsed since 
		        // startTimer() was called
		        diff = duration - (((Date.now() - start) / 1000) | 0);

		        // does the same job as parseInt truncates the float
		        minutes = (diff / 60) | 0;
		        seconds = (diff % 60) | 0;


                var leftDurationSec = (minutes * 60) + seconds;

                var percentLeft = Math.round(leftDurationSec / (parseInt(vm.quizData.quiz[0].duration) * 60) * 100);


                if(percentLeft >= 70)
                {
                    vm.TimeStatus = 'high';
                }
                else if (percentLeft >= 50)
                {
                    vm.TimeStatus = 'med';
                }
                else {
                    vm.TimeStatus = 'low';
                }


                localStorage.setItem('lastStoredDurationSeconds', leftDurationSec);



		        minutes = minutes < 10 ? "0" + minutes : minutes;
		        seconds = seconds < 10 ? "0" + seconds : seconds;

		        $scope.timeLeft = minutes + ":" + seconds; 


                
                

		       

		        if (diff <= 0) {

			      vm.timeexpiration = true;

			      vm.manageTimeOutSubmission();



			      return false;

		        }else {

		        vm.quizTimeInterval = $timeout(timer, 1000);

		        }
		    };

	    timer();
	    	 
		};

		    
		vm.startTimer(durationSeconds);



        vm.manageTimeOutSubmission = function()
        {

            

            vm.timeexpiration = true;


            $scope.$emit('playSound', { message: 'quiz-timeout' });


            /*
            1. no question were marked
            2. marked length is present
                2.a retian provided answer
                2.b set u/a for not attempted
            3   what if  

            */

            if(vm.markedQuestions.length == 0 && vm.providedAnswers.length == vm.quizData.quiz[0].noques)
            {
                /*
                
                ALL ATTEMPTED ZERO MARKED

                */
                vm.ansPrep();
            }
            else if(vm.markedQuestions.length == (vm.quizData.quiz[0].noques - vm.providedAnswers.length) && vm.providedAnswers.length != 0)
            {               
                
                /*
                SOME ATTEMPTED REMAINDER IN MARKED
                */
                vm.manageMarkedOnTimeOut();
            }

            else if (vm.markedQuestions.length == vm.quizData.quiz[0].noques && vm.providedAnswers.length == 0)
            {
                /*
                ALL MARKED BUT ZERO PROVIDED AS ANSWER
                */
                vm.manageMarkedOnTimeOut();
            }

            else if (vm.markedQuestions.length == 0 && vm.providedAnswers.length ==0)
            {
                
                /*
                
                ZERO ACTIVITY
                NOT MARKED
                NOT ASNWER

                */
                vm.manageNoActivtiyOnTimeOut();

            }

            else if (vm.markedQuestions.length == 0 && vm.providedAnswers.length != vm.quizData.quiz[0].noques)
            {
                /*                   
                    NO MARKED
                    SOME ANSWERED 
                    SOME PENDING
                */
                vm.managePartiallyAnsweredNoMarked();

            }

            else if (vm.markedQuestions.length != 0 && vm.providedAnswers.length != vm.quizData.quiz[0].noques)
            {

                /*
                most crucial
                SOME MARKED
                SOME ANSWERED
                SOME PENDING
                */

                vm.manageTimoutAllAspect();


            }

            else {


               
            }

            vm.endActivated = true;

        };


        vm.manageMarkedOnTimeOut = function()
        {
         
            for(var key in vm.markedQuestions)
            {
                    var item = vm.markedQuestions[key];
                    
                    if(item.answer == undefined)
                    {
                        // item property is set
                        item.answer = 'u/a';
                    }

                    vm.providedAnswers.push(item);
              
            }
            vm.ansPrep();      

        };

        vm.manageNoActivtiyOnTimeOut = function()
        {


            vm.quizData.questions;

            for(var key in vm.quizData.questions)
            {
                var item = vm.quizData.questions[key];
                item.answer = 'u/a';
                vm.providedAnswers.push(item);
                

            }


            vm.ansPrep();

        };


        vm.managePartiallyAnsweredNoMarked = function()
        {

            var answerQuestionIDCollection = [];

            /*
                getting all questions_id which has already been answered in array
            */


            for(var key in vm.providedAnswers)
            {
                var item = vm.providedAnswers[key];
                answerQuestionIDCollection.push(item.questionId);
            }

            

            for(var key in vm.quizData.questions)
            {
                var item = vm.quizData.questions[key];
                if(!answerQuestionIDCollection.includes(item.questionId))
                {
                    /*
                    if already in answers than we don't need to include them again
                    */
                    if(item.answer == undefined) 
                    {
                        item.answer = 'u/a'
                    }


                    vm.providedAnswers.push(item);
                }

                
            }

            vm.ansPrep();

        };



        vm.manageTimoutAllAspect = function()
        {


            for(var key in vm.markedQuestions)
            {
                    var item = vm.markedQuestions[key];
                    
                    if(item.answer == undefined)
                    {
                        // item property is set
                        item.answer = 'u/a';
                    }

                    vm.providedAnswers.push(item);
              
            }

            var answerQuestionIDCollection = [];

            /*
                getting all questions_id which has already been answered in array
            */


            for(var key in vm.providedAnswers)
            {
                var item = vm.providedAnswers[key];
                answerQuestionIDCollection.push(item.questionId);
            }


            for(var key in vm.quizData.questions)
            {
                var item = vm.quizData.questions[key];
                if(!answerQuestionIDCollection.includes(item.questionId))
                {
                    /*
                    if already in answers than we don't need to include them again
                    */
                    if(item.answer == undefined) 
                    {
                        item.answer = 'u/a';
                    }


                    vm.providedAnswers.push(item);
                }

                
            }

            vm.ansPrep();

        };


        vm.implodeSingleAnswer = function(answer)
        {
            if(typeof(answer) == "object")
                {

                    var tempArrOPtions = [];
                    for(var k in answer)
                    {
                        if(answer.hasOwnProperty(k))
                        {
                            if(answer[k] == true)
                            {
                                tempArrOPtions.push(k);
                            }
                        }
                    }
                    tempArrOPtions.sort();
                  return answer = tempArrOPtions.join(",");
                }

                return answer;
        }


        vm.pushActivity = function(lastIndex)
        {

             var tarQue = vm.quizData.questions[lastIndex] ;

            var pushPayload = {
                attempt_id : $stateParams.attempt_id,
                question_id : tarQue.questionId,
                answer : vm.implodeSingleAnswer(tarQue.answer),
                atype : (!vm.startReviewWizard) ? ((tarQue.marked) ? 'm' : 'a') : 'a',
                questionIndex: (!vm.startReviewWizard) ? lastIndex+1 : lastIndex+(vm.providedAnswers.length)
            };


         

         var pushUrl = API_URL+'recordActivity'; 

          $.ajax({
              type: "POST",
              url: pushUrl,
              data: pushPayload,
              dataType: 'json',
              success: function(res)
              {
                console.log('acivity pushed to server');
              }
              
         });


        };


        vm.launchLightbox = function(imgPath, imgCaption)
        {

            vm.lightBoxEnabled = true;

            console.log(imgPath);

            vm.fullImageSourceLink = imgPath;
            
            vm.fullImageTitle = imgCaption;

        };


        vm.closeLightBox = function()
        {

            vm.lightBoxEnabled = false;

        };


    }]);

})();

(function() {

    angular.module('io2v3').controller('quizcomplitedCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;



        console.log('quizcomplitedCtrl: activated');



        vm.attemptClose = function()
        {

        	var win = window.open("about:blank", "_self");


        	setTimeout(function(){

        		win.close();

        	}, 300);

            open(location, '_self').close();    
			

        };



    }]);

})();

(function() {

    angular.module('io2v3').controller('quizCtrl', ['API_URL', '$scope', '$http', function(API_URL, $scope, $http){


        var vm = this;


        console.log('quiz controller where is it');

        


    }]);

})();

(function() {

    angular.module('io2v3').controller('quizDlsCtrl', ['API_URL', '$scope', '$http', '$stateParams', 'quizPlayData', '$timeout', '$state', '$rootScope', function(API_URL, $scope, $http, $stateParams, quizPlayData, $timeout, $state, $rootScope){


        var vm = this;


        vm.timeexpiration = false;

        $scope.cachedImages = [];

        vm.quizData = quizPlayData.data;


        vm.lightBoxEnabled  = false;



        if(vm.quizData.imagesPreload.length != false)
        {

            $scope.imageLocations = vm.quizData.imagesPreload;

            var absoluteUrlPattern = new RegExp("^(http|https)://", "i");

            $scope.imageLocations.forEach(function(imageUrl) {



                imageUrl = decodeURIComponent(imageUrl);

                
                


                

                if(!absoluteUrlPattern.test(imageUrl))
                {

                   console.log(imageUrl + 'is absolute');
                   imageUrl = API_URL+imageUrl;
                }

                
                let imageUrlRequest = new Request(imageUrl);

                

                fetch(imageUrlRequest, {mode: 'no-cors'}).then(function(res) {


                        caches.open('quizImageCache').then(function(cache) {

                            cache.put(imageUrlRequest, res.clone());

                        });


                }).catch(function(erro) {

                    console.log(error);

                });


            });    
         
        }




        vm.optionhasImage = function(optionsSTring)
        {
            myRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg))/i
            return myRegex.test(optionsSTring);
        };



        

        vm.entityLogo = function()
        {


            if(vm.quizData.entityLogo[0].logo)
            {
                return API_URL+vm.quizData.entityLogo[0].logo;
            }

            else {
                return 'assets/images/iSkillMetrics-logo.svg';
            }


        };


        /*

        if(vm.quizData.action != undefined && vm.quizData.action == 'redirect')
        {
            
          return $state.go('onExamRefresh', {'quiz_id': $stateParams.quiz_id, 'attempt_id': $stateParams.attempt_id});

        }

        */



        /*  
        commit broadcast api not working in safari
        const channel = new BroadcastChannel('sw-idxsaved');        
        */


        vm.returnFormattedAnswer = function(answer)
        {

            vm.payloadAnswers = [];
    
                
                if(typeof(answer) == "object")
                {

                    var tempArrOPtions = [];
                    for(var k in answer)
                    {
                        if(answer.hasOwnProperty(k))
                        {
                            if(answer[k] == true)
                            {
                                tempArrOPtions.push(k);
                            }
                        }
                    }
                    tempArrOPtions.sort();
                    answer = tempArrOPtions.join(",");

                    return answer;
                }

                else {
                    return answer;
                }
                
           
         };



        vm.closeCurrentWindow = function() {
         
            console.log('attempt to close window');

            console.log(window.quizWindow);


            if(window.quizWindow != undefined)
            {
               console.log('quiz window attached to root');
               window.quizWindow.close();
            }

            else {

                console.log('redirect compilted page');
                    
                $state.go('quizcomplited');

            }      

        };



        vm.levels = ['easy', 'medium', 'difficult'];

        vm.activeLevel = vm.levels[0];

        vm.questionIndex = 0;

        vm.currentSubjectIndex = 0;

        vm.quiz = vm.quizData.quiz;

        vm.endOfSubjects = false;

        vm.diffDirection = 0;

        vm.endActivated = false;

        vm.endProcessActivated = false;

        vm.TimeStatus = 'high';

        /*
        vm.stream.collections[vm.currentSubjectName].composite['medium'].length != 0
        */

        vm.requiredQuestions = parseInt(vm.quiz.noques);

        /*

        vm.stream = $scope.$parent.base.inboundDecode(vm.quizData.stream);

        */

        vm.stream = vm.quizData.stream;

        vm.quiz.noques;

        vm.switchFrequency = 1;

        vm.mainNext = false;


     
        vm.noSubjects = vm.stream.distribution.length;
        

        vm.currentSubjectName =  vm.stream.distribution[vm.currentSubjectIndex].subjects;


        /*
        console.log(vm.stream.distribution);
        console.log(vm.stream.collections);
        console.log(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel]);
        */


        vm.startReviewWizard = false;

        vm.reviewAll = false;


        vm.startReviewAll = function()
        {

            vm.reviewAll = true;

            vm.questionIndex = 0;

        }


        vm.revNext = function()
        {

           
           if(vm.questionIndex + 1 < vm.quiz.noques)
           {
              vm.pushAnswerToActivity();
              vm.questionIndex += 1;   


           }

           else {

            vm.pushAnswerToActivity();
            vm.triggerProcessEndQuiz();

           }


        };


        vm.questions = [];

        /*

        methods 

        vm.initializeQuestions();
        vm.prepareSubjectPerformanceIndicatorProperties();
        vm.primaryNextProcedure();
        vm.subjectProcedure();
        vm.difficultyProcedure();
        vm.difficultySwitcher();
        vm.levelSwitchCheckpoint();
        vm.markSubjectAnswered();
        vm.pushIndicator();
        vm.validAnswer();



        */


        vm.initializeQuestions = function()
        {

            console.log('question inint subject ' + vm.currentSubjectName + ' difflevel ' + vm.activeLevel);

            var currentQuestions = vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel][0];
            vm.questions.push(currentQuestions);
            vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].splice(0, 1);

             console.log('stampAnswer' + currentQuestions.stamp);

            vm.mainNext = true;

        };


        vm.questionAvailableInCurrentDifficultyLevel = function()
        {


            console.log('questions available diff intercept' + vm.diffDirection + vm.activeLevel);


            if(vm.diffDirection == 1)
            {
                
                // upgrade

                if(vm.activeLevel == 'medium')
                {

                    
                    if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length != 0)
                    {
                        
                        vm.activeLevel = 'medium';

                    }   

                    else if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length == 0 && vm.stream.collections[vm.currentSubjectName].composite['difficult'].length != 0)
                    {

                         console.log('Updrade : no question in medium skiped to difficult');
                         vm.activeLevel = 'difficult';

                    }

                    else if (vm.stream.collections[vm.currentSubjectName].composite['easy'].length != 0)
                    {

                         console.log('upgrade but downn graded to easy no question is medium and diffult');

                    }

                    else {

                        console.log('upgrade : unknown condition');

                    }

                }

                

                else if(vm.activeLevel == 'difficult')
                {
                   

                   console.log('intercept from diffcult');
                   
                  if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length != 0)
                  {
                        vm.activeLevel = 'difficult';
                  }      
                   else if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length == 0 && vm.stream.collections[vm.currentSubjectName].composite['medium'].length != 0)
                   {
                        vm.activeLevel = 'medium';
                        console.log('upgrade : but downgrading to medium no questions remain in difficult');
                   }     

                   else if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length == 0 && vm.stream.collections[vm.currentSubjectName].composite['medium'].length == 0 && vm.stream.collections[vm.currentSubjectName].composite['easy'].length != 0)
                   {
                        vm.activeLevel = 'easy';
                        console.log('upgrade : but switched to easy no question in med or difficult');
                   }


                }




            }    
            else if (vm.diffDirection == -1) 
            {
                
                // downgrade

                if(vm.activeLevel == 'medium')
                {

                  if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length != 0)
                  {
                        vm.activeLevel = 'medium';
                  }

                  else if(vm.stream.collections[vm.currentSubjectName].composite['easy'].length != 0)
                  {
                        vm.activeLevel = 'easy'; 
                        console.log('downgrade : switched from med to easy no question available in')
                  }

                  else {

                        vm.activeLevel = 'dificult';
                        console.log('downgrade : switched from med to difficult no question available in medium or easy');

                  }



                }

                else if(vm.activeLevel == 'easy')
                {

                  if(vm.stream.collections[vm.currentSubjectName].composite[vm.activeLevel].length != 0)
                  {
                        vm.activeLevel = 'easy';
                  }

                  else if(vm.stream.collections[vm.currentSubjectName].composite['medium'].length != 0)
                  {
                        vm.activeLevel = 'medium';
                  }

                  else {

                        vm.activeLevel = 'difficult';

                  }



                }


            }

            else if (vm.diffDirection == 0)
            {

                // stay at current level


                if(vm.activeLevel == 'easy')
                {

                  if(vm.stream.collections[vm.currentSubjectName].composite['easy'].length != 0)
                  {
                        vm.activeLevel = 'easy';
                  }

                  else if(vm.stream.collections[vm.currentSubjectName].composite['medium'].length != 0)
                  {
                        vm.activeLevel = 'medium';
                  }

                  else {

                    vm.activeLevel = 'difficult';

                  }

                }

                else if(vm.activeLevel == 'medium')
                {


                  if(vm.stream.collections[vm.currentSubjectName].composite['medium'].length != 0)
                  {
                        vm.activeLevel = 'medium';
                  }

                  else if(vm.stream.collections[vm.currentSubjectName].composite['difficult'].length != 0)
                  {
                        vm.activeLevel = 'difficult';
                  }
                  else {

                    vm.activeLevel = 'easy';

                  }



                }

                else if(vm.activeLevel == 'difficult')
                {
                  
                  if(vm.stream.collections[vm.currentSubjectName].composite['difficult'].length != 0)
                  {
                        vm.activeLevel = 'difficult';
                  }

                  else if (vm.stream.collections[vm.currentSubjectName].composite['medium'].length != 0)
                  {
                       vm.activeLevel = 'medium';
                  }

                  else {

                    vm.activeLevel = 'easy';

                  }


                }


            }



        };



        vm.initializeQuestions();

        



        vm.prepareSubjectPerformanceIndicatorProperties = function()
        {
            for (var i = 0;  i < vm.noSubjects; i++) {
            vm.stream.distribution[i].PerformanceIndicator = {

                easy : [],
                medium : [],
                difficult : []
            };
            
        }

        };

        vm.prepareSubjectPerformanceIndicatorProperties();


        vm.pushAnswerToActivity = function()
        {

          var currentIndex = vm.questionIndex;

          var tarQue = vm.questions[currentIndex];

          var formattedAnswer = vm.returnFormattedAnswer(tarQue.answer);

          
            var pushPayload = {
                attempt_id : $stateParams.attempt_id,
                question_id : tarQue.questionId,
                answer : formattedAnswer,
                atype : 'a',
                questionIndex: (++currentIndex)
            };


        
          console.log(pushPayload);


          var pushUrl = API_URL+'recordActivity'; 

          $.ajax({
              type: "POST",
              url: pushUrl,
              data: pushPayload,
              dataType: 'json',
              success: function(res)
              {
                console.log('activity logged to server');
              }
              
         });



        };




        vm.primaryNextProcedure = function ()
        {
          
          
           if(vm.validAnswer() && vm.questions[vm.questionIndex].answer != null)
           {
                

                vm.mainNext = false;


                console.log(vm.questions[vm.questionIndex].answer);
                vm.markSubjectAnswered();

                if(vm.questions.length < vm.quiz.noques)
                {

                    vm.pushIndicator();

                    vm.difficultyProcedure();

                    vm.questionAvailableInCurrentDifficultyLevel();      

                    vm.initializeQuestions();

                    console.log('push activity checkpoint');

                    vm.pushAnswerToActivity();

                    vm.questionIndex += 1;


                    

                }

                else if (vm.questions.length == vm.quiz.noques)
                {

                  vm.pushAnswerToActivity();
                    
                    vm.endActivated = true;
                }

           }

           else {
                    

                    console.log('invalid attempt');

           }

           

        };


        vm.subjectProcedure = function()
        {

            

            console.log('called subject procedure');

            if(vm.currentSubjectIndex + 1 < vm.noSubjects )
            {
                vm.currentSubjectIndex += 1;
            }

            else {
                vm.endOfSubjects = true;
            }


            vm.currentSubjectName =  vm.stream.distribution[vm.currentSubjectIndex].subjects;

        };


        vm.difficultyProcedure = function()
        {

               var levelAction = vm.levelSwitchCheckpoint(vm.switchFrequency);
               vm.difficultySwitcher(levelAction);

               if(vm.stream.distribution[vm.currentSubjectIndex].subjectOverloaded || vm.endOfSubjects)
                {
                    vm.subjectProcedure();
                }
   
                
        };


        vm.difficultySwitcher = function(levelAction)
        {


            if(levelAction === 1)
            {
                // upgrade 

                vm.diffDirection = 1;

                console.log('difficulty detected');


                if(vm.activeLevel == 'easy')
                {
                    console.log('upgraded to medium from easy');
                    vm.activeLevel = 'medium';
                }

                else if (vm.activeLevel == 'medium')
                {   
                    console.log('upgraded to difficult from medium');
                    vm.activeLevel = 'difficult';
                } 

                else {

                    console.log('upgrade already at difficult level');

                }

                

            }

            else if (levelAction === -1)
            {

                // downgrade levels

                vm.diffDirection = -1;

                console.log('Downgrade deteced from' + vm.activeLevel);

                if(vm.activeLevel == 'difficult')
                {

                    console.log('downgraded to medium from difficult');    

                    vm.activeLevel = 'medium';
                }

                else if (vm.activeLevel == 'medium')
                {
                     vm.activeLevel = 'easy';
                     console.log('downgraded to easy from medium');
                }

                else 
                {
                    console.log('downgraded already at easy');
                    vm.activeLevel = 'easy';
                }
                
            }

            else if (levelAction === 0)
            {
                // no change in levels
                console.log('no change in difficulty action level :  ' + levelAction);
                vm.diffDirection = 0;
            }


        };


        vm.levelSwitchCheckpoint = function(frequency)
        {

            /*
                get the lenght of items in indicators 
            */  

            var activeLevel = vm.activeLevel;
            var indicatorLength = vm.stream.distribution[vm.currentSubjectIndex].PerformanceIndicator[activeLevel].length;  

            console.log(vm.stream.distribution[vm.currentSubjectIndex].PerformanceIndicator);

            console.log('inicator length' + indicatorLength);

            if(indicatorLength >= frequency )
            {
                
                console.log('indicator length' + indicatorLength);

                var slicedFreqArray = vm.stream.distribution[vm.currentSubjectIndex].PerformanceIndicator[activeLevel].slice(-(frequency));


                var indicatoryOutput = slicedFreqArray.reduce((a, b) => a + b, 0);

                if(indicatoryOutput == frequency)
                {
                    
                    return 1;

                }
                else {

                    return -1;

                }
            }
            else {

                return 0;

            }



        };



        vm.markSubjectAnswered = function()
        {

            var queRequiredPerSubject = parseInt(vm.stream.distribution[vm.currentSubjectIndex].quePerSection);


            if(vm.stream.distribution[vm.currentSubjectIndex].answered == undefined)
            {
                vm.stream.distribution[vm.currentSubjectIndex].answered = 1;   
            }
            else if( queRequiredPerSubject > parseInt(vm.stream.distribution[vm.currentSubjectIndex].answered) ) {

                vm.stream.distribution[vm.currentSubjectIndex].answered += 1;
            }
            else {}


            if (queRequiredPerSubject == parseInt(vm.stream.distribution[vm.currentSubjectIndex].answered)) {
                
                vm.stream.distribution[vm.currentSubjectIndex].subjectOverloaded = true;

                console.log('subject overloaded');
                
            }


        };


        





        vm.pushIndicator = function()
        {
           

                var proivdedAnswer = vm.returnFormattedAnswer(vm.questions[vm.questionIndex].answer);

                var Indicator = (proivdedAnswer == vm.questions[vm.questionIndex].stamp) ? 1 : 0;

                console.log('provided Answer :' + proivdedAnswer);

                console.log('correct answer :' +  vm.questions[vm.questionIndex].stamp);

                var activeLevel = vm.activeLevel              

                vm.stream.distribution[vm.currentSubjectIndex].PerformanceIndicator[activeLevel].push(Indicator);

                if(Indicator)
                {
                    console.log('correct response answer');
                }

                else {

                    console.log('incorrect response answer');

                }

            
        };



        vm.validAnswer = function()
         {


            if(vm.questions[vm.questionIndex].answer == undefined)
            {                   
                
                return false;
            }

            else if (typeof(vm.questions[vm.questionIndex].answer) === 'object')
            {
                
                for(var key in vm.questions[vm.questionIndex].answer)
                {
                    if(vm.questions[vm.questionIndex].answer.hasOwnProperty(key))
                    {
                        if(vm.questions[vm.questionIndex].answer[key] == true)
                        {
                            return true;   
                        }
                    }
                }
                return false;
            }

            else if (vm.questions[vm.questionIndex].answer == "")
            {
                return false;
            }

            else {

                return true;

            }

         };


         vm.triggerProcessEndQuiz = function()
         {


            vm.endProcessActivated = true;

            vm.buildPayloadSanitizeAnswers();

            vm.save();


            if(localStorage.hasOwnProperty('lastStoredDurationSeconds'))
            {
               localStorage.removeItem('lastStoredDurationSeconds');         
            }


         };


        vm.buildPayloadSanitizeAnswers = function()
        {
            
            
            vm.payloadAnswers = [];

            var attempt_id = $stateParams.attempt_id;

            for(var key in vm.questions)
            {             
                
                var answer = vm.questions[key].answer;
                if(typeof(answer) == "object")
                {

                    var tempArrOPtions = [];
                    for(var k in answer)
                    {
                        if(answer.hasOwnProperty(k))
                        {
                            if(answer[k] == true)
                            {
                                tempArrOPtions.push(k);
                            }
                        }
                    }
                    tempArrOPtions.sort();
                    answer = tempArrOPtions.join(",");
                }

                else if(answer == undefined)
                {
                    answer = 'u/a';   
                }
                
                var tempObj = {
                        "attempt_id" : attempt_id,
                        "question_id" : vm.questions[key].questionId,
                        "answer" : answer
                }

                vm.payloadAnswers.push(tempObj);

            }

        }


        vm.triggerBackgroundSync = function(payload)
        {

            var swPost = {
                 'form_data': payload
              };
      
            navigator.serviceWorker.controller.postMessage(swPost);

            /*  

            channel.addEventListener('message', event => {

            if(event.data.status == 1 && window.cachedRegisterSW != undefined)
            {
                 window.cachedRegisterSW.sync.register('exam');
            }

            });

            */

            navigator.serviceWorker.addEventListener('message', event => {

            if(event.data.status == 1 && window.cachedRegisterSW != undefined)
                {
                    window.cachedRegisterSW.sync.register('exam');
                }
                        
            });

        };


        vm.save = function()
        {

            var answerSaveUrl = API_URL+'std-patch-answers';

            $timeout.cancel(vm.quizTimeInterval);



            var timeLeft = localStorage.getItem('lastStoredDurationSeconds');

            var endState = (vm.timeexpiration) ? 'timeout' : 'explicit';


            vm.quizMeta = {"endState" : endState,  "timeLeft" : timeLeft};

            


            vm.idbPayload = {
            "url" : answerSaveUrl,
            "method": 'POST',
            "data" : {'answers' : vm.payloadAnswers, 'quizMeta' : vm.quizMeta}
            };


            $http(vm.idbPayload).then(
                function(res){
                                    
                    /*
                    $state.go('std.exams');
                    */

                    vm.closeCurrentWindow();


                }, 

                function(res){

                  if(res.status < 1)
                  {

                    vm.idbPayload.data.quizMeta.endState = 'Network Lost';
                    vm.triggerBackgroundSync(vm.idbPayload);

                  }

                    vm.closeCurrentWindow();  


                });

        };


        vm.getLeftDurationInSeconds = function()
        {

            if(localStorage.hasOwnProperty('lastStoredDurationSeconds') && !isNaN(localStorage.getItem('lastStoredDurationSeconds')))
            {
                 
                 return localStorage.getItem('lastStoredDurationSeconds');

            }

             return parseInt(vm.quiz.duration) * 60;


        };


        
       


        //vm.durationMins = parseInt(vm.quizData.quiz[0].duration);

        var durationSeconds = vm.getLeftDurationInSeconds();

        var startMinutes = (durationSeconds / 60) | 0;
        var startSeconds = (durationSeconds % 60) | '00';

        $scope.timeLeft = startMinutes+':'+startSeconds;


        


        vm.startTimer = function (duration) {

        // converting minutes to seconds
        /*
        duration =  duration * 60;          
        */

        var start = Date.now(),
            diff,
            minutes,
            seconds;

            function timer() {
                // get the number of seconds that have elapsed since 
                // startTimer() was called
                diff = duration - (((Date.now() - start) / 1000) | 0);

                // does the same job as parseInt truncates the float
                minutes = (diff / 60) | 0;
                seconds = (diff % 60) | 0;


                var leftDurationSec = (minutes * 60) + seconds;

                var percentLeft = Math.round(leftDurationSec / (parseInt(vm.quiz.duration) * 60) * 100);


                if(percentLeft >= 70)
                {
                    vm.TimeStatus = 'high';
                }
                else if (percentLeft >= 50)
                {
                    vm.TimeStatus = 'med';
                }
                else {
                    vm.TimeStatus = 'low';
                }


                localStorage.setItem('lastStoredDurationSeconds', leftDurationSec);

                minutes = minutes < 10 ? "0" + minutes : minutes;

                seconds = seconds < 10 ? "0" + seconds : seconds;

                $scope.timeLeft = minutes + ":" + seconds; 


               

                if (diff <= 0) {

                  vm.timeexpiration = true;

                  vm.manageTimeOutSubmission();

                  return false;

                }else {

                vm.quizTimeInterval = $timeout(timer, 1000);

                }
            };

        timer();
             
        };

        vm.startTimer(durationSeconds);


        vm.manageTimeOutSubmission = function()
        {
             
             vm.triggerProcessEndQuiz();        

        };

        vm.launchLightbox = function(imgPath, imgCaption)
        {

            vm.lightBoxEnabled = true;

            console.log(imgPath);

            vm.fullImageSourceLink = imgPath;
            
            vm.fullImageTitle = imgCaption;

        };


        vm.closeLightBox = function()
        {

            vm.lightBoxEnabled = false;

        };



    }]);

})();

(function() {

    angular.module('io2v3').controller('quizProgressCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;
        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = vm.examID;

        
        vm.loadStatus = null;

        $scope.$parent.exAbs.pageHeading = "Progress Details";


        vm.activeId = false;



        vm.enableScoreCard = false;
        vm.scoreLoading = null;
        vm.dualColumnEnabled = false;


        vm.enabledScoreUpdateId = false;



        vm.answerEnabled = false;

        vm.answerLoading = null;


        vm.dataList = null;


        vm.loadPrimaryData = function()
        {


             var progressUrl = API_URL+'quiz/progress/'+vm.examID;

             $http.get(progressUrl).then(

            function(res){
                
                vm.loadStatus = true;
                vm.dataList = res.data;

            }, 

            function(res){

                vm.loadStatus = false;              

            });

        };


        vm.loadPrimaryData();



          vm.activateScoreCard = function(attempt_id)
          {



             // deactivate ansswers

            vm.answerEnabled = false;
            vm.activeId = false;
            vm.answerLoading = null;   

            vm.answerDataList = null;


            vm.enableScoreCard = true;

            vm.scoreLoading = null;

            vm.activeId = attempt_id;

            vm.examID;    

            var scoreCardUrl = API_URL+'quiz/scorecard/'+vm.examID+'/'+attempt_id;

            vm.dualColumnEnabled = true;

            $http.get(scoreCardUrl).then(
            
            function(res){
               
                

                vm.scoreLoading = true;
                vm.scoreCard = res.data;

            }, 


            function(res){


              vm.scoreLoading = false;      


            });



          };

          vm.disableScoreCard = function()
          {

            vm.enableScoreCard = false;                
            vm.activeId = false;
            vm.scoreCard = false;
            vm.dualColumnEnabled = false;

          };


          vm.activateAnswers = function(attempt_id)
          {

            vm.enableScoreCard = false;
            vm.scoreCard = false;

            vm.dualColumnEnabled = true;


            vm.answerEnabled = true;


            vm.answerLoading = null;

            vm.answerDataList = null;


            vm.activeId = attempt_id;
            vm.examID;    


            var answerUrl = API_URL+'quiz/inspectanswers/'+vm.examID+'/'+attempt_id;


            $http.get(answerUrl).then(

            function(res){

                console.log(res);

                vm.answerDataList = res.data;
                
                vm.answerLoading = true;


            }, 

            function(res){
                
                vm.answerLoading = false;



            });



            vm.markPayload = [];

            vm.checkForDuplicates = function(sourceCollections, incommingData)
                {

                    var answerId = incommingData.id;
                    var typeIncoming = incommingData.type;



                    for(key in sourceCollections)
                    {

                        if(sourceCollections[key].id == answerId && sourceCollections[key].type == typeIncoming)
                        {
                            return 1;
                        }

                        else if(sourceCollections[key].id == answerId && sourceCollections[key].type != typeIncoming){

                            return 2;
                        }

                    }

                    return 0;

                };

            
            

            vm.markForUpdates = function(type, answerId, questionId)
            {


                var answerListIndex = $scope.$parent.base.getIndex(vm.answerDataList.answers, 'answerId', answerId);
                var currentPayload = {'attempt_id': vm.activeId, 'id' : answerId, que_id : questionId, type : type};

                if(vm.markPayload.length == 0)
                {
                    vm.markPayload.push(currentPayload);              
                    vm.answerDataList.answers[answerListIndex]['markedStatus'] = type;
                    
                }

                else if(vm.checkForDuplicates(vm.markPayload, currentPayload) == 0)
                {
                    vm.markPayload.push(currentPayload);
                    vm.answerDataList.answers[answerListIndex]['markedStatus'] = type;
                }

                else if (vm.checkForDuplicates(vm.markPayload, currentPayload) == 1)
                {
                    
                    var idx = $scope.$parent.base.getIndex(vm.markPayload, 'id', answerId);
                    vm.markPayload.splice(idx, 1); 
                    vm.answerDataList.answers[answerListIndex]['markedStatus'] = null;
                    
                }

                else if(vm.checkForDuplicates(vm.markPayload, currentPayload) == 2)
                {
                    
                    var idx = $scope.$parent.base.getIndex(vm.markPayload, 'id', answerId);   
                    vm.markPayload[idx] = currentPayload;
                    vm.answerDataList.answers[answerListIndex]['markedStatus'] = type;
                    
                }

            };

          };




          vm.processMarkedAnswers = function()
          {


            vm.activeId;

            var processUrl = API_URL+'markandudpateanswers/'+vm.activeId;




            $http({

                url : processUrl,
                method: 'POST',
                data : {'dataMarkedPayload': vm.markPayload}

            }).then(

            function(res){

                console.log('this is the success call');

                vm.activeId = false;
                vm.enableScoreCard = false;                        
                vm.scoreCard = false;
                vm.dualColumnEnabled = false;
                vm.markPayload = [];


                vm.answerEnabled = false;
                vm.answerLoading = null;
                vm.dataList = null;

                vm.enabledScoreUpdateId = false;


                vm.loadPrimaryData();



            }, 

            function(res){


                console.log('the error call');


            });





          };



          vm.deactivateAnswers = function()
          {


            vm.dualColumnEnabled = false;
            vm.answerEnabled = false;
            vm.activeId = false;


            vm.answerLoading = null;



          };


         vm.enableScoreMatrix = function(attemptId)
        {
            vm.enabledScoreUpdateId  = attemptId;
        };


        vm.deactivateMarkUpdateMode = function()
        {
            vm.enabledScoreUpdateId  = false;
            vm.markPayload = [];

        };



          vm.attemptRecover = function(attempt_id)
          {




            var recoveryUrl = API_URL+'quiz/progress/recoverviaactivity/'+attempt_id;
            var idx = $scope.$parent.base.getIndex(vm.dataList.attempted, 'attemptId', attempt_id);

            

            $http.put(recoveryUrl).then(

            function(res){

                

                vm.dataList.attempted[idx] = res.data.progress[0];


            }, 

            function(res){
                
                var notify = {
                        type: 'error',
                        title: 'Recovery Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


            });

          };


          vm.generatePDF = function(attemptId)
          {


            /*
            window.open(API_URL+'scorecard-pdf/'+vm.examID+'/'+attemptId, '_blank', '');
            */
            
            
            /*
            scorecard-pdf/156/706
            */

            function showFile(blob){
              // It is necessary to create a new blob object with mime-type explicitly set
              // otherwise only Chrome works like it should
              var newBlob = new Blob([blob], {type: "application/pdf"})

              // IE doesn't allow using a blob object directly as link href
              // instead it is necessary to use msSaveOrOpenBlob
              if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
              } 

              // For other browsers: 
              // Create a link pointing to the ObjectURL containing the blob.
              const data = window.URL.createObjectURL(newBlob);
              var link = document.createElement('a');
              link.href = data;

              var filename = 'scorecard-'+vm.examID+'-'+attemptId+'.pdf';

              link.download=filename;
              link.click();
              setTimeout(function(){
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
              }, 100);
}


            var successPDF = function(res)
            {

                res.data.blob();

                showFile();

            };

            var errorPDF = function(res)
            {

            };

            /*

            $http({
                url : API_URL+'scorecard-pdf/'+vm.examID+'/'+attemptId,
                method : 'GET',
                responsetype: 'arraybuffer',
                headers: {'content-type': 'application/pdf; charset=utf-8'}
            }).then(successPDF, errorPDF);

            */

            var authToken = 'ddx';


            if(localStorage.auth_token)
            {
               authToken = localStorage.auth_token;
            }

             
            var url = API_URL+'scorecard-pdf/'+vm.examID+'/'+attemptId;
            var options = {
            method: 'POST',
            headers: new Headers({'content-type': 'application/pdf; charset=utf-8', 'token': authToken}),
            };


            fetch(url, options)
            .then(r => r.blob())
            .then(showFile)


          };



    }]);

})();

(function() {

    angular.module('io2v3').controller('quizQuestionsCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;


        vm.enableAllocate = false;

        $scope.$parent.exAbs.pageHeading = "Allocated Questions";


        vm.enableSynchronize = false;


        vm.loading = null;

        

        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = $stateParams.examID;
        var Questionsurl = API_URL+'quiz-questions/'+vm.examID;



        vm.toggleqqStatus = function(itemId, qqStatus, subject_id)
        {



            var idx = $scope.$parent.base.getIndex(vm.dataList.questions, 'id', itemId);

            var row = vm.dataList.questions[idx];


            console.log(row);

            
            var qqStatusToggleUrl = API_URL+'quiz-question-status-toggle/'+vm.examID+'/'+subject_id;

            $http({

                url : qqStatusToggleUrl,
                method: 'PUT',
                data : {status: qqStatus, qqId: itemId}

            }).then(

                function(res) {

                    if(qqStatus == 0)
                    {
                        vm.syncCheck();    
                    }

                }, function(res){

                    var notify = {
                        type: 'error',
                        title: 'Weight Distributon Violation : ' + res.data.subject,
                        content: res.data.message,
                        timeout: 8000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    row.qqStatus = (res.data.toggleRequest) ? "0" : "1";


            });



        };



        vm.fetchQuestionList = function()
        {

        	function successFetchQuestions(res)
	        {
	        	
	        	vm.dataList = res.data;
	        	vm.enableAllocate = false;

                vm.loading = true;

                if(vm.dataList.questions.length > 0 && vm.dataList.questions != undefined)
                {
                    vm.syncCheck();
                }


                var expiredQuestion =  parseInt(vm.dataList.threshold.expired);
                var quizThreshold = parseInt(vm.dataList.threshold.threshold);

                $scope.threshold = quizThreshold;
                $scope.Globalthreshold = parseInt(vm.dataList.globalThreshold);
                $scope.gThresholdCount =  parseInt(vm.dataList.gThresholdCount);


                if(expiredQuestion > 0)
                {

                    var notify = {
                    type: 'warning',
                    title: 'Threshold Limit',
                    content: 'Quiz threshold of ' + quizThreshold + ' reached by ' + expiredQuestion + ' questions, disable and use lower limit',
                    timeout: 16000 //time in ms
                };
            
                 $scope.$emit('notify', notify);

                }


                if($scope.gThresholdCount > 0)
                {

                    var notify = {
                    type: 'warning',
                    title: 'Global Threshold Limit',
                    content: 'Global threshold of ' + $scope.Globalthreshold + ' reached by ' + $scope.gThresholdCount + ' questions, disable and use lower limit',
                    timeout: 16000 //time in ms
                };
            
                 $scope.$emit('notify', notify);          

                }

	        }

	        function errorFetchQuestion(res)
	        {
	        	

	        	vm.enableAllocate = true;

                vm.loading = false;
	        }

	        $http.get(Questionsurl).then(successFetchQuestions, errorFetchQuestion);

        };



        vm.allocateQuestions = function()
        {

        	var allocateQuestionUrl = API_URL+'quiz-question-allocate/'+vm.examID;

        	function allocateSuccess(res)
        	{
        		
    			 var notify = {
                    type: 'success',
                    title: 'Question Allocated',
                    content: res.data.message,
                    timeout: 5000 //time in ms
                };
    		

        		 $scope.$emit('notify', notify);

        		vm.fetchQuestionList();

        	}

        	function allocateError(res)
        	{

        		 var notify = {
                    type: 'error',
                    title: 'Question Allocation',
                    content: res.data.message,
                    timeout: 5000 //time in ms
                };
    		

        		 $scope.$emit('notify', notify);


        	}


        	$http.post(allocateQuestionUrl).then(allocateSuccess, allocateError);


        };


        vm.syncCheck = function()
        {

            var synCheckUrl = API_URL+'newquestion-available/'+vm.examID;


            $http.get(synCheckUrl).then(function(res){

                

                if(res.status == 200)
                {
                    
                    console.log('matched matched mated');

                    vm.enableSynchronize = true;


                    vm.syncPayload = {

                        "quiz_id" : vm.examID,
                        "queIDs" : res.data.queIDs
                    }


                     var notify = {
                    type: 'info',
                    title: 'Synchronize Alert',
                    content: res.data.message,
                    timeout: 5000 //time in ms
                    };
            
                 $scope.$emit('notify', notify);

                }

            }, function(res) {


                var notify = {
                    type: 'error',
                    title: 'Synchronize Error',
                    content: res.data.message,
                    timeout: 5000 //time in ms
                    };
            
                 $scope.$emit('notify', notify);



            } );


        };


        vm.fetchQuestionList();


        vm.processDoSyncronize = function()
        {

            var doSynUrl = API_URL+'quiz-question-sycnronize';

            $http({

                url : doSynUrl,
                method : 'POST',
                data : vm.syncPayload
            }).then(syncSuccess, syncError);



            function syncSuccess(res)
            {
                console.log(res.data);

                if(res.data.newQuestions != undefined)
                {

                    for(var i=0; i <= res.data.newQuestions.length-1; i++)
                    {
                        vm.dataList.questions.push(res.data.newQuestions[i]);
                    }

                    vm.enableSynchronize = false;

                      var notify = {
                    type: 'success',
                    title: 'Synchronize Status',
                    content: res.data.message,
                    timeout: 5000 //time in ms
                    };
            
                     $scope.$emit('notify', notify);

                }
            }

            function syncError(res)
            {
                console.log(res.data);
            }

        };



    }]);

})();

(function() {

    angular.module('io2v3').controller('quizScoreCardCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;



        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = vm.examID;

        var attempt_id = $stateParams.attemptID;

        $scope.$parent.exAbs.pageHeading = "Scorecard";    

        var scoreCardUrl = API_URL+'quiz/scorecard/'+vm.examID+'/'+attempt_id;



        $http.get(scoreCardUrl).then(
        	
        	function(res){

        		vm.dataList = res.data;

        	}, 


        	function(res){

        	});

        


    }]);

})();

(function() {

    angular.module('io2v3').controller('quizWeightDistroCtrl', ['API_URL', '$scope', '$http', '$stateParams', 'quizDataService', function(API_URL, $scope, $http, $stateParams, quizDataService){


        var vm = this;

        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = vm.examID;
        vm.loadProgress = null;
        vm.Qtotal  = 0;
        vm.pointsTotal = 0;
        vm.weightTotal = 0;

        // the distro information


        $scope.$parent.exAbs.pageHeading = "Weight Distribution";


        quizDataService.getMasterQuiz(vm.examID).then(
	    	function(res){
	    		console.log(res);
	    		vm.Quiz = res.data.quiz[0];
	    		vm.Distro = res.data.quizBaseDistro;
	    		vm.getTotal();	

	    	}, 

	    	function(res){

	    		console.log(res);

  	    		vm.loadProgress = false;

	        });

      	  vm.getTotal =  function()
      	  {


      	  	vm.Qtotal  = 0;
      	  	vm.pointsTotal = 0;
      	  	vm.weightTotal = 0;

      	  	for(var property  in vm.Distro)
      	  	{
      	  		if(vm.Distro.hasOwnProperty(property))
      	  		{
      	  			var item = vm.Distro[property];




       	  			

                if(parseInt(item.quePerSection) > parseInt(item.questions))
                {

                  /*

                  revert when value is greater on change only

                  */  

                  // item.quePerSection = parseInt(item.questions);

                }


                vm.Qtotal += parseInt(item.quePerSection);


      	  			vm.pointsTotal += parseFloat(item.points);     	  			
      	  			if(parseFloat(item.weight) !== parseFloat(item.weight))
      	  			{
      	  					
                    item.weight = (item.points / vm.Quiz.maxScore) * 100;
      	  					vm.weightTotal += item.weight;
      	  			}
      	  			else {

       	  		    item.weight = (item.points / vm.Quiz.maxScore) * 100;
                  vm.weightTotal += item.weight;

      	  			}

                console.log(item.weight);



      	  		}



      	  	}


            vm.loadProgress = true;


            vm.verifyDistribution();

      	  }



          vm.verifyDistribution = function()
          {


            if(vm.Qtotal != vm.Quiz.noques)
            {
             
              vm.validDistro = false;
            }

            else if (vm.pointsTotal != vm.Quiz.maxScore)
            {
              
              vm.validDistro = false;
            }

            else if(vm.weightTotal != 100 )
            {
              
              vm.validDistro = false;
            }

            else {
              
              vm.validDistro = true;
            }


          };


          vm.saveDistribution = function()
          {

              var saveDistroUrl = API_URL+'quiz/distribution/'+vm.examID; 

              $http({

                url : saveDistroUrl,
                method : 'PUT',
                data : vm.Distro

              }).then(
              function(res){

                console.log(res.data);

              }, 

              function(res){

                console.log(res.data);

              });



                        
          }


    }]);

})();


/*


calculate weight percentate via allocated points
  score / maxscore * 100 = 

*/

(function() {

    angular.module('io2v3').controller('recoverCtrl', ['API_URL', '$scope', '$http', '$stateParams', '$state', function(API_URL, $scope, $http, $stateParams, $state){


        var vm = this;


        vm.encodedToken = null;

        vm.localvertication = false;


        if($stateParams.accesstoken == undefined)
        {
           $state.go('ua.login');
        }

        else {

            vm.encodedToken = $scope.$parent.base.decodeUrlToken($stateParams.accesstoken);

            if(typeof(vm.encodedToken) !== 'object')
            {

               $state.go('ua.login'); 

            }
         
            if(vm.encodedToken.action != 'updatepswonforget')
            {
               $state.go('ua.login');  
              
            }
         
        }


        console.log(vm.encodedToken);


        vm.validateEmail = function()
        {

            if(vm.email != vm.encodedToken.email)
            {
              
                $state.go('ua.login');

            }

            else {

                vm.localvertication = true;

            }

        };


        vm.attemptUpdatePassword = function()
        {

            var successValidation  = function(res)
            {

              var notify = {
                        type: 'success',
                        title: 'Operation Successful',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    $state.go('ua.login');


            };

            var errorValidation  = function(res)
            {

              var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            };

            vm.dataPayload = {'email' : vm.email, 'password': vm.password};

            $http({

                url : API_URL+'residue/doaction/'+vm.encodedToken.id,
                method: 'PUT',
                data : vm.dataPayload,
                headers : {'accesstoken': $stateParams.accesstoken}

            }).then(successValidation, errorValidation);


        };



    }]);

})();

(function() {

    angular.module('io2v3').controller('registerCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        
        var vm = this;


        vm.nuser = {};


        vm.register = function()
        {

        	console.log(vm.nuser);

        	var error = 0;


			if(vm.nuser.password != vm.nuser.cpassword)
			{
				
				

				var notify = {
                        type: 'error',
                        title: 'Error',
                        content: 'Both Password Must be the Same',
                        timeout: 3000 //time in ms
                    };

                    $scope.$emit('notify', notify);

			}

            else if (error == 0)
            {


                function registerSuccess(res)
                {
                    

                    var notify = {
                        type: 'success',
                        title: 'Registration Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };

                    $scope.$emit('notify', notify);

                    $state.go('ua.login');



                }

                function registerError(res)
                {
                    

                    var notify = {
                        type: 'error',
                        title: 'Error',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };

                    $scope.$emit('notify', notify);

                }

                var url = API_URL+'users';

                $http({

                    url : url,
                    method: 'POST',
                    data : vm.nuser

                }).then(registerSuccess, registerError);

            }

            else {
                console.log('state undefined action');
            }


        };


    }]);

})();

(function() {

    angular.module('io2v3').controller('registerEnrollCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        vm.examID = $stateParams.examID;
        $scope.$parent.absExamId = vm.examID;

        $scope.$parent.exAbs.pageHeading = "Register & Enroll Canidates";

        vm.re = {

        };


        vm.regEnroll = function()
        {


        	vm.re.examID = vm.examID;

        	var regEnrollUrl = API_URL+'register-enroll';

        	function regEnrollSuccess(res)
        	{


                vm.re = {};
                vm.generatedPassword = null;
                vm.nPass = null;


                var notify = {
                        type: 'success',
                        title: 'Enrollment Status',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

        	}

	        function regEnrollError(res)
	        {

                var notify = {
                        type: 'error',
                        title: 'Enrollment Error',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

	        }

	        if(vm.re.password == vm.nPass && vm.re.password.length > 5) 
	        {
		        $http({

		        	url : regEnrollUrl,
		        	method: 'POST',
		        	data : vm.re

		        }).then(regEnrollSuccess, regEnrollError);
	        }

	        else {
	        	console.log('both password must match and more then 5 character');
	        }


        }



        vm.generateFromRandom = function()
        {

           
           vm.generatedPassword = $scope.$parent.base.generatePassword();
           vm.re.password =  vm.generatedPassword;
           vm.nPass =  vm.generatedPassword;


        };


    }]);

})();

(function() {

    angular.module('io2v3').controller('rolePermissionsCtrl', ['API_URL', '$scope', '$http', function(API_URL, $scope, $http){


        var vm = this;

        $scope.$parent.dash.pageHeading = "Role Permissions";    
        
        vm.pageMode = null;

        vm.ndata = {};


        $http({
        	method: 'GET',
        	url : API_URL+'role-permissions',
            cache: false

        })
        .then(function(res){

        		vm.dataList = res.data;
                vm.pageMode = 'list';

        }, function(res){


        	console.log('failed');

            vm.dataList = res.data;

            vm.pageMode = 'error';

        });



        vm.savePermission = function() 
        {

            var saveUrl = API_URL+'role-permissions';

            $http({

                url : saveUrl,
                method: 'POST',
                data : vm.ndata

            }).then(

            function(res) {

                
                vm.dataList.permissions.push(res.data.lastRecord[0]);

                vm.npermission = {};

                vm.pageMode = 'list';

                var notify = {
                        type: 'success',
                        title: 'Success',
                        content: res.data.message,
                        timeout: 50000 //time in ms
                    };
                    $scope.$emit('notify', notify);



            },
            function(res){

                console.log(res.data);

                var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 50000 //time in ms
                    };
                    $scope.$emit('notify', notify);


            });

        };


        vm.statusToggle = function(id, permission_id, role_id, status)
        {

            console.log(role_id);


            var url = API_URL+'role-permissions';


            $http({

                url : url,
                method: 'PUT',
                data: {permission_id: permission_id, role_id: role_id, status: status}

            }).then(statusTogglesuccess, statusToggleerror);


            function statusTogglesuccess(res){


                var notifyType  = (res.data.status == 1) ? 'success' : 'warning';
                var notify = {
                        type: notifyType,
                        title: 'Role Permission',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);
            }

            function statusToggleerror(res)
            {

                var notifyType  = 'error';
                var notify = {
                        type: notifyType,
                        title: 'Role Permission',
                        content: res.data.message,
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);
            }

        };


        vm.remove = function(rolePermissionId, role_id, permission_id)
        {
            console.log('role id ' + role_id);
            console.log('permission id ' + permission_id);


             var idx = $scope.$parent.base.getIndex(vm.dataList.permissions, 'id', rolePermissionId);


             var url = API_URL+'role-permissions/'+rolePermissionId+'/'+role_id+'/'+permission_id;

            $http({

                url : url,
                method: 'delete',
                data: {role_id: role_id, permission_id: permission_id}

            }).then(
            function(res){

                console.log('remove success');               
                vm.dataList.permissions.splice(idx, 1);

            },
            function(res){
                
                console.log('remove error');

            });

        };

        console.log('controller is activated');

    }]);

})();

(function() {

    angular.module('io2v3').controller('rolesCtrl', ['API_URL', '$scope', '$http', '$state', function(API_URL, $scope, $http, $state){


        var vm = this;

        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Roles";


        vm.loading = null;


        $http({
        	method: 'GET',
        	url : API_URL+'roles',
            cache: false
        })
        .then(function(res){

        		vm.dataList = res.data;

                vm.loading = true;

        }, function(res){



            vm.loading = true;

        	

        });



        vm.resetDefaultPermissions = function(itemId)
        {


            $http({

                url : API_URL+'roles-reset-permission/'+itemId,
                method : 'PUT',
                data : {}


            }).then(

            function(res){

            }, 

            function(res){

            })

        };




    }]);

})();

(function() {

    angular.module('io2v3').controller('stdCtrl', ['API_URL', '$scope', function(API_URL, $scope){


        var vm = this;

        console.log('Student Abtract controller is activated');


    }]);

})();

(function() {

    angular.module('io2v3').controller('stdExamCtrl', ['API_URL', 'SITE_URL', '$scope', '$http', '$state', '$interval', 'xToTimeFilter', '$rootScope', function(API_URL, SITE_URL, $scope, $http, $state, $interval, xToTimeFilter, $rootScope){


        var vm = this;
        vm.quizModal = false;
        vm.hasQuizEnrolled = null;
        vm.hasPendingQuiz = false;
        vm.hasAttemptedQuiz = false;
        vm.isInitiatStart = false;


        vm.detailModalBox = false;

        vm.progressDetailsModal = false;

        vm.poolCounter = 0;

        $scope.counter = [];

        $scope.$parent.std.pageHeading = "Quiz";
        

        localStorage.removeItem('lastStoredDurationSeconds');





        vm.initiateQuiz = function(enroll_id)
        {
          
            vm.isInitiatStart = true;
            /*
            var popup = window.open("http://localhost:8000/quiz-assement/177/24", "myPopup", 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=1000,height=800')
            */

            $http({
                url : API_URL+'std-quiz-initiate',
                method : 'POST',
                data : {'enroll_id' : enroll_id}
            }).then(function(res){

                
                var resData = res.data;


                if(resData.usedXTimes != 0)
                {

                    vm.quizModal = false;

                    var notify = {
                        type: 'error',
                        title: 'Error',
                        content: resData.warning_message,
                        timeout: 8000 //time in ms
                    };

                    $scope.$emit('notify', notify);
                    return false;

                }


                else if(resData.type == 'static')
                {
                    var attempt_id = res.data.attempt_id;
                    var stateargs = {'attempt_id' : attempt_id, 'quiz_id': vm.actQuiz.id};

                    var popupUrl = SITE_URL+'quiz-assement/'+attempt_id+'/'+vm.actQuiz.id;

                    vm.quizModal = false;
                    vm.isInitiatStart = false;

                    vm.actQuiz.validity = "progress";



              window.quizWindow = window.open(popupUrl, "Quiz", 

                        'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=0,fullscreen=yes,width='+screen.availWidth+',height='+
                        screen.availHeight 
                        );

                 //   $state.go('quizPlay', stateargs);


                }

                else if (resData.type == 'dls')
                {

                                        
                    

                    var attempt_id = res.data.attempt_id;
                    var stateargs = {'attempt_id' : attempt_id, 'quiz_id': vm.actQuiz.id};


                    dlsPopupUrl = SITE_URL+'/quiz-assessment/dls/'+attempt_id+'/'+vm.actQuiz.id;



                    vm.quizModal = false;
                    vm.isInitiatStart = false;

                    vm.actQuiz.validity = "progress";


              window.quizWindow = window.open(dlsPopupUrl, "Quiz", 

                        'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=0,fullscreen=yes,width='+screen.availWidth+',height='+
                        screen.availHeight 
                        );                        


                    // $state.go('quizPlayDLS', stateargs);

                    

                }

                else {

                    console.log('quiz type is unknown');

                }
                

            },
            function(res){

                console.log(res);

            });

        };

        



        vm.launchQuizModal = function(quizId, reattempt = false)
        {

        	

            if(!reattempt)
            {
                var idx = $scope.$parent.base.getIndex(vm.dataList.quiz, 'id', quizId);
                vm.actQuiz = vm.dataList.quiz[idx];    
            }
            else {
                var idx = $scope.$parent.base.getIndex(vm.dataList.attempted, 'id', quizId);
                vm.actQuiz = vm.dataList.attempted[idx];
            }

            vm.quizModal = true;
            
        };


        function successFetchQuizList(res)
        {
        	
        	if(res.data.quiz != 0)
        	{       		
                vm.hasQuizEnrolled = true;
                vm.hasPendingQuiz = true;

        	}

            if (res.data.attempted != 0)
            {
                vm.hasAttemptedQuiz = true;
                vm.hasQuizEnrolled = true;
            }

        	if (res.data.quiz == 0 && res.data.attempted == 0){

        		vm.hasQuizEnrolled = false;	

        	}

            vm.dataList = res.data;

        	

        }

        function errorFetchQuizList(res)
        {       	

            if(res.data.quiz == 0 && res.data.attempted == 0)
            {
                vm.hasQuizEnrolled = false;    
            }

        }


        vm.fetchQuizListings = function()
        {

            var url = API_URL+'std-quiz-list';

            $http({

                url : url,
                method: 'GET'

            }).then(successFetchQuizList, errorFetchQuizList);

        };


        vm.fetchQuizListings();



        vm.showCountdown = function(quizId, dtEnrolled, dtsScheduled)
        {



        var enrolledDT =  new Date(dtEnrolled).getTime();    
        var scheduleDT = new Date(dtsScheduled).getTime();
        var currentDT = new Date().getTime();

        if(scheduleDT > currentDT)
        {

            console.log('work for countdown');


                var inc = 1;
            

            var countdownHandle = $interval(function(){


            var now = new Date().getTime();

            var distance = scheduleDT - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);


            if(distance <= 0)
            {
                
                $interval.cancel(countdownHandle);
                var idx = $scope.$parent.base.getIndex(vm.dataList.quiz, 'id', quizId);
                vm.dataList.quiz[idx].schedule = 'eligible';

            }

            

                if(days == 0 && hours == 0)
                {
                    $scope.counter[quizId] = minutes + " mins " + seconds + " secs ";
                }

               else {

                    $scope.counter[quizId] = days + " DD " + hours + " HH "
                + minutes + " mm " + seconds + " ss ";

                }

                console.log(distance);

            },1000);



        }





        /*    
        var countdownHandle = $interval(function(){
            //$interval.cancel(promise);
            console.log('hello I am the countdown timer for the quiz' + quizId);
        },1000);

        */

            
        };



        vm.updateOnFinish = function(timestamp)
        {
            var queryString = {'timestamp' : timestamp || null};

          $rootScope.studenExamListPooling =  $.ajax(
                {
                    type: 'GET',
                    url: API_URL+'std-quiz-polling',
                    data: queryString,
                    headers: {
                        'token' : localStorage.auth_token
                    },
                    success: function(res){
                        

                        if(res.timestamp > 0)
                        {
                            
                            vm.poolCounter += 1;
                            
                        }


                        if(vm.poolCounter > 1)
                        {
                           
                           console.log('update the list');   


                           /*

                           vm.dataList = res;

                           */


                           vm.fetchQuizListings();


                           console.log(res);




                        }

                        

                        $scope.$apply();
                       
                        vm.updateOnFinish(res.timestamp);

                        

                    }
                }
            );
        };


        vm.updateOnFinish(null);



        vm.activateDetails = function(quizId, enrollId)
        {

            vm.fetchQuizDetails(quizId); 

        };


        vm.deactivateDetail = function()
        {

            vm.detailModalBox = false;

        };



        vm.fetchQuizDetails = function(quizID)
        {

            var successFetchDetails = function(res)
            {

                if(res.data.status == true)
                {

                    vm.detailModalBox = true;
                    vm.modalQuiz = res.data.quiz[0];

                }
                
            };

            var errorFetchDetails = function(res)
            {

            };

            $http({

                url: API_URL+'quiz/'+quizID,
                method: 'GET'


                }).then(successFetchDetails, errorFetchDetails);





        };



        vm.activateProgressStatus = function(attemptId)
        {
            
            console.log(attemptId);

            var successProgress = function(res)
            {
                if(res.data.status == true)
                {
                   
                   
                   vm.mdProgressData = res.data.progress[0]; 

                   vm.progressDetailsModal = true;

                   


                }
                
            };

            var errorProgress = function(res)
            {

            };

            $http({

                url : API_URL+'std-self-progress/'+attemptId,
                method: 'GET'

            }).then(successProgress, errorProgress);

        };


        vm.deActicateProgressStatus = function()
        {
            vm.progressDetailsModal = false;
        };




    }]);

})();

(function() {

    angular.module('io2v3').controller('stdQuizCtrl', ['API_URL', '$scope', '$timeout', function(API_URL, $scope, $timeout){



    $scope.pageHeading = "";	
		    
		

    }]);

})();

(function() {

    angular.module('io2v3').controller('studentDashboardCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        $scope.$parent.std.pageHeading = "Main";	




        /*


        setTimeout(function() {


        $(document).keydown(function (event) {

    		if (event.keyCode == 123 ||event.keyCode == 85) { // Prevent F12

        return false;

    		} else if (event.ctrlKey && event.shiftKey && event.keyCode == 73 || event.keyCode == 85) { // Prevent Ctrl+Shift+I        

        		return false;

    		}
		});



    $('body').bind('cut copy paste', function (e) {

    	console.log(e);

        e.preventDefault();
    });



        });

    */




    }]);

})();




(function() {

    angular.module('io2v3').controller('nameCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        


    }]);

})();

(function() {

    angular.module('io2v3').controller('usersCtrl', ['API_URL', '$scope', '$http', '$state', 'auth', function(API_URL, $scope, $http, $state, auth){


        var vm = this;


        $scope.sortType = '$';
        vm.searchQuery = '';
        $scope.sortReverse  = false;


        vm.roleLabel = function(role)
        {

            if(role == 'students')
            {
                return 'Candidate';
            }
            else if(role == 'contributor')
            {
                return 'Test Developer';
            }

            else {
                return role;
            }

        };



        vm.selectSortfield = function(fieldName)
        {

            $scope.sortType = fieldName;

        };


        vm.clearFilters = function()
        {

            $scope.sortType = '$';
            vm.searchQuery = '';
            $scope.sortReverse  = false;

        };




        $scope.$parent.base.pageUrl = $state.current.url; 

        $scope.$parent.dash.pageHeading = "Users";


        vm.loadingStatus = null;


        vm.forceCategoryBound = false;


        vm.modalOpen = false;

        vm.modalData;

        vm.permssionModal = false;


        vm.deleteConfirmModal = false;

        vm.xUSer = null;

        vm.nUser = {};


        vm.addUser = false;


        vm.userRole = auth.getUser()['role'];


        vm.changePassword = false;




        vm.userBindCheck = function()
        {

            console.log();


            var idx = $scope.$parent.base.getIndex(vm.roles, 'id', vm.nUser.role_id);

            var chosenRole = vm.roles[idx]['role'];


            if(chosenRole == 'contributor' || chosenRole == 'content developer')
            {

                vm.forceCategoryBound = true;

            }

            else {
                vm.forceCategoryBound = false;
                
            }





        }


        vm.generateFromRandom = function()
        {

           vm.generatedPassword = $scope.$parent.base.generatePassword();
           vm.nUser.password =  vm.generatedPassword;
           vm.nUser.passwordConfirm =  vm.generatedPassword;

        };


        vm.activateAddUser = function()
        {

            vm.generatedPassword = "";
            vm.nUser = "";
            vm.addUser = true;

        };

        vm.deactivateAddUser = function()
        {

            vm.generatedPassword = "";
            vm.nUser = "";
            vm.addUser = false;            

        };





        vm.addNewUser = function()
        {


            var url = API_URL+'users';

                $http({

                    url : url,
                    method: 'POST',
                    data : vm.nUser

                }).then(registerSuccess, registerError);


                function registerSuccess(res)
                {


                    var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                    vm.addUser = false;
                    vm.nUser = {};

                    if(vm.dataList != undefined)
                    {
                        
                        vm.dataList.push(res.data.lastCreatedUser[0]);

                        console.log('with existing list');


                    }

                    else {

                        console.log('on empty user list');

                        vm.dataList = res.data.lastCreatedUser;

                        vm.loadingStatus = true;

                    }

                    


                }

                function registerError(res)
                {


                        var notify = {
                        type: 'error',
                        title: 'User Creations Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                }

            
        };





        vm.launchDeleteConfirmation = function(itemId)
        {

            vm.deleteConfirmModal = true;
            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);
            vm.xUSer = vm.dataList[idx];

        };

        vm.closeDeleteModal = function()
        {

            vm.deleteConfirmModal = false;
            vm.xUSer = null;

        }


        vm.loadPermissions = function(itemId)
        {

            
            var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);
            vm.modalData = vm.dataList[idx];


                $http({
                    method: 'GET',
                    url : API_URL+'user-permissions/'+itemId,

                })
                .then(function(res){


                        vm.userPermissions = res.data.userPermissions;
                        vm.permssionModal = true;  


                        if(res.data.customPermissionList == false)
                        {
                            vm.newCustomPermission = false;
                        }
                        else {

                            vm.newCustomPermission = true;

                            vm.customPermissionList = res.data.customPermissionList;

                        }                     

                        console.log(res.data);


                }, function(res){

                    var notify = {
                        type: 'error',
                        title: 'User Permissions',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                });

        };






        vm.launchModal = function(user_id)
		{
			
			var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', user_id);
			vm.modalData = vm.dataList[idx];
			vm.modalOpen = true;
			console.log(vm.modalData);

		};

        vm.cpGenerateFromRandom = function()
        {
            vm.cpGenerated = $scope.$parent.base.generatePassword();
            vm.modalData.password =  vm.cpGenerated;
            vm.modalData.cpassword =  vm.cpGenerated;

        };



        vm.deactivateChangePassword = function()
        {

            vm.modalOpen = false;
            vm.modalData.password = "";
            vm.modalData.cpassword = "";
            vm.modalData = null;

            vm.cpGenerated = false;

        };


        vm.udpatePassword = function()
        {


            var url = API_URL+'changepassword/'+vm.modalData.id;

            var updatePayload = {
                'password': vm.modalData.password
            };

            function successPasswordChange(res)
            {

                
                var notify = {
                        type: 'success',
                        title: 'Operation Successfull',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    vm.deactivateChangePassword();

            }

            function errorPasswordChange(res)
            {
                console.log('failed while updating password');
            }



            if(vm.modalData.password == vm.modalData.cpassword)
            {

                $http({
                url : url,
                method : 'PUT',
                data: updatePayload
            }).then(successPasswordChange, errorPasswordChange);



            }

            else {


                var notify = {
                        type: 'error',
                        title: 'Validation Error',
                        content: 'Both Password must be same',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                
            }


        };




        


        $http({
        	method: 'GET',
        	url : API_URL+'users',
            cache: false
        })
        .then(function(res){

            vm.topCategories = res.data.topCategories;
            vm.roles = res.data.roles;

        	if(res.status == 200)
        	{
        		vm.dataList = res.data.users;

                
                
                vm.loadingStatus = true;
        	}
            else if (res.status == 206)
            {
                vm.loadingStatus = 'no contents';

                
            }

            

        }, function(res){

        	vm.loadingStatus = false;

        });

        

        
        vm.statustoggle = function(user_id, userStatus)
        {

        	var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', user_id);


        	$http({
        		method: 'PUT',
        		url : API_URL+'users/status-toggle/'+user_id,
        		data : {'status': userStatus}
        	})

        	.then(function(res){


                if(res.data.user[0].status == 1)
                {

    	        	var notify = {
                            type: 'success',
                            title: 'Operation Successfull',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);
                }

                else {

                    var notify = {
                            type: 'warning',
                            title: 'Operation Successfull',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);

                }


	        }, function(res){

	        	var notify = {
                        type: 'error',
                        title: 'Operation Failed',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);


                    vm.dataList[idx].status = (userStatus == 1) ? '0' : '1';



	        	

	        });

        };



        vm.resetUserPermissions = function(user_id, role_id)
        {

            var url = API_URL+'users-permissons/reset/'+user_id+'/'+role_id;


            $http({

                url : url,
                method: 'PUT',
                data : {}


            }).then(

            function(res){

                var notify = {
                            type: 'success',
                            title: 'User Permissions',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);

            }, 

            function(res){


                var notify = {
                        type: 'error',
                        title: 'User Permission',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);



            });


        };



        vm.addNewUserPermission = function(user_id)
        {

            


            if(isNaN(vm.nctp))
            {
                
                var notify = {
                        type: 'error',
                        title: 'Validation',
                        content: 'Missing Permission ID',
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

                return false;

            }


            var url = API_URL+'user-permissions';


            $http({

                url : url,
                method: 'POST',
                data: {user_id : user_id, permission_id : vm.nctp}

            }).then(
            
            function(res){

                var notify = {
                        type: 'success',
                        title: 'User Permissions',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);
                    
                    vm.userPermissions.push(res.data.lastAdded[0]);


            }, 

            function(res){


                var notify = {
                        type: 'error',
                        title: 'User Permissions',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            });

        };



        vm.privatePermissionToggle = function(permissionID, user_id, pStatus)
        {

            var url = API_URL+'users-permissons/status-toggle/'+user_id+'/'+permissionID;

            $http({

                url : url,
                method : 'PUT',
                data : {pStatus: pStatus}

            }).then(

            function(res){


                var notifyType = (res.data.permissionStatus == 0) ? 'warning' : 'success';


                var notify = {
                            type: notifyType,
                            title: 'User Permissions',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);



            }, 
            function(res){


                var notify = {
                        type: 'error',
                        title: 'User Permission',
                        content: res.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);

            });


        };


        vm.deleteUser = function(itemId)
        {


            $http({

                url : API_URL+'users/'+itemId,
                method: 'DELETE',
                data : {}
            }).then(

            function(res){

                /*
                    
                    remove from the list


                */

                var idx = $scope.$parent.base.getIndex(vm.dataList, 'id', itemId);


                vm.dataList[idx].proceedToX = false;

                vm.deleteConfirmModal = false;

                vm.xUSer.proceedToX = false;



                vm.dataList.splice(idx, 1);

                var notify = {
                            type: 'warning',
                            title: 'OPeration Successfull',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);


            }, 

            function(res){

                var notify = {
                            type: 'error',
                            title: 'OPeration Failed',
                            content: res.data.message,
                            timeout: 3000 //time in ms
                        };
                         $scope.$emit('notify', notify);


            });


        };


    }]);

})();

angular.module('io2v3').filter('contains', [function() {
  return function (array, needle) {
    return array.indexOf(needle) >= 0;
  };
}]);


angular.module('io2v3')

    .filter('titleCase', [function() {
        return function(input) {
            input = input || '';
            return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };
    }])


    .filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }])


    .filter('setDecimal', [function ($filter) {
    return function (input, places) {
        if (isNaN(input)) return input;
        // If we want 1 decimal place, we want to mult/div by 10
        // If we want 2 decimal places, we want to mult/div by 100, etc
        // So use the following to create that factor
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
    };

    }])


   

    



angular.module('io2v3')

    .filter('xToTime', [function() {
        return function(input) {


            var attemptedDate = new Date(input);

            function timeSince(date) {

                var seconds = Math.floor((new Date() - date) / 1000);

                var interval = Math.floor(seconds / 31536000);

                if (interval > 1) {
                    return interval + " years ago";
                }
                interval = Math.floor(seconds / 2592000);
                if (interval > 1) {
                    return interval + " months ago";
                }
                interval = Math.floor(seconds / 86400);
                if (interval > 1) {
                    return interval + " days ago";
                }
                interval = Math.floor(seconds / 3600);
                if (interval > 1) {
                    return interval + " hours ago";
                }
                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                    return interval + " minutes ago";
                }
                return Math.floor(seconds) + " seconds ago";
            }

            return timeSince(attemptedDate);
            

        }
    }]);
angular.module('io2v3')
	.factory('authInterceptor', ['$injector', '$q', '$location', function($injector, $q, $location) {

		oAuthIntercept = {};

		oAuthIntercept.request = function(config) {

			config.headers = config.headers || {};



			function getLocalTimeOffset() {
    			var offset = new Date().getTimezoneOffset(), o = Math.abs(offset);
    			return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
			}


			if(localStorage.auth_token)
			{
				config.headers.token = localStorage.auth_token;
			}

			config.headers.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			config.headers.timeOffset = getLocalTimeOffset();

			return config;

		};



		oAuthIntercept.responseError = function(response) {

        	

        	if (response.status == 401){


        		 console.log('throw it out');

	       		 /*
        		if (!$state) { 
        			$state = $injector.get('$state'); 
        		}
        		$state.go('logout');
				*/


				 $location.path('/logout');

		    	 
            	
        	}
        	
        	return $q.reject(response);	

        	
        	
    	};


		return oAuthIntercept;


	}])

	.config(['$httpProvider', function($httpProvider) {

    	$httpProvider.interceptors.push('authInterceptor');

    }]);

    
	

angular.module('io2v3')
	.service('auth', ['$http', 'API_URL', '$cacheFactory', function($http, API_URL, $cacheFactory) {

		self = this;

		this.login = function(creds)
		{

			var loginUrl = API_URL+'login';
			
			return $http.post(loginUrl, {'email': creds.email, 'password': creds.password});
		};

		

		this.logout = function()
		{

			localStorage.removeItem('auth_token');
            localStorage.removeItem('hdauEn');

		};

		this.getUser = function()
		{
			if(this.hastokenAndUser())
			{
                var user = localStorage.getItem('hdauEn');
                user = atob(user);
                return  user = JSON.parse(user);
			}
		};

		this.hastokenAndUser = function()
		{
			if(localStorage.hasOwnProperty('auth_token') && localStorage.hasOwnProperty('hdauEn'))
			{
				return true;
			}
			else {
				return false;
			}
		};


		this.isLoggedIn = function()
		{
			if(localStorage.getItem('auth_token'))
			{
				return true;
			}
			else 
			{
				return false;
			}
		};


		


		this.userHasPermission = function(requiredPermission)
		{


				if(!self.isLoggedIn()){
	            		return false;
	        	}

	        	var userPermissions = self.getUser()['permissions'];
        		var found = false;


        		angular.forEach(userPermissions, function(permission, index){

            		if (requiredPermission.indexOf(permission) >= 0){

            			console.log(permission);
                		found = true;
                		return;
            		}                        
        });
         
        return found;

		};



		var cachedUrl = [
		'https://api.iskillmetrics.com/quiz',
		'https://api.iskillmetrics.com/questions',
		'https://api.iskillmetrics.com/question-section-summary',
		'https://api.iskillmetrics.com/batches',
		'https://api.iskillmetrics.com/roles',
		'https://api.iskillmetrics.com/users',
		'https://api.iskillmetrics.com/permissions',
		'https://api.iskillmetrics.com/role-permissions',
		'https://api.iskillmetrics.com/cats',
		'https://api.iskillmetrics.com/media'
		];


		this.clearAllhttpCache = function()
		{

			
			var $httpDefaultCache = $cacheFactory.get('$http');


			for(key in cachedUrl)
			{
				$httpDefaultCache.remove(cachedUrl[key]);

				console.log('cleared : ' + cachedUrl[key])
			}


			return true;



		};


		

		
		
	}]);
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
angular.module('io2v3')
	.service('langSer', [function() {

		this.init = function()
		{

			if(localStorage.hasOwnProperty('hdrLang'))
			{
                return localStorage.getItem('hdrLang');
			}
			else {
				localStorage.setItem('hdrLang', 'en');
				return 'en';
			}

		};

		this.switchLang = function()
		{
			if(localStorage.getItem('hdrLang') == 'en')
			{
				localStorage.setItem('hdrLang', 'ar');
				return 'ar';
			}
			else {
                localStorage.setItem('hdrLang', 'en');
                return 'en';
			}

			this.init();

		};

		this.langIndex = function()
		{
			if( localStorage.getItem('hdrLang') == 'en' )
			{
				return 0;
			}
			else if (localStorage.getItem('hdrLang') == 'ar')
			{
				return 1;
			}
			else {
				return 2;
			}
		};

	}]);
angular.module('io2v3')
	.service('logService', [function() {

		this.justLog = function() 
		{
			console.log('This is a simple log message from a logger service');
		};

		this.logWithMessage = function(msg)
		{
			console.log('With Logger Service Your message :' + msg);
		};

	}]);
angular.module('io2v3')
	.service('masterDataService', ['$http', 'API_URL', '$cacheFactory', function($http, API_URL, $cacheFactory) {

		var masterUrl = API_URL+'masterdatalist';



		this.loadMaster = function()
		{
			
			return $http.get(masterUrl, {cache: true});
		};

		this.getCachedItems = function()
		{
		
			var requestCache = $cacheFactory.get('$http');
			return requestCache.get(masterUrl);

		};


		this.removeCache = function()
		{

			var httpCache = $cacheFactory.get('$http');
			httpCache.remove(masterUrl);

		};


	}]);
angular.module('io2v3').service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(){
            })
            .error(function(){
            });
    };
}]);
angular.module('io2v3')
	.service('quizDataService', ['$http', 'API_URL',function($http, API_URL) {

		this.getMasterQuiz = function(quiz_id)
		{
			
			var quizPlayUrl = API_URL+'quiz/subjects/'+quiz_id;
			return $http({

				 
				 url : quizPlayUrl,
				 method: 'GET'

			});

		};


		this.queGlobalFetch = function()
		{

			var urlforQuizGlobal = 	API_URL+'quiz-global';


			return $http({
				 
				 url : urlforQuizGlobal,
				 method: 'GET'

			});




		};


	}]);
angular.module('io2v3')
	.service('quizPlay', ['$http', 'API_URL', function($http, API_URL) {

		this.prepQuizQuestion = function(quiz_id, attempt_id)
		{
			
			var quizPlayUrl = API_URL+'std-quiz-play/quiz_id/'+quiz_id+'/attempt_id/'+attempt_id;
			return $http.get(quizPlayUrl);

		};


		this.dlsPrep = function(quiz_id, attempt_id)
		{

			var dlsQuizUrl = API_URL+'std-quiz-play/dls/'+quiz_id+'/attempt_id/'+attempt_id;
			return $http.get(dlsQuizUrl);

		}

		
	}]);
angular.module('io2v3')
	.service('quizWizardService', ['$http', 'API_URL', function($http, API_URL) {

		this.getPresetValues = function(quiz_id)
		{
			var preSetUrl = API_URL+'quiz-wizard-preset';
			return $http({
				 url : preSetUrl,
				 method: 'GET'
			});
		};


		this.saveQuizWizardData = function() 
		{

			// logic to save and do the rest;	

		};


		this.loadPreDistributionInfo = function(dataPayload)
		{
	
			var url = API_URL+'quizwizardsubjects';

			return $http({
				 url : url,
				 method: 'POST',
				 data: dataPayload
			});

		};


	}]);