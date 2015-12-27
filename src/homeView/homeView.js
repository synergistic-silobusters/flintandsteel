/* global angular */

angular.module('flintAndSteel')
.controller('HomeViewCtrl',
    [
        '$scope', '$state','$mdSidenav', 'ideaSvc',
        function($scope, $state, $mdSidenav, ideaSvc) {
            "use strict";


            $scope.Innovate = {Name:"Ideas", Description:"Ideas are the foundation of the Innovation Challenge.  You must log in to create one. \nBrowse ideas by clicking 'All Ideas'."};
            $scope.Comment = {Name:"Comments", Description:"Comment on ideas by logging in, clicking on an idea, and going to the comment tab"};
            $scope.Back = {Name:"Backs", Description:"Backing is the term used for showing how you can contribute to an idea.  Click on an idea and go to the Back tab to contribute."};
            $scope.Team = {Name:"Team", Description:"Teams are formed from anyone who has backed an idea.  The owner of the idea forms the team by selecting members in the team tab."};
            $scope.Browse = {Name:"Browse Ideas", Description:"Browse Ideas by clicking 'All Ideas' or by starting to type search text in the bar"};
            $scope.Top = {Name:"Top Ideas", Description:"The top ideas bar is on the left hand side of the page.  These ideas are ranked by the most amount of likes."};
            $scope.Like = {Name:"Likes", Description:"A like is a simple way to show your support for an idea.  This gives the owner a little reinforcement to keep going!"};
            $scope.Blank = {Name:"", Description:""};
            $scope.faqCards = [$scope.Innovate, $scope.Comment, $scope.Back, $scope.Team, $scope.Browse,$scope.Top,$scope.Like];           

            $scope.navToBrowse = function navToBrowse() {
                $state.go('ideabrowse');
            };




            ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
                $scope.topIdeas = data;
            }, function getIdeaHeadersError(data, status) {
                console.log(status);
            });


            

        }
    ]
);

