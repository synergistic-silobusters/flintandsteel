/* global angular */
/* global _ */

angular.module('flintAndSteel')
.directive('ideaInput',
    [
        'eventSvc',
        function(eventSvc) {
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
                controller: 'ideaInputView'
            };
        }
    ]
);
