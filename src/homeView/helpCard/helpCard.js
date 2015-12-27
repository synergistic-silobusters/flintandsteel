/* global angular */

angular.module('flintAndSteel')
.directive('helpCard', 
    [
        function() {
            "use strict";

            
            
            return {
                restrict: 'E',
                scope: {
                    faq: '='
                },
                templateUrl: 'homeView/helpCard/helpCard.tpl.html'
            };
        }
    ]
);