/* global angular */

angular.module('flintAndSteel')
.controller('HomeViewCtrl',
    [
        '$document', '$scope', '$timeout', '$state','$mdSidenav', 'ideaSvc',
        function($document, $scope, $timeout, $state, $mdSidenav, ideaSvc) {
            "use strict";

            function getInternetExplorerVersion() {
                var rv = -1;
                var ua = navigator.userAgent;
                var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (navigator.appName === 'Microsoft Internet Explorer') {
                    ua = navigator.userAgent;
                    re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                    if (re.exec(ua) !== null) {
                        rv = parseFloat(RegExp.$1);
                    }
                }
                else if (navigator.appName === 'Netscape') {
                    ua = navigator.userAgent;
                    re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
                    if (re.exec(ua) !== null) {
                        rv = parseFloat(RegExp.$1);
                    }
                }
                return rv;
            }
            $scope.IEMessage = function() {
                var v = parseInt(getInternetExplorerVersion());
                console.log(v);
                if (v > 0) {
                    return "Some pages may not render properly in this Browser.  For best experience, please use Google Chrome.";
                }
                else {
                    return "";
                }
            };

            $scope.InternetExplorerMessage = $scope.IEMessage();


            var WordList = new Array({ text: "Innovate", weight: 2.5});

            $scope.IW1 = "Innovation Action Process Change Method Idea Product Effective Solutions Catalyst Revolutionize  ";
            $scope.IW2 = "Future Success Nurture Technology Engineering Accomplishment Creativity Contribution Individual ";
            $scope.IW3 = "Inspire Goal Progress Integration Embedded Review Invest ";
            $scope.IW4 = "Patent Organize Workshop Training Cultivate  Activity Challenge Portfolio Brainstorm Wordcloud Amazing yeee ";
            $scope.IW5 = "Performance Positive Research Organizational Streamline Perspective Cluture Events Startup Lean SAFe Integration Global ";
            $scope.IW6 = "Benefit Platform Exchange Collaborate Perform Individual Employee Opportunity Design Tool Communication ";
            $scope.InnovativeWords = $scope.IW1 + $scope.IW2 + $scope.IW3 + $scope.IW4 + $scope.IW5 + $scope.IW6;

            $scope.Actions = "Ideas Comments Backs Team Likes";

            $scope.Event1 = {type: "bg-success", alignment: "left-aligned", date: "January 24",
                            location: "Cleveland", time: "12: 00 PM", name: "Monthly Innovation Event",
                            description: "This is the text about the monthly innovation event.  "};
            $scope.Event2 = {type: "bg-info", date: "February 22",
                            location: "Global", time: "12: 00 PM", name: "E-Week Kickoff",
                            description: "We're kicking off E-week with this fun and exciting event.  Someone type some more things here"};
            $scope.Event3 = {type: "bg-info", alignment: "left-aligned", date: "February 25",
                            location: "Global", time: "12: 00 PM", name: "E-Week Wrap-up",
                            description: "Here's where we're going to close E-week. We're going to have some bosses there to present awards and win prizes."};
            $scope.Event4 = {type: "bg-warning", date: "March 10",
                            location: "Cleveland", time: "5: 00 PM", name: "Innovation Challenge Kickoff",
                            description: "We're going to kick off the Cleveland innovation challenge on this day. We'll do some fun things, have food."};
            $scope.Event5 = {type: "bg-warning", alignment: "left-aligned", date: "April",
                            location: "Cleveland", time: "", name: "Innovation Challenge Mid-Point Readout",
                            description: "Scared of presentations?  Welp you're up a creek then.  Take your idea and present to everybody."};
            $scope.Event6 = {type: "bg-warning", alignment: "", date: "June",
                            location: "Cleveland", time: "", name: "Innovation Challenge Final Readout",
                            description: "Mid point readout didn't go well?  Get ready for a grilling from upper management."};
            $scope.Event7 = {type: "bg-info", alignment: "left-aligned", date: "June",
                            location: "Global", time: "", name: "Innovation Challenge Final Readout",
                            description: "You made it past Fluffy and the Devil's snare.  Those were easy compared to this."};

            $scope.Events = [$scope.Event1,$scope.Event2, $scope.Event3, $scope.Event4, $scope.Event5, $scope.Event6, $scope.Event7];

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
                    colors: ["#900100", "#7f7f7f","#7f7f7f", "#7f7f7f", "#7f7f7f", "#d0d0d0", "#d0d0d0", "#d0d0d0", "#d0d0d0", "#d0d0d0"],
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
