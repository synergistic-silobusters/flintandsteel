/* global angular */
/* global _ */

angular.module('flintAndSteel')
.controller('AddIdeaViewCtrl',
    [
        '$scope', '$state', 'toastSvc', 'ideaSvc', 'userSvc',
        function($scope, $state, toastSvc, ideaSvc, userSvc) {
            "use strict";

            if (!userSvc.isUserLoggedIn()) {
                $state.go('home');
                toastSvc.show('You need to be logged into to create an idea!');
            }

            $scope.idea = {};
            $scope.idea.tags = [];
            $scope.idea.wantedBacks = [];
            $scope.tagInput = "";
            $scope.wantedBacks = ideaSvc.getBackTypeChips();

            $scope.doesTagExist = function doesTagExist(tag) {
                if ($scope.idea.tags.indexOf(tag) === -1) {
                    return false;
                }
                return true;
            };

            $scope.addTag = function addTag(tag) {
                var reNonAlpha = /[.,-\/#!$%\^&\*;:{}=\-_`~()<>\'\"@\[\]\|\\\?]/g;
                tag = tag.replace(reNonAlpha, " ");
                tag = _.capitalize(_.camelCase(tag));
                if ($scope.idea.tags.length !== 5 && !$scope.doesTagExist(tag) && tag !== '') {
                    $scope.idea.tags.push(tag);
                }
            };

            $scope.tagKeyEvent = function tagKeyEvent(keyEvent) {
                // Enter
                if (keyEvent.keyCode === 13) {
                    $scope.addTag($scope.tagInput);
                    $scope.tagInput = "";
                }
            };

            $scope.removeTag = function removeTag(tag) {
                var index = $scope.idea.tags.indexOf(tag);
                $scope.idea.tags.splice(index, 1);
            };

            $scope.addNewIdea = function addNewIdea(ideaToAdd) {
                $scope.wantedBacks.forEach(function(back) {
                    if (back.checked) {
                        $scope.idea.wantedBacks.push(back);
                    }
                })
                ideaToAdd.authorId = userSvc.getProperty('_id');
                ideaToAdd.eventId = "";
                ideaToAdd.rolesreq = [];
                ideaSvc.postIdea($scope.idea).then(function postIdeaSuccess(response) {
                    if (angular.isDefined(response.data.status) && response.data.status === 'Created') {
                        toastSvc.show('New idea created successfully!');
                        $scope.$emit('newIdeaAdded');
                        $state.go('idea', { ideaId: response.data._id });
                    }
                }, function(response) {
                    console.log(response);
                });
            };

            // add checked types to list
            $scope.toggle = function(item, i) {
                if ($scope.wantedBacks[i].checked) {
                    $scope.wantedBacks[i].checked = false;
                } else {
                    $scope.wantedBacks[i].checked = true;
                }
            };
        }
    ]
);
