/* global angular */

angular.module('flintAndSteel')
.controller('DialogBackCtrl',
    [
        '$scope', '$mdDialog', 'ideaSvc', 'backingObj', 'author', 'userSvc',
        function($scope, $mdDialog, ideaSvc, backingObj, author, userSvc) {
            "use strict";

            // Populate values based off current back info
            $scope.types = ideaSvc.getBackTypeChips();
            $scope.backText = backingObj.text;
            $scope.tempTypes = backingObj.types;
            $scope.selectTypes = []; // Variable used for scope issues

            for (var k = 0; k < $scope.tempTypes.length; k++) {
                $scope.tempTypes[k].checked = true;
            }

            var ctrl = this;

            ctrl.isUserAuthor = function() {
                if (userSvc.isUserLoggedIn() && userSvc.getProperty('_id') === author) {
                    return true;
                }
                return false;
            };

            if (this.isUserAuthor()) {
                $scope.selectTypes.push({name: "Owner", _lowername: "owner"});
            }

            // Precheck previous boxes for editting backs
            for (var i = 0; i < $scope.types.length; i++) {
                for (var j = 0; j < $scope.tempTypes.length; j++) {
                    if ($scope.types[i].name === $scope.tempTypes[j].name) {
                        $scope.types[i].checked = true;
                        $scope.selectTypes.push($scope.tempTypes[j]); //avoids parent scope issues
                        break;
                    }
                    else {
                        $scope.types[i].checked = false;
                    }
                }
            }

            // what happens when you hit the cancel button
            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            // what happens when you hit the back idea button
            $scope.backIdea = function() {
                $mdDialog.hide($scope.backObject());
            };

            // pass the account object to the dialog window
            $scope.backObject = function() {
                var obj = {
                    text: $scope.backText,
                    selectTypes: $scope.selectTypes
                };

                return obj;
            };

            // add checked types to list
            $scope.toggle = function(item, i) {
                var idx = -1;

                for (var j = 0; j < $scope.selectTypes.length; j++) {
                    if ($scope.selectTypes[j].name === item.name) {
                        idx = j;
                        break;
                    }
                }

                // if already selected, remove from list, otherwise add to selected list
                if (idx > -1) {
                    $scope.selectTypes.splice(idx, 1);
                    $scope.types[i].checked = false;
                }
                else {
                    $scope.selectTypes.push(item);
                    $scope.types[i].checked = true;
                }
            };
        }
    ]
);
