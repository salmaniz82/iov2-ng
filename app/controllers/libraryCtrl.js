(function() {

    angular.module('io2v3').controller('libraryCtrl', ['API_URL', '$scope', '$http', '$stateParams', function(API_URL, $scope, $http, $stateParams){


        var vm = this;


        vm.loadingStatus = null;


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

            $http.get(API_URL+'media').then(
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

            $http.get(API_URL+'category-flat-root').then(

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
