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
