(function() {

    angular.module('io2v3').controller('messageCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;

        var store = {
            db: null,

            init: function() {
              if (store.db) { return Promise.resolve(store.db); }
                    return idb.open('messages', 1, function(upgradeDb) {
                  upgradeDb.createObjectStore('outbox', { autoIncrement : true, keyPath: 'id' });
                }).then(function(db) {
                  return store.db = db;
                });
              },

              outbox: function(mode) {
                return store.init().then(function(db) {
                  return db.transaction('outbox', mode).objectStore('outbox');
            })
          }
        };

        vm.message = {};


        vm.handleMessagePost = function()
        {


        /*  
      	var url = API_URL+"message";
        */

        var liveUrl = 'https://api.iskillmetrics.com/message';

        var url = liveUrl;

        

        vm.triggerBackgroundSync = function()
        {

        store.outbox('readwrite').then(function(outbox) {

            return outbox.put(vm.message);

        }).then(function() {

          // if data is posted to indexDB
          
          vm.message = {};

        if(window.cachedRegisterSW != undefined)
        {
          
              window.cachedRegisterSW.sync.register('outbox');

        }



        }).catch(function(err) {


          // if not then do something else
          console.log(err);



        });

      };




    $http({

          url : url,
          method : 'POST',
          data: vm.message

        }).then(
        function(res){

          console.log('continue as normal no service worker is required');

          console.log(res);

        }, 

        function(res){

          console.log(res);

          if(res.status < 1)
          {

            console.log('proceed to background sync');

            vm.triggerBackgroundSync();


          };



        });


        	/*

				$http({

					url : url,
					method : 'POST',
					data: vm.message

				}).then(
				function(res){

					console.log(res);

				}, 

				function(res){
					console.log(res);

				});

				*/

        };

        


    }]);

})();
