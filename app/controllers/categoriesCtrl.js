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


        console.log('working from categories controller');

        var url = API_URL+'cats';


        vm.fethList = function()
        {

            $http({
            method: 'GET',
            url : url,
        })
        .then(function(res){

            vm.dataList = res.data.cats;



        }, function(res){


            console.log(res);

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
                
                

                vm.pageMode = 'list';


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
