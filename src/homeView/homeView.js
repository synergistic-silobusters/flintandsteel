/* global angular */

angular.module('flintAndSteel')
.controller('HomeViewCtrl',
    [
        '$document', '$scope', '$timeout', '$window', '$state','$mdSidenav', 'ideaSvc',
        function($document, $scope, $timeout, $window, $state, $mdSidenav, ideaSvc) {
            "use strict";


            $scope.internetExplorerMessage = "Some pages may not render properly in this Browser.  For best experience, please use Google Chrome.";

            var WordList = new Array({ text: "Innovate", weight: 2.5});

            $scope.IW1 = "Innovation Action Process Change Method Idea Product Effective Solutions Catalyst Revolutionize  ";
            $scope.IW2 = "Future Success Nurture Technology Engineering Accomplishment Creativity Contribution Individual ";
            $scope.IW3 = "Inspire Goal Progress Integration Embedded Review Invest ";
            $scope.IW4 = "Patent Organize Workshop Training Cultivate  Activity Challenge Portfolio Brainstorm Wordcloud Amazing yeee ";
            $scope.IW5 = "Performance Positive Research Organizational Streamline Perspective Cluture Events Startup Lean SAFe Integration Global ";
            $scope.IW6 = "Benefit Platform Exchange Collaborate Perform Individual Employee Opportunity Design Tool Communication ";
            $scope.InnovativeWords = $scope.IW1 + $scope.IW2 + $scope.IW3 + $scope.IW4 + $scope.IW5 + $scope.IW6;

            $scope.Actions = "Ideas Comments Backs Team Likes";


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

            ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
                $scope.topIdeas = data;
                console.log(data);
            }, function getIdeaHeadersError(data, status) {
                console.log(status);
            });

            $scope.generateWords = function generateWords() {

                //Click handler overrides the link, link is just there as a temp fix to make the word light up on mouse over
                WordList.push({ text: "Get Started", weight: 10, link: "#", handlers: { click: function() { $scope.navToBrowse();}}});
                WordList.push({ text: "All Ideas", weight: 10, link: "#", handlers: { click: function() { $scope.navToBrowse();}}});

                var actionsArray = $scope.Actions.split(" ");
                var i = 0;
                for (i = 0; i < actionsArray.length; i++) {
                    WordList.push({ text: actionsArray[i], weight: 7});
                }

                for (i = 0; i < $scope.Events.length; i++) {
                    WordList.push({text: $scope.Events[i].name, weight: 3.5});
                }
                var fillerWordsArr = $scope.InnovativeWords.split(" ");

                for (i = 0; i < fillerWordsArr.length; i++) {
                    WordList.push({text: fillerWordsArr[i], weight: 2.5});
                }

            };

            $scope.generateWords();

            $timeout(function() {
                var width = angular.element(document.getElementById('wordcloud'))[0].clientWidth,
                    height = angular.element(document.getElementById('wordcloud'))[0].clientHeight;

                angular.element("#wordcloud").jQCloud(WordList, {
                    classPattern: null,
                    delay: 50,
                    colors: ["#900100", "#7f7f7f","#7f7f7f", "#7f7f7f", "#7f7f7f", "#b7b7b7", "#b7b7b7", "#b7b7b7", "#b7b7b7", "#b7b7b7"],
                    fontSize: { from: 0.05, to: 0.01 },
                    shape: 'cloud',
                    width: width,
                    height: height,
                    autoResize: true
                });
            });
        }
    ]
);
