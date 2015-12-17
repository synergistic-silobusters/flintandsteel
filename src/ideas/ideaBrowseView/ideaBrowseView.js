/* global angular */

angular.module('flintAndSteel')
.controller('IdeaBrowseViewCtrl',
    [
        '$scope', 'ideaSvc', 'sseSvc',
        function($scope, ideaSvc, sseSvc) {
            "use strict";

            function setIdeaHeaders(data) {
                $scope.$apply(function() {
                    $scope.topIdeas = data;
                });
            }

            ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
                $scope.topIdeas = data;
            }, function getIdeaHeadersError(data, status) {
                console.log(status);
            });

            sseSvc.create("newHeaders", "/ideaheaders/events", setIdeaHeaders);

            $scope.$on('$stateChangeStart', function() {
                sseSvc.destroy();
            });
        }
    ]
);
