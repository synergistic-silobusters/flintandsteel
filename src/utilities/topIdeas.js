/* global angular */

angular.module('flintAndSteel')
.directive('topIdeas',
    [
        function() {
            "use strict";

            return {
                restrict: 'E',
                scope: {
                    title: '@',
                    ideaslist: '='
                },
                templateUrl: 'utilities/topIdeas.tpl.html'
            };
        }
    ]
);
