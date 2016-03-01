/* global angular */
/* global _ */

angular.module('flintAndSteel')
.controller('IdeaInputCtrl',
    [
        '$scope', 'eventSvc', 'ideaSvc',
        function($scope, eventSvc, ideaSvc) {
            "use strict";

            var nullEvent = {
                _id: "",
                name: "No Event"
            };

            $scope.idea.eventId = "";
            $scope.cancelFn = $scope.cancelFn || null;
            $scope.cancelBtnText = $scope.cancelBtnText || null;

            ///////////////////
            // TAG FUNCTIONS //
            ///////////////////
            $scope.doesTagExist = function doesTagExist(tag) {
                if ($scope.idea.tags.indexOf(tag) === -1) {
                    return false;
                }
                return true;
            };

            $scope.addTag = function addTag(tag) {
                var reNonAlpha = /[.,-\/#!$%\^&\*;:{}=\-_`~()<>\'\"@\[\]\|\\\?]/g;
                tag = tag.replace(reNonAlpha, " ");
                tag = _.upperFirst(_.camelCase(tag));
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
                if (index >= 0) {
                    $scope.idea.tags.splice(index, 1);
                }
            };

            /////////////////////
            // EVENT FUNCTIONS //
            /////////////////////

            $scope.loadEvents = function() {
                eventSvc.getEvents().then(function getEventsSuccess(response) {
                    $scope.events = [nullEvent].concat(response.data);
                }, function getEventsError(response) {
                    $scope.events = [];
                    console.log(response);
                });
            };

            ///////////////////////////////
            // ROLES REQUESTED FUNCTIONS //
            ///////////////////////////////

            $scope.availableBacks = ideaSvc.getBackTypeChips();

            $scope.initialize = function() {
                // Precheck previous boxes for editting backs
                for (var i = 0; i < $scope.availableBacks.length; i++) {
                    for (var j = 0; j < $scope.idea.rolesreq.length; j++) {
                        if ($scope.availableBacks[i].name === $scope.idea.rolesreq[j].name) {
                            $scope.availableBacks[i].checked = true;
                            break;
                        }
                        else {
                            $scope.availableBacks[i].checked = false;
                        }
                    }
                }
            };

            $scope.initialize();

            // add checked types to list
            $scope.toggle = function(item, i) {
                var idx = -1;

                for (var j = 0; j < $scope.idea.rolesreq.length; j++) {
                    if ($scope.idea.rolesreq[j].name === item.name) {
                        idx = j;
                        break;
                    }
                }

                // if already selected, remove from list, otherwise add to selected list
                if (idx > -1) {
                    $scope.idea.rolesreq.splice(idx, 1);
                    $scope.availableBacks[i].checked = false;
                }
                else {
                    $scope.idea.rolesreq.push(item);
                    $scope.availableBacks[i].checked = true;
                }
            };
        }
    ]
);
