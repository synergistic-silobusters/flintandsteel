/* global angular */

angular.module('flintAndSteel')
.directive('ideaCard', [
    function() {
        return {
            restrict: 'E',
            scope: {
                idea: '='
            },
            templateUrl: 'ideas/ideaCard/ideaCard.tpl.html'
        };
    }
]);
