/* global angular */

angular.module('flintAndSteel')
.controller('HomeViewCtrl',
    [
        '$document', '$scope', '$timeout', '$state','$mdSidenav', 'ideaSvc',
        function($document, $scope, $timeout, $state, $mdSidenav, ideaSvc) {
            "use strict";
                
                
            var word_list = new Array(
            
                {text: "Sit", weight: 8},
                {text: "Amet", weight: 6.2},
                {text: "Consectetur", weight: 5},
                {text: "Adipiscing", weight: 5},
                {text: "Elit", weight: 5},
                {text: "Nam et", weight: 5},
                {text: "Leo", weight: 4},
                {text: "Sapien", weight: 4, link: "http://www.lucaongaro.eu/"},
                {text: "Pellentesque", weight: 3},
                {text: "habitant", weight: 3},
                {text: "morbi", weight: 3},
                {text: "tristisque", weight: 3},
                {text: "senectus", weight: 3},
                {text: "et netus", weight: 3},
                {text: "et malesuada", weight: 3},
                {text: "fames", weight: 2},
                {text: "ac turpis", weight: 2},
                {text: "egestas", weight: 2},
                {text: "Aenean", weight: 2},
                {text: "vestibulum", weight: 2},
                {text: "elit", weight: 2},
                {text: "sit amet", weight: 2},
                {text: "metus", weight: 2},
                {text: "adipiscing", weight: 2},
                {text: "ut ultrices", weight: 2},
                {text: "justo", weight: 1},
                {text: "dictum", weight: 1},
                {text: "Ut et leo", weight: 1},
                {text: "metus", weight: 1},
                {text: "at molestie", weight: 1},
                {text: "purus", weight: 1},
                {text: "Curabitur", weight: 1},
                {text: "diam", weight: 1},
                {text: "dui", weight: 1},
                {text: "ullamcorper", weight: 1},
                {text: "id vuluptate ut", weight: 1},
                {text: "mattis", weight: 1},
                {text: "et nulla", weight: 1},
                {text: "Sed", weight: 1},
                {text: "Sit", weight: 8},
                {text: "Amet", weight: 6.2},
                {text: "Consectetur", weight: 5},
                {text: "Adipiscing", weight: 5},
                {text: "Elit", weight: 5},
                {text: "Nam et", weight: 5},
                {text: "Leo", weight: 4},
                {text: "Sapien", weight: 4, link: "http://www.lucaongaro.eu/"},
                {text: "Pellentesque", weight: 3},
                {text: "habitant", weight: 3},
                {text: "morbi", weight: 3},
                {text: "tristisque", weight: 3},
                {text: "senectus", weight: 3},
                {text: "et netus", weight: 3},
                {text: "et malesuada", weight: 3},
                {text: "fames", weight: 2},
                {text: "ac turpis", weight: 2},
                {text: "egestas", weight: 2},
                {text: "Aenean", weight: 2},
                {text: "vestibulum", weight: 2},
                {text: "elit", weight: 2},
                {text: "sit amet", weight: 2},
                {text: "metus", weight: 2},
                {text: "adipiscing", weight: 2},
                {text: "ut ultrices", weight: 2},
                {text: "justo", weight: 1},
                {text: "dictum", weight: 1},
                {text: "Ut et leo", weight: 1},
                {text: "metus", weight: 1},
                {text: "at molestie", weight: 1},
                {text: "purus", weight: 1},
                {text: "Curabitur", weight: 1},
                {text: "diam", weight: 1},
                {text: "dui", weight: 1},
                {text: "ullamcorper", weight: 1},
                {text: "id vuluptate ut", weight: 1},
                {text: "mattis", weight: 1},
                {text: "et nulla", weight: 1},
                {text: "Sed", weight: 1},
                {text: "Sit", weight: 8},
                {text: "Amet", weight: 6.2},
                {text: "Consectetur", weight: 5},
                {text: "Adipiscing", weight: 5},
                {text: "Elit", weight: 5},
                {text: "Nam et", weight: 5},
                {text: "Leo", weight: 4},
                {text: "Sapien", weight: 4, link: "http://www.lucaongaro.eu/"},
                {text: "Pellentesque", weight: 3},
                {text: "habitant", weight: 3},
                {text: "morbi", weight: 3},
                {text: "tristisque", weight: 3},
                {text: "senectus", weight: 3},
                {text: "et netus", weight: 3},
                {text: "et malesuada", weight: 3},
                {text: "fames", weight: 2},
                {text: "ac turpis", weight: 2},
                {text: "egestas", weight: 2},
                {text: "Aenean", weight: 2},
                {text: "vestibulum", weight: 2},
                {text: "elit", weight: 2},
                {text: "sit amet", weight: 2},
                {text: "metus", weight: 2},
                {text: "adipiscing", weight: 2},
                {text: "ut ultrices", weight: 2},
                {text: "justo", weight: 1},
                {text: "dictum", weight: 1},
                {text: "Ut et leo", weight: 1},
                {text: "metus", weight: 1},
                {text: "at molestie", weight: 1},
                {text: "purus", weight: 1},
                {text: "Curabitur", weight: 1},
                {text: "diam", weight: 1},
                {text: "dui", weight: 1},
                {text: "ullamcorper", weight: 1},
                {text: "id vuluptate ut", weight: 1},
                {text: "mattis", weight: 1},
                {text: "et nulla", weight: 1},
                {text: "Sed", weight: 1},
                {text: "Sit", weight: 8},
                {text: "Amet", weight: 6.2},
                {text: "Consectetur", weight: 5},
                {text: "Adipiscing", weight: 5},
                {text: "Elit", weight: 5},
                {text: "Nam et", weight: 5},
                {text: "Leo", weight: 4}
            );


            $scope.Innovate = {Name: "Ideas",
    						description: "Ideas are the foundation of the Innovation Challenge.  You must log in to create one. \nBrowse ideas by clicking 'All Ideas'."};
            $scope.Comment = {Name: "Comments",
    						description: "Comment on ideas by logging in, clicking on an idea, and going to the comment tab"};
            $scope.Back = {Name: "Backs",
    						description: "Backing is the term used for showing how you can contribute to an idea.  Click on an idea and go to the Back tab to contribute."};
            $scope.Team = {Name: "Team",
    						description: "Teams are formed from anyone who has backed an idea.  The owner of the idea forms the team by selecting members in the team tab."};
            $scope.Browse = {Name: "Browse Ideas",
    						description: "Browse Ideas by clicking 'All Ideas' or by starting to type search text in the bar"};
            $scope.Top = {Name: "Top Ideas",
    						description: "The top ideas bar is on the left hand side of the page.  These ideas are ranked by the most amount of likes."};
            $scope.Like = {Name: "Likes",
    						description: "A like is a simple way to show your support for an idea.  This gives the owner a little reinforcement to keep going!"};
            $scope.Blank = {Name: "",
    						description: ""};
            $scope.faqCards = [$scope.Innovate, $scope.Comment, $scope.Back, $scope.Team, $scope.Browse,$scope.Top,$scope.Like];

            $scope.Event1 = {type: "bg-success", alignment: "left-aligned", date: "January 24",
                            location: "Cleveland", time: "12: 00 PM", name: "Monthly Innovation Event",
    						description: "This is the text about the monthly innovation event.  "};
            $scope.Event2 = {type: "bg-info", date: "February 22",
                            location: "Global", time: "12: 00 PM", name: "E-Week Kickoff",
    						description: "We're kicking off E-week with this fun and exciting event.  Someone type some more things here"};
            $scope.Event3 = {type: "bg-info", alignment: "left-aligned", date: "February 25",
                            location: "Global", time: "12: 00 PM", name: "E-Week Wrap-up",
    						description: "Here's where we're going to close E-week.  We're going to have some bosses there to present awards and win some prizes.  "};
            $scope.Event4 = {type: "bg-warning", date: "March 10",
                            location: "Cleveland", time: "5: 00 PM", name: "Innovation Challenge Kickoff",
    						description: "We're going to kick off the Cleveland innovation challenge on this day.  We'll do some fun things, have food and drink."};
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

            $scope.showIdeas = false;

            $scope.searchFocus = function searchFocus() {
                $scope.showIdeas = true;
            };

            ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
                $scope.topIdeas = data;
            }, function getIdeaHeadersError(data, status) {
                console.log(status);
            });

            $scope.generateWords = function generateWords() {

                for (var i = 0; i < $scope.faqCards.length; i++) { 
                        word_list.push({ text: $scope.faqCards[i].Name, weight: 9, link: "http://www.lucaongaro.eu/" })
                    }

                word_list.push({text: "Get Started", weight: 10, link: "https://github.com/lucaong/jQCloud"});
                word_list.push({text: "All Ideas", weight: 10, link: "http://jquery.com/"});


                for (var i = 0; i < $scope.Events.length; i++) {
                        word_list.push({text: $scope.Events[i].name, weight: 8})
                    }

            };

            $scope.generateWords();

            $timeout(function() {
                var width = angular.element(document.getElementById('wordcloud'))[0].clientWidth,
                    height = angular.element(document.getElementById('wordcloud'))[0].clientHeight;

                // console.log('Passed in: ', width, ', ', height);

                                        
                angular.element("#wordcloud").jQCloud(word_list, {
                    classPattern: null,
                    delay: 50,
                    colors: ["#900100", "#7f7f7f", "#d0d0d0"],
                    fontSize: ["500%", "300%", "150%"],
                    shape: 'cloud',
                    width: width,
                    height: height,
                    autoResize: true
                });
            });
        }
    ]
);

