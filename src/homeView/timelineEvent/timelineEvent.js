/* global angular */

angular.module('flintAndSteel')
.directive('timelineEvent', 
    [
        function() {
            "use strict";

            
            
            return {
                restrict: 'E',
                scope: {
                    event: '='
                },
                templateUrl: 'homeView/timelineEvent/timelineEvent.tpl.html'
            };
        }
    ]
);