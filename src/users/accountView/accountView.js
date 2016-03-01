/* global angular */
/* global moment */
/* global _ */

angular.module('flintAndSteel')
.controller('AccountViewCtrl',
    [
        '$scope', '$state', 'toastSvc', 'userSvc', 'ideaSvc',
        function($scope, $state, toastSvc, userSvc, ideaSvc) {
            "use strict";

            // NOTE: Nothing can go above this!
            if (!userSvc.isUserLoggedIn()) {
                $state.go('home');
            }
            else {
                // Get user info
                var userId = userSvc.getProperty('_id');
                userSvc.getUserById(userId).then(
                    function(result) {
                        $scope.user = result.data;
                    }
                );

                $scope.userIdeas = [];
                $scope.userBacks = [];
                $scope.userTeams = [];

                //Get user ideas
                ideaSvc.getUserIdeasById(userId).then(
                    function(result) {
                        var userIdeaSearch = result.data;
                        _.forEach(userIdeaSearch, function(idea) {
                            ideaSvc.getIdea(idea._id).then(
                                function(result) {
                                    result.data.timeCreated = moment(new Date(result.data.timeCreated)).calendar();
                                    result.data.timeModified = moment(new Date(result.data.timeModified)).calendar();
                                    $scope.userIdeas.push(result.data);
                                });
                        });
                    }
                ).catch(function(error) {
                    console.log(error);
                });

                //Get user Backs and Teams
                ideaSvc.getUserBacksById(userId).then(
                    function(result) {
                        var userBackSearch = result.data;
                        _.forEach(userBackSearch, function(idea) {
                            ideaSvc.getIdea(idea._id).then(
                                function(result) {
                                    result.data.timeCreated = moment(new Date(result.data.timeCreated)).calendar();
                                    result.data.timeModified = moment(new Date(result.data.timeModified)).calendar();
                                    $scope.userBacks.push(result.data);
                                    _.some(result.data.team, function(member) {
                                        if (member.memberId === userId) {
                                            $scope.userTeams.push(result.data);
                                        }
                                    });
                                });
                        });
                    }
                ).catch(function(error) {
                    console.log(error);
                });
            }
        }
    ]
);
