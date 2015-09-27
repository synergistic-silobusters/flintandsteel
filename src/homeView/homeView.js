/* global angular */

angular.module('flintAndSteel')
.controller('HomeViewCtrl',
    [
        '$scope', '$state',
        function($scope, $state){
            "use strict";

            $scope.navToBrowse = function navToBrowse() {
                $state.go('ideabrowse');
            };
        }
    ]
);
