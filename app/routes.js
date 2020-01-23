(function(){

    angular.module('io2v3')


    .config(stateConfig);

    

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

                queGlobalData : ['quizDataService', function(quizDataService)
                {

                   return quizDataService.queGlobalFetch();

                }]

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

                queGlobalData : ['quizDataService', function(quizDataService)
                {

                   return quizDataService.queGlobalFetch();
                }]

            }
        })


        .state('dash.queupload', {
            url : '/question-upload',
            templateUrl: 'views/dash/questions-upload.html',
            controller : 'questionUploadCtrl as vm',
            resolve : {

                queGlobalData : ['quizDataService', function(quizDataService)
                {

                   return quizDataService.queGlobalFetch();
                }]

            }
        })

        .state('dash.questionedit', {
            url : '/question-edit/:queID',
            templateUrl: 'views/dash/que-edit.html',
            controller : 'questionEditCtrl as vm',
            resolve : {
                
                queGlobalData : ['quizDataService', function(quizDataService)
                {
                   return quizDataService.queGlobalFetch();
                }]


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

                quizPlayData : ['quizPlay', '$stateParams', function(quizPlay, $stateParams)
                {
                    var attempt_id = $stateParams.attempt_id;
                    var quiz_id = $stateParams.quiz_id;
                    return quizPlay.prepQuizQuestion(quiz_id, attempt_id);
                }]

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

                wizardPreset : ['quizWizardService', function(quizWizardService)
                {

                   return quizWizardService.getPresetValues();     
                }]

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

 stateConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

 })();



