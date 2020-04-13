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
            controller : 'homeCtrl',
            data : {'pageTitle' :  '- Home'}
        })

        .state('pub.about', {

            url: '/about',
            templateUrl: 'views/about.html',
            data : {'pageTitle' :  '- About'}
        })

        .state('pub.tos', {

            url: '/term-service',
            templateUrl: 'views/terms-service.html',
            data : {'pageTitle' :  '- Terms of services'}
        })

        .state('pub.pp', {

            url: '/privacy-policy',
            templateUrl: 'views/privacy-policy.html',
            data : {'pageTitle' :  '- Privacy Policy'}
            
        })

        .state('exm', {
            abstract: true,
            templateUrl : 'views/templates/tab.layout.html',
            controller : 'examMgmtAbstractCtrl as exAbs'
            
        })
        



        .state('exm.exam', {
            url : '/exam-overview/:examID',
            templateUrl : 'views/exams/exam-overview.html',
            controller : 'examOverviewCtrl as vm',
            data : {'pageTitle' :  '- Quiz detail overview'}
        })
      

        .state('exm.quizQuestions', {
            url : '/quiz-questions/:examID',
            templateUrl : 'views/exams/quiz-questions.html',
            controller : 'quizQuestionsCtrl as vm',
            data : {'pageTitle' :  '- Quiz questions'}
        })

        .state('exm.addQuizQuestions', {
            url : '/add-quiz-questions/:examID',
            templateUrl: 'views/dash/que-add.html',
            controller : 'queAddCtrl as vm',
            data : {'pageTitle' :  '- Add quiz questions'},

            resolve : {

                queGlobalData : ['quizDataService', function(quizDataService)
                {

                   return quizDataService.queGlobalFetch();

                }]

            }

        })


        .state('exm.quizOverview', {

            url : '/exam-quiz-overview',
            templateUrl : 'views/exams/quiz-attempt-overview.html',
            data : {'pageTitle' :  '- Quiz attempts overview'}
            
        })


        .state('exm.enroll', {

            url : '/exam-enroll/:examID',
            templateUrl : 'views/exams/exam-enroll.html',
            controller : 'enrollCtrl as vm',
            data : {'pageTitle' :  '- Quiz enrollments'}
            
        })

        .state('exm.register', {

            url : '/exam-register/:examID',
            templateUrl : 'views/exams/exam-register.html',
            controller : 'registerEnrollCtrl as vm',
            data : {'pageTitle' :  '- Quiz register'}
            
        })


        .state('exm.progress', {

            url : '/exam-progress/:examID',
            templateUrl : 'views/exams/exam-progress.html',
            controller : 'quizProgressCtrl as vm',
            data : {'pageTitle' :  '- Quiz progress'}
            
        })

        .state('exm.directurl', {

            url : '/quizurl/:examID',
            templateUrl : 'views/exams/quizdirecturl.html',
            controller : 'quizDirectUrlCtrl as vm',
            data : {'pageTitle' :  '- Quiz progress'}
            
        })

        .state('exm.prog-detail', {

            url : '/exam-progress-detail',
            templateUrl : 'views/exams/exam-progress-detail.html',
            data : {'pageTitle' :  '- Quiz progress details'}
            
        })

        .state('exm.answer', {
            url : '/exams/answer/:examID/:attemptID',
            templateUrl : 'views/exams/answer-sheet.html',
            controller : 'quizAnswerInpectCtrl as vm',
            data : {'pageTitle' :  '- Quiz response answers'}
        })

        .state('exm.consent', {
            url : '/exams/consent/:examID/:attemptID',
            templateUrl : 'views/exams/consent.html',
            controller : 'quizAnswerConsentCtrl as vm',
            data : {'pageTitle' :  '- Quiz consent'}           
        })

        .state('exm.scorecard', {
            url : '/exams/scorecard/:examID/:attemptID',
            templateUrl : 'views/exams/scorecard.html',
            controller : 'quizScoreCardCtrl as vm' ,
            data : {'pageTitle' :  '- Quiz scorecard'}          
        })

        .state('exm.quizWeightDistro', {

            url : '/quiz-weight-distro/:examID',
            templateUrl : 'views/exams/quiz-weight-distro.html',
            controller : 'quizWeightDistroCtrl as vm',
            data : {'pageTitle' :  '- Quiz weight distribution'}
            
        })

        .state('exm.quizEvaluate', {

            url : '/quiz-evaluate',
            templateUrl : 'views/exams/quiz-evaluate.html',
            data : {'pageTitle' :  '- Quiz evaluation'}
            
        })

        .state('exm.notify', {

            url : '/notify',
            templateUrl : 'views/notify.html',
            controller: 'notifyCtrl as vm',
            data : {'pageTitle' :  '- Notify'}
            
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
            authenticate: true,
            data : {'pageTitle' :  '- Dashboard Landing'}
            
        })

        .state('dash.profile', {

            url : '/profile',
            templateUrl : 'views/dash/profile.html',
            controller : 'dashProfileCtrl as vm',
            data : {'pageTitle' :  '- Profile'}

        })


        .state('std.profile', {

            url : '/account-details',
            template : '<h2>Profile Settings are not avaialable</h2>',
            data : {'pageTitle' :  '- Canidate profile'}

        })



        .state('dash.admindashboard', {

            url : '/dashboard',
            template : '<h1>Admin dashboard is under  contruction please login with : abf@domain.com to view entity dashboard</h1>',
            data : {'pageTitle' :  '- Adminstration dashboard'}


        })


        .state('dash.entityDashbaord', {
            url : '/dashboard',
            templateUrl: 'views/dashboard-entity.html',
            controller : 'dashboardEntityCtrl as vm',
            data : {'pageTitle' :  '- Dashboard'},
            authenticate: true,
            roles : ['entity']
        })


        .state('dash.contributorDashbaord', {
            url : '/dashboard',
            template: '<h2>Contributor dashboard is under construction</h2>',
            data : {'pageTitle' :  '- Dashboard'},
            
            authenticate: true,
            roles : ['contributor']
        })

        .state('dash.contDevDashbaord', {
            url : '/dashboard',
            template: '<h2> Content Developer Dashboard is under construction </h2>',
            data : {'pageTitle' :  '- Dashboard'},
            
            authenticate: true,
            roles : ['content developer']
        })

        .state('std.studentDashbaord', {
            url : '/dashboard',
            template: '<h2> Dashboard settings for candiates are not yet not available. </h2>',
            controller : 'studentDashboardCtrl as vm',
            authenticate: true,
            roles : ['students', 'candidate'],
            data : {'pageTitle' :  '- Dashboard'}
        })



        .state('dash.quizzes', {

            url : '/quizzes',
            templateUrl: 'views/dash/dash-quizzes.html',
            controller : 'dashQuizzesCtrl as vm',
            authenticate: true,
            roles : ['admin', 'entity', 'invigilator'],
            data : {'pageTitle' :  '- Quizzes'}
        })


        .state('dash.cats', {
            url : '/categories',
            templateUrl: 'views/dash/categories.html',
            controller : 'categoriesCtrl as vm',
            authenticate: true,
            roles : ['admin', 'content developer'],
            data : {'pageTitle' :  '- Categories'}

        })

        .state('dash.catree', {
            url : '/cat-tree',
            templateUrl: 'views/dash/cat-tree.html',
            controller : 'catTreeCtrl as vm',
            data : {'pageTitle' :  '- Category Tree'}
        })

        


        .state('dash.quePool', {
            url : '/que-pool',
            templateUrl: 'views/dash/que-pool.html',
            controller : 'quepoolCtrl as vm',
            data : {'pageTitle' :  '- Questions Pool'}
        })

        .state('dash.questions', {
            url : '/questions',
            templateUrl: 'views/dash/questions.html',
            controller : 'questionsCtrl as vm',
            authenticate: true,
            roles : ['admin', 'content developer', 'contributor', 'entity'],
            data : {'pageTitle' :  '- Dashboard Questions'}
        })

        .state('dash.queadd', {
            url : '/question-add',
            templateUrl: 'views/dash/que-add.html',
            controller : 'queAddCtrl as vm',
            data : {'pageTitle' :  '- Questions Add'},
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
            data : {'pageTitle' :  '- Questions upload'},
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
            roles : ['admin', 'entity', 'contributor', 'content developer'],
            data : {'pageTitle' :  '- Edit questions'}


        })


        .state('dash.users', {
            url : '/users',
            templateUrl: 'views/dash/users.html',
            controller : 'usersCtrl as vm',
            authenticate: true,
            roles : ['admin'],
            data : {'pageTitle' :  '- Users'}
        })


        .state('dash.myusers', {
            url : '/my-users',
            templateUrl: 'views/dash/my-users.html',
            controller : 'myusersCtrl as vm',
            authenticate: true,
            roles : ['entity'],
            data : {'pageTitle' :  '- My Users'}
        })


        .state('dash.roles', {

            url : '/roles',
            templateUrl : 'views/dash/roles.html',
            controller : 'rolesCtrl as vm',
            authenticate: true,
            roles : ['admin'],

            data : {'pageTitle' :  '- Roles'}

        })

        .state('dash.permission', {
            url : '/permissions',
            templateUrl : 'views/dash/permissions.html',
            controller : 'permissionsCtrl as vm',
            authenticate: true,
            roles : ['admin'],
            data : {'pageTitle' :  '- Permissions'}
        })

        .state('dash.rolePermissions', {
            url : '/role-permissions',
            templateUrl : 'views/dash/role-permissions.html',
            controller : 'rolePermissionsCtrl as vm',
            authenticate: true,
            roles : ['admin'],
            data : {'pageTitle' :  '- Role Permissions'}
        })


        .state('dash.library', {

            url : '/library',
            templateUrl : 'views/dash/library.html',
            controller : 'libraryCtrl as vm',
            authenticate: true,
            permission : ['media-list'],
            data : {'pageTitle' :  '- Media Library'}

        })

        .state('dash.modal', {
            url : '/modal',
            templateUrl : 'views/modal.html',
            controller : 'modalCtrl as vm',
            data : {'pageTitle' :  '- Modal '}
        })

        .state('dash.batches', {

            url : '/groups',
            templateUrl: 'views/dash/batches.html',
            controller : 'batchesCtrl as vm',
            authenticate: true,
            permission : ['batch-list'],
            data : {'pageTitle' :  '- Batches'}
        })


        .state('ua', {
            abstract: true,
            template: '<ui-view/>'
        })


        .state('ua.login', {
            url : '/login?actiontoken&redirectUrl',
            templateUrl: 'views/login.html',
            controller: 'loginCtrl as vm',
            data : {'pageTitle' :  '- Login'}
        })

        .state('ua.register', {
            url : '/register',
            templateUrl: 'views/register.html',
            controller : 'registerCtrl as vm',
            data : {'pageTitle' :  '- Register'}
        })

        .state('ua.forget', {
            url : '/forget',
            controller : 'forgetCtrl as vm',
            templateUrl: 'views/forget.html',
            data : {'pageTitle' :  '- Forget Password'}
        })

        

        .state('ua.recovery', {
            url : '/recover?accesstoken',
            controller : 'recoverCtrl as vm',
            templateUrl: 'views/recover.html',
            data : {'pageTitle' :  '- Recover forgotten password'}
        })


        .state('logout', {
            url : '/logout',
            controller: 'logoutCtrl as vm',
            data : {'pageTitle' :  '- Logout'}
        })

        .state('ua.directalpha', {
            url : '/d/:alphaID',
            templateUrl: 'views/directaccessui.html',
            controller: 'alphaDirectAceessCtrl as vm',
            data : {'pageTitle' :  '- Direct Quiz'}
        })

        .state('onExamRefresh', {
            url : '/examrefreshed/:attempt_id/:quiz_id',
            templateUrl: 'views/student/onexamrefresh.html',
            controller : 'examRefreshedCtrl as vm',
            data : {'pageTitle' :  '- Quiz Terminated'}
           
            
        })

        .state('quizcomplited', {

            url : '/quizcomplited',
            templateUrl : 'views/student/quizcomplited.html',
            controller : 'quizcomplitedCtrl as vm',
            data : {'pageTitle' :  '- Quiz Finished'}

        })


        .state('std', {
            templateUrl: 'views/templates/tab.student.layout.html',
            controller : 'stdCtrl as std',
            abstract: true
        })


        .state('std.exams', {
            url : '/stexams',
            templateUrl : 'views/student/exams.html',
            controller: 'stdExamCtrl as vm',
            data : {'pageTitle' :  '- Quizzes'}

        })

        .state('std.quiz', {
            url : '/quiz',
            controller : 'stdQuizCtrl as vm',
            templateUrl : 'views/student/quiz.html',
            data : {'pageTitle' :  '-  Canidates Quizzes'}

        })

        .state('quizDemo', {
            url : '/quiz-demo',
            controller : 'demoQuizCtrl as vm',
            templateUrl : 'views/quizdemo.html',
            data : {'pageTitle' :  '-  Demo Quiz'}
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
            roles : ['students', 'student', 'candidate'],
            data : {'pageTitle' :  '- Quiz Attempt'}
            
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
            roles : ['students', 'student', 'candidate'],

            data : {'pageTitle' :  '- Quiz Attempt'}
            

        })


        .state('questionPreview', {

            url : '/questionpreview/:questionId',
            templateUrl : 'views/question-preview.html',
            controller: 'questionPreviewCtrl as vm',
            data : {'pageTitle' :  '- Question Preview'}

        })

        .state('inv', {

            templateUrl : 'views/templates/inv.invited.html',
            abstract : true,
            controller : 'invitedAbstractCtrl as vm'
        })


        .state('inv.invited', {

            url : '/i/:entityslug/:invitetoken',
            templateUrl : 'views/student/invited.html',
            controller : 'invitedbyentityCtrl as vm',
            data : {'pageTitle' :  '- Invited to quiz'}

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

            },
            data : {'pageTitle' :  '- Add New Quiz Wizard'}

        })


        .state('message', {
                url : '/message',
                templateUrl : 'views/message.html',
                controller : 'messageCtrl as vm',

                data : {'pageTitle' :  '- Message'}
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
            permission: 'activity-monitor',
            data : {'pageTitle' :  '- Quiz Activity'}

        })


        .state('notfound', {
            url: '/notfound',
            templateUrl: 'views/404.html',
            data : {'pageTitle' :  '- Page Not found'}
        });

 };

 stateConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

 })();



