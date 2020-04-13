(function() {

    angular.module('io2v3').controller('demoQuizCtrl', ['API_URL', '$scope', '$http', '$state', '$stateParams', 'quizPlayData', '$timeout', function(API_URL, $scope, $http, $state, $stateParams, quizPlayData, $timeout){


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

        var attempt_id = '007';


        vm.ShowPulse = false;


        vm.TimeStatus = 'high';


        $scope.baseUrl = API_URL;


        vm.hasPre = false;
        vm.hasMore = true;
        vm.showEndQuiz = false;


        vm.save = function()
        {         

            $timeout.cancel(vm.quizTimeInterval);
            
            localStorage.removeItem('lastStoredDurationSeconds');

                        var notify = {
                            type: 'success',
                            title: 'Quiz Ended',
                            content: 'Progress has posted to server successfully',
                            timeout: 3000 //time in ms
                        };
                        $scope.$emit('notify', notify);

            $state.go('quizcomplited');

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
            vm.hasPre = false;
            vm.startReviewWizard = false;
            vm.markedQuestions = [];
            vm.isLastQue = false;






        };


        vm.revNext = function()
        {

            if(vm.validAnswer() && vm.questionIndex + 1 <= vm.markedQuestions.length)
            {
                vm.providedAnswers.push(vm.activeQuestion);
                
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
