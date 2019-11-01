angular.module('io2v3').directive('ckeditor', [function () {
  return {
    require: '?ngModel',
    link: function ($scope, elm, attr, ngModel) {


        /*

        var ck = CKEDITOR.replace(elm[0]);

        */

        
       var ck = CKEDITOR.replace(elm[0],
            {
                on :
                {
                    instanceReady : function( ev )
                    {
                        

                        this.focus();

                         $('iframe.cke_wysiwyg_frame', ev.editor.container.$).contents().on('click', function() {
                            ev.editor.focus();
                        });

                        
                    }
                }
            });


       

       ck.on('pasteState', function () {
            
            $scope.$apply(function () {
                ngModel.$setViewValue(ck.getData());
            });



        });

        

        ngModel.$render = function (value) {
            ck.setData(ngModel.$modelValue);
        };
    }
  };
}]);
        

    
        
