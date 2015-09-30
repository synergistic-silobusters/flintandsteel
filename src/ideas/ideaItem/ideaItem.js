/* global angular */

angular.module('flintAndSteel')
.directive('ideaItem', 
    [
        function() {
            "use strict";
            
            return {
                restrict: 'E',
                scope: {
                    idea: '='
                },
                templateUrl: 'ideas/ideaItem/ideaItem.tpl.html'
            };
        }
    ]
);