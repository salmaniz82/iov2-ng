(function(){
    angular.module('io2v3')

    .directive('clientEmailAuto', function($http, API_URL) {

        return {
            restrict: 'C',
            link: function(scope, ele, attr, ngModel)
            {


                ele.bind('click', function(e) {

               var url = API_URL+'/api/clients/civilno';
                $http.get(url).then(function(response){
                   var data = response.data;

                        ele.autocomplete({
                            data: data,
                            limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
                            onAutocomplete: function(val) {
                                // Callback function when value is autcompleted.
                            },
                            minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
                        });

                    });


                    

                });

                

                

                


            }

        };

    });

})();