/* global angular */

angular.module('flintAndSteel')
.directive('emailLink', 
    [
        function() {
            "use strict";
            
            return {
                restrict: 'E',
                scope: {
                    authorObj: '='
                },
                templateUrl: 'utilities/emailLink.tpl.html'
            };
        }
    ]
);
