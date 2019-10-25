(function() {

    angular.module('io2v3').controller('messageCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        const channel = new BroadcastChannel('sw-idxsaved');

        vm.message = {};

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
