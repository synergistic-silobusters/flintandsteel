/* global angular */

angular.module('flintAndSteel')
.directive('learnItem',
    [
        function() {
            "use strict";


            return {
                restrict: 'E',
                scope: {
                    item: '='
                },
                templateUrl: 'learn/learnItem/learnItem.tpl.html'
            };
        }
    ]
);
