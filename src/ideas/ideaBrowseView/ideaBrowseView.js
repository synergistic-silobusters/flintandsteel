/* global angular */

angular.module('flintAndSteel')
.controller('IdeaBrowseViewCtrl',
    [
        '$scope', '$state', '$mdSidenav', 'ideaSvc',
        function($scope, $state, $mdSidenav, ideaSvc) {
            "use strict";

            ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
                $scope.topIdeas = data;
            }, function getIdeaHeadersError(data, status) {
                console.log(status);
            });
        }   
    ]
);