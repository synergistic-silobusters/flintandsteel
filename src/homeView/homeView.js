/* global angular */

angular.module('flintAndSteel')
.controller('HomeViewCtrl',
    [
        '$scope', '$state','$mdSidenav', 'ideaSvc',
        function($scope, $state, $mdSidenav, ideaSvc) {
            "use strict";

            $scope.navToBrowse = function navToBrowse() {
                $state.go('ideabrowse');
            };

            $scope.hoverInLeft = function(){
                this.hoverLeft = true;
            };

            $scope.hoverOutLeft = function(){
                 this.hoverLeft = false;
            };

            $scope.hoverInCenter = function(){
                this.hoverCenter = true;
            };

            $scope.hoverOutCenter = function(){
                 this.hoverCenter = false;
            };

            $scope.hoverInRight = function(){
                this.hoverRight = true;
            };

            $scope.hoverOutRight = function(){
                 this.hoverRight = false;
            };

            ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
                $scope.topIdeas = data;
            }, function getIdeaHeadersError(data, status) {
                console.log(status);
            });
        }
    ]
);
