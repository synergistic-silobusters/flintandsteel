/* global angular */

angular.module('flintAndSteel')
.controller('HomeViewCtrl',
    [
        '$document', '$scope', '$timeout', '$window', '$state', 'ideaSvc', 'sseSvc', '$interval', '$location', '$anchorScroll',
        function($document, $scope, $timeout, $window, $state, ideaSvc, sseSvc, $interval, $location, $anchorScroll) {
            "use strict";

            // Check to make sure the document has finished loading the html
            //   before showing it to reduce jank
            $scope.loaded = false;
            $scope.showTop = false;
            $scope.ideas = [];
            $scope.topIdeas = [];
            $scope.load = function load() {
                if (document.readyState !== 'complete') {
                    return;
                }

                $scope.loaded = true;
            };
            var loadTimer = $interval($scope.load, 100);

            // Destroy timer on page change
            $scope.$on('$destroy', function() {
                $interval.cancel(loadTimer);
            });

            function setIdeaHeaders(data) {
                $scope.$apply(function() {
                    $scope.topIdeas = data;
                });
            }

            function refreshHeaders() {
                ideaSvc.getIdeaHeaders().then(function getIdeaHeadersSuccess(response) {
                    $scope.topIdeas = response.data;
                    $scope.loadMore();
                }, function getIdeaHeadersError(response) {
                    console.log(response);
                });
            }

            // causes mousewheel action to trigger scroll
            $('#parent').bind('mousewheel', function(e) { // jshint ignore:line
                e = null;
                
                $('#parent').scroll(); // jshint ignore:line
                var top = $('#parent').offset().top; // jshint ignore:line
                if (top < -200) {
                    $scope.showTop = true;
                }
                else {
                    $scope.showTop = false;
                }
            });

            // Loads more ideas
            $scope.loadMore = function loadMore() {
                if ($scope.topIdeas.length > $scope.ideas.length) {
                    var last = -1;
                    if ($scope.ideas.length !== 0) {
                        last = $scope.ideas.length - 1;
                    }

                    for (var i = 1; i <= 4; i++) {
                        if ($scope.topIdeas.length > last + i) {
                            $scope.ideas.push($scope.topIdeas[last + i]);
                        }
                        else {
                            break;
                        }
                    }
                }
            };

            $scope.top = function() {
                $scope.showTop = false;
                $location.hash('parent');
                $anchorScroll();
            };

            refreshHeaders();

            sseSvc.subscribe("newHeaders", "/sse/ideas", setIdeaHeaders);

            $scope.$root.$on('newIdeaAdded', refreshHeaders);

            $scope.internetExplorerMessage = "Some pages may not render properly in this Browser.  For best experience, please use Google Chrome.";

            $scope.Event2 = {type: "bg-info", date: "Feb 2016",
                            location: "Global", time: "", name: "Ideation Events and E-Week",
                            description: "Brainstorm your idea and learn more about the Innovation Challenge"};
            $scope.Event3 = {type: "bg-warning", alignment: "left-aligned", date: "March 2016",
                            location: "Global", time: "", name: "Innovation Challenge Begins",
                            description: "Finalize your team and start developing your idea"};
            $scope.Event4 = {type: "bg-warning", date: "May 2016",
                            location: "Regional", time: "", name: "Innovation Challenge Readouts",
                            description: "Local events allow your team to share your developed idea"};
            $scope.Event5 = {type: "bg-warning", alignment: "left-aligned", date: "June 2016",
                            location: "Global", time: "", name: "Global Innovation Challenge – Executive Pitch",
                            description: "Select teams will have the opportunity to pitch their idea to Rockwell Automation leadership"};


            $scope.Events = [$scope.Event2, $scope.Event3, $scope.Event4, $scope.Event5];

            function getInternetExplorerVersion(navObj) {
                var browserVersion = -1;
                var userAgent = navObj.userAgent;
                var versionMatcher;
                var searchResults;
                if (navObj.appName === 'Microsoft Internet Explorer') {
                    versionMatcher = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                    searchResults = versionMatcher.exec(userAgent);
                    if (searchResults !== null) {
                        browserVersion = parseFloat(searchResults[1]);
                    }
                }
                else if (navObj.appName === 'Netscape') {
                    versionMatcher = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
                    searchResults = versionMatcher.exec(userAgent);
                    if (searchResults !== null) {
                        browserVersion = parseFloat(searchResults[1]);
                    }
                }
                return browserVersion;
            }

            $scope.browserVersion = parseInt(getInternetExplorerVersion($window.navigator));

            $scope.navToBrowse = function navToBrowse() {
                $state.go('ideabrowse');
            };
        }
    ]
);
