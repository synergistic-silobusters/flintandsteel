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

            $scope.Event1 = {type:"bg-success", alignment:"left-aligned", date:"January 24", location:"Cleveland", time:"12:00 PM", name:"Monthly Innovation Event", description:"This is the text about the monthly innovation event.  It should be something describing what this event will be like and what we will do.  Something interesting to catch someone's interest."};
            $scope.Event2 = {type:"bg-info", date:"February 22", location:"Global", time:"12:00 PM", name:"E-Week Kickoff", description:"We're kicking off E-week with this fun and exciting event.  Someone type some more things here, I'm an engineer, not an english major.  Let's get a marketing person."};
            $scope.Event3 = {type:"bg-info", alignment:"left-aligned", date:"February 25", location:"Global", time:"12:00 PM", name:"E-Week Wrap-up", description:"Here's where we're going to close E-week.  We're going to have some bosses there to present awards and win some prizes.  You get a car!  You get a car!  And you get a car!"};
            $scope.Event4 = {type:"bg-warning", date:"March 10", location:"Cleveland", time:"5:00 PM", name:"Innovation Challenge Kickoff", description:"We're going to kick off the Cleveland innovation challenge on this day.  We'll do some fun things, have food and drink, and talk about synergy."};
            $scope.Event5 = {type:"bg-warning", alignment:"left-aligned", date:"April", location:"Cleveland", time:"", name:"Innovation Challenge Mid-Point Readout", description:"Scared of presentations?  Welp you're up a creek then.  Take your idea and present to everybody."};
            $scope.Event6 = {type:"bg-warning", alignment:"", date:"June", location:"Cleveland", time:"", name:"Innovation Challenge Final Readout", description:"Mid point readout didn't go well?  Get ready for a grilling from upper management."};
            $scope.Event7 = {type:"bg-info", alignment:"left-aligned", date:"June", location:"Global", time:"", name:"Innovation Challenge Final Readout", description:"You made it past Fluffy and the Devil's snare.  Those were easy compared to this."};
            
            $scope.Events = [$scope.Event1,$scope.Event2, $scope.Event3, $scope.Event4, $scope.Event5, $scope.Event6, $scope.Event7];           

            $scope.navToBrowse = function navToBrowse() {
                $state.go('ideabrowse');
            };

            $scope.showIdeas= false;

            $scope.searchFocus= function searchFocus(){
                console.log("focus");
                $scope.showIdeas=true;
            };


            ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
                $scope.topIdeas = data;
            }, function getIdeaHeadersError(data, status) {
                console.log(status);
            });


            

        }
    ]
);

