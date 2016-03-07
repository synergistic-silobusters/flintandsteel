/* global angular */

angular.module('flintAndSteel')
.controller('LearnCtrl',
    [

        '$document', '$scope','$mdDialog', '$window',
        function($document, $scope, $mdDialog, $window) {
            "use strict";

            $scope.learnItem0 = {
                title: "Login",
                imgSource: "assets/learn/learnToLogin.gif",
                orderImg: "1",
                orderDesc: "2",
                description: "Many collaboration activities on the site requires the user to login.  Please login in the upper right hand corner using the same credentials which you use to login to Windows."
            };
            $scope.learnItem1 = {
                title: "Submit an Idea",
                imgSource: "assets/learn/learnToSubmitIdea.gif",
                orderImg: "2",
                orderDesc: "1",
                description: "Ideas are the foundation of 'Innovate'.  They can consist of a suggestion to fix a business problem, a technical problem, or a general innovation for the company."
            };
            $scope.learnItem2 = {
                title: "Search Ideas",
                imgSource: "assets/learn/learnToSearch.gif",
                orderImg: "1",
                orderDesc: "2",
                description: "Searching is how you can find an ideas that have been submitted across the company.  The search bar looks through an ideas title, content, tags, and backs."
            };
            $scope.learnItem3 = {
                title: "Like an Idea",
                imgSource: "assets/learn/learnToLike.gif",
                orderImg: "2",
                orderDesc: "1",
                description: "Likes are the simplest form of collaboration with an idea.  This gives the author a little boost of confidence to keep going!"
            };
            $scope.learnItem4 = {
                title: "Comment on an Idea",
                imgSource: "assets/learn/learnToComment.gif",
                orderImg: "1",
                orderDesc: "2",
                description: "Comments are a way to give feedback to the author or team of an idea.  One could give ideas or constructive criticism to further the innovation."
            };
            $scope.learnItem5 = {
                title: "Rate Complexity",
                imgSource: "assets/learn/learnToRateComplexity.gif",
                orderImg: "2",
                orderDesc: "1",
                description: "Complexity allows everyone to see how hard the idea will be to solve.  Rating allows an average to show a more accurate estimation of resources."
            };
            $scope.learnItem6 = {
                title: "Back an Idea",
                imgSource: "assets/learn/learnToBack.gif",
                orderImg: "1",
                orderDesc: "2",
                description: "Backing an idea volunteers skills towards the team.  Once you back an idea, the idea owner can add you to their team."
            };
            $scope.learnItem7 = {
                title: "Add to Team",
                imgSource: "assets/learn/learnToAddTeam.gif",
                orderImg: "2",
                orderDesc: "1",
                description: "Once a user has backed an idea, the idea owner can add them to the team.  Now they can work together to complete the idea."
            };

            $scope.LearnItems = [$scope.learnItem0, $scope.learnItem1, $scope.learnItem2, $scope.learnItem3, $scope.learnItem4, $scope.learnItem5, $scope.learnItem6, $scope.learnItem7];

            $scope.showAdvanced = function(ev, item) {
                $mdDialog.show({
                    controller: 'PictureDialogCtrl',
                    templateUrl: 'learn/pictureDialog.tpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        learnItem: item
                    }
                });
                $window.ga('send', {
                    hitType: 'event',
                    eventCategory: 'learn',
                    eventAction: 'show',
                    eventLabel: item.title
                });
            };


        }
    ]
);
