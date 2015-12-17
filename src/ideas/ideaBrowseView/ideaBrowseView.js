/* global angular */
/* global EventSource */

angular.module('flintAndSteel')
.controller('IdeaBrowseViewCtrl',
    [
        '$scope', 'ideaSvc',
        function($scope, ideaSvc) {
            "use strict";

            ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
                $scope.topIdeas = data;
            }, function getIdeaHeadersError(data, status) {
                console.log(status);
            });

            var ideaAddEvents = new EventSource('/ideaheaders/events');
            ideaAddEvents.addEventListener("newHeaders", function(event) {
                var headers = JSON.parse(event.data);
                $scope.$apply(function() {
                    $scope.topIdeas = headers;
                });
            });

            $scope.$on('$stateChangeStart', function() {
                ideaAddEvents.close();
            });
        }
    ]
);
