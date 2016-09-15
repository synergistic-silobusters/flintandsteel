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
                    ideaslist: '=',
                    sort: '='
                },
                templateUrl: 'ideas/topIdeas/topIdeas.tpl.html'
            };
        }
    ]
);
