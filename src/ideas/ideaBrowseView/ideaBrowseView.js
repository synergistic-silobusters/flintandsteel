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

            ideaSvc.getIdeaHeaders().then(function getIdeaHeadersSuccess(response) {
                $scope.topIdeas = response.data;
            }, function getIdeaHeadersError(response) {
                console.log(response);
            });

            sseSvc.subscribe("newHeaders", "/sse/ideas", setIdeaHeaders);

            $scope.$on('$stateChangeStart', function() {
                sseSvc.unsubscribe("/sse/ideas", setIdeaHeaders);
            });
        }
    ]
);
