/* global angular */
/* global _ */

angular.module('flintAndSteel')
.directive('ideaInput',
    [
        'eventSvc',
        function(eventSvc) {
            "use strict";

            return {
                restrict: 'E',
                scope: {
                    idea: '=',
                    submitFn: '&',
                    submitBtnText: '@',
                    cancelFn: '&',
                    cancelBtnText: '@'
                },
                templateUrl: 'ideas/ideaInput/ideaInput.tpl.html',
                link: function(scope/*, element, attrs, controller, transcludeFn*/) {
                    var nullEvent = {
                        _id: "",
                        name: "No Event"
                    };

                    scope.cancelFn = scope.cancelFn || null;
                    scope.cancelBtnText = scope.cancelBtnText || null;

                    ///////////////////
                    // TAG FUNCTIONS //
                    ///////////////////
                    scope.doesTagExist = function doesTagExist(tag) {
                        if (scope.idea.tags.indexOf(tag) === -1) {
                            return false;
                        }
                        return true;
                    };

                    scope.addTag = function addTag(tag) {
                        var reNonAlpha = /[.,-\/#!$%\^&\*;:{}=\-_`~()<>\'\"@\[\]\|\\\?]/g;
                        tag = tag.replace(reNonAlpha, " ");
                        tag = _.capitalize(_.camelCase(tag));
                        if (scope.idea.tags.length !== 5 && !scope.doesTagExist(tag) && tag !== '') {
                            scope.idea.tags.push(tag);
                        }
                    };

                    scope.tagKeyEvent = function tagKeyEvent(keyEvent) {
                        // Enter
                        if (keyEvent.keyCode === 13) {
                            scope.addTag(scope.tagInput);
                            scope.tagInput = "";
                        }
                    };

                    scope.removeTag = function removeTag(tag) {
                        var index = scope.idea.tags.indexOf(tag);
                        if (index >= 0) {
                            scope.idea.tags.splice(index, 1);
                        }
                    };

                    /////////////////////
                    // EVENT FUNCTIONS //
                    /////////////////////

                    scope.loadEvents = function() {
                        eventSvc.getEvents().then(function getEventsSuccess(response) {
                            scope.events = [nullEvent].concat(response.data);
                        }, function getEventsError(response) {
                            scope.events = [];
                            console.log(response);
                        });
                    };
                }
            };
        }
    ]
);
