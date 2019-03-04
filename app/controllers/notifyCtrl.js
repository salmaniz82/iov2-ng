(function() {

    angular.module('io2v3').controller('notifyCtrl', ['API_URL', '$scope', function(API_URL, $scope){


        var vm = this;


        vm.triggerNotifyError = function() 
        {
        	  var notify = {
                        type: 'error',
                        title: 'Error',
                        content: 'show any error message',
                        timeout: 50000 //time in ms
                    };
                    $scope.$emit('notify', notify);
        };

        vm.triggerNotifySuccess = function() 
        {
        	  var notify = {
                        type: 'success',
                        title: 'Operation Done',
                        content: 'You have got a true response from servr',
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);
        };

        vm.triggerNotifyWarning = function() 
        {
        	  var notify = {
                        type: 'warning',
                        title: 'Are you sure you want to continue',
                        content: 'You may have some issues ',
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);
        };

        vm.triggerNotifyInfo = function() 
        {
        	  var notify = {
                        type: 'info',
                        title: 'Notification',
                        content: 'New questions were added to the pool',
                        timeout: 5000 //time in ms
                    };
                    $scope.$emit('notify', notify);
        };

    }]);

})();
