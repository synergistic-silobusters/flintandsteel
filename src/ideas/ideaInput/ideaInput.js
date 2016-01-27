/* global angular */

angular.module('flintAndSteel')
.directive('ideaInput',
    [
        function() {
            "use strict";

            return {
                restrict: 'E',
                scope: {
                    idea: '=',
                    submitFn: '&',
                    submitBtnText: '@',
                    cancelFn: '&',
                    cancelBtnText: '@'
                },
                templateUrl: 'ideas/ideaInput/ideaInput.tpl.html',
                controller: 'IdeaInputCtrl'
            };
        }
    ]
);
