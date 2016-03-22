/* global angular */
/* global _ */
/* global moment */

angular.module('flintAndSteel')
.controller('IdeasViewCtrl',
    [
        '$scope', '$stateParams', '$interval', '$mdDialog', 'ideaSvc', 'userSvc', '$state', 'toastSvc', 'sseSvc', '$window',
        function($scope, $stateParams, $interval, $mdDialog, ideaSvc, userSvc, $state, toastSvc, sseSvc, $window) {
            "use strict";

            /*
            The way this works
                1) This view gets an ideaId from the $stateParams object, likely $stateParams.ideaId
                2) The controller then uses ideaSvc.getIdea() to fetch an idea from the server
                3) That idea is stored in $scope.idea
                4) Angular's two-way binding magic
                5) Profit
             */

            var ctrl = this;

            $scope.idea = {};
            $scope.idea.rolesreq = [];
            $scope.typeChips = ideaSvc.getBackTypeChips();
            $scope.selectedTypes = [];
            $scope.selectedType = undefined;
            $scope.searchText = undefined;
            $scope.showEditBackInput = false;
            $scope.userBackIndex = '';
            ctrl.enableTeamEdit = false;
            ctrl.editBackText = '';
            ctrl.newComment = '';
            ctrl.newBack = '';
            ctrl.enableEdit = false;
            ctrl.newUpdate = '';

            //used for chips
            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(type) {
                    return (type._lowername.indexOf(lowercaseQuery) === 0);
                };
            }


            // Why don't we store this information on the server side of things??
            ctrl.refreshTeam = function() {
                // Quick and dirty optimization: if user can only back a single time:
                // If team size is the same as back size we good

                // Refresh ideas based on DB //Set switches properly
                $scope.idea.backs.forEach(function(back) {
                    back.isInTeam = false;
                    for (var i = 0; i < $scope.idea.team.length; i++) {
                        if ($scope.idea.team[i].memberId === back.authorId) {
                            back.isInTeam = true;
                            break;
                        }
                    }
                });

                // Toggle Team Edit
                ctrl.enableTeamEdit = false;
            };

            ctrl.refreshIdea = function() {
                ideaSvc.getIdea($stateParams.ideaId).then(function getIdeaSuccess(response) {
                    if (response.data === 'IDEA_NOT_FOUND') {
                        toastSvc.show('Sorry, that idea does not exist');
                        $state.go('home');
                    }
                    else {
                        $scope.idea = response.data;
                        ctrl.enableEdit = false;
                        ctrl.refreshTeam();
                    }
                    $scope.idea = response.data;
                    ctrl.enableEdit = false;
                    ctrl.refreshTeam();
                }, function getIdeaError(response) {
                    toastSvc.show('Sorry, that idea does not exist');
                    $state.go('home');
                    console.log(response);
                });
            };

            ctrl.refreshIdea();

            // get or delete idea?
            function eventUpdateIdea(idea) {
                if (idea !== 'IDEA_NOT_FOUND') {
                    $scope.$apply(function() {
                        $scope.idea = idea;
                        ctrl.refreshTeam();
                    });
                }
                else {
                    var content;
                    if (ctrl.isUserAuthor()) {
                        content = "Your idea was successfully deleted.";
                    }
                    else {
                        content = 'Oh no! The author just deleted that idea.';
                    }
                    toastSvc.show(content);
                    $state.go('home');
                }
            }

            sseSvc.subscribe("updateIdea_" + $stateParams.ideaId, '/sse/ideas/' + $stateParams.ideaId, eventUpdateIdea);

            $scope.$on('$stateChangeStart', function() {
                sseSvc.unsubscribe('/sse/ideas/' + $scope.idea._id, eventUpdateIdea);
            });

            $scope.momentizeTime = function momentizeTime(time) {
                return moment(time).calendar();
            };

            $scope.momentizeModifiedTime = function momentizeModifiedTime(time) {
                return "Modified " + moment(time).calendar();
            };

            $scope.addNewInteraction = function addNewInteraction(type) {
                var now = new Date().toISOString();
                if (type === 'comments') {
                    ideaSvc.postComment($scope.idea._id, ctrl.newComment, userSvc.getProperty('_id')).then(
                        function success() {
                            $window.ga('send', {
                                hitType: 'event',
                                eventCategory: type,
                                eventAction: 'add'
                            });
                            ctrl.refreshIdea();
                        },
                        function error(response) {
                            console.log(response);
                        }
                    );
                    ctrl.newComment = '';
                    return;
                }
                var obj, backTypes;
                if (type === 'likes') {
                    obj = {
                        userId: userSvc.getProperty('_id')
                    };
                }
                else if (type === 'backs') {
                    obj = {
                        text: ctrl.newBack,
                        authorId: userSvc.getProperty('_id'),
                        timeCreated: now,
                        timeModified: ''
                    };

                    // This removes the stupid $$hashkey property from the selected types.
                    // $ appended properties can't be stored in mongo.
                    backTypes = [];
                    _.forEach($scope.selectedTypes, function(type) {
                        backTypes.push({ name: type.name, _lowername: type._lowername });
                    });
                    obj.types = backTypes;

                    $scope.selectedTypes = [];
                    $scope.selectedType = undefined;
                    ctrl.newBack = '';
                }
                else if (type === 'updates') {
                    obj = {
                        text: ctrl.newUpdate,
                        authorId: userSvc.getProperty('_id'),
                        timeCreated: now
                    };

                    ctrl.newUpdate = '';
                }

                ideaSvc.addInteraction($scope.idea._id, type, obj).then(
                    function success() {
                        $window.ga('send', {
                            hitType: 'event',
                            eventCategory: type,
                            eventAction: 'add'
                        });
                        ctrl.refreshIdea();
                    },
                    function error(response) {
                        console.log(response);
                    }
                );
            };

            $scope.removeInteraction = function removeInteraction(type, obj) {
                if (type === 'likes') {
                    var likeObj = _.find($scope.idea.likes, function(like) {
                        return like.userId === userSvc.getProperty('_id');
                    });
                    ideaSvc.removeInteraction($scope.idea._id, type, likeObj).then(
                        function success() {
                            $window.ga('send', {
                                hitType: 'event',
                                eventCategory: type,
                                eventAction: 'delete'
                            });
                            ctrl.refreshIdea();
                        },
                        function error(response) {
                            console.log(response);
                        }
                    );
                    return;
                }
                var isAuthorofInteraction = ctrl.isUserAuthorOfInteraction(obj);
                if (isAuthorofInteraction || (ctrl.isUserAuthor() && type === 'updates')) {
                    if (type === 'comments') {
                        ideaSvc.deleteComment(obj.commentId).then(function() {
                            $window.ga('send', {
                                hitType: 'event',
                                eventCategory: type,
                                eventAction: 'delete'
                            });
                            ctrl.refreshIdea();
                        },
                        function() {
                            console.log("ERR: Comment " + obj.commentId + " not deleted");
                        });
                    }
                    else {
                        var copyObj = angular.copy(obj);
                        delete copyObj.author; // author object is not stored in database
                        delete copyObj.isInTeam;
                        var backObjs = {
                            _id: copyObj._id
                        };
                        ideaSvc.removeInteraction($scope.idea._id, type, backObjs).then(
                            function success() {
                                $window.ga('send', {
                                    hitType: 'event',
                                    eventCategory: type,
                                    eventAction: 'delete'
                                });
                                ctrl.refreshIdea();
                            },
                            function error(response) {
                                console.log(response);
                            }
                        );
                    }
                }
            };

            $scope.isUserLiked = function isUserLiked() {
                var userId = userSvc.getProperty('_id');
                return (_.findIndex($scope.idea.likes, function(like) { return like.userId === userId;}) !== -1);
            };

            $scope.querySearch = function querySearch(query) {
                var results = query ? $scope.typeChips.filter(createFilterFor(query)) : $scope.typeChips;
                return results;
            };

            $scope.isUserLoggedIn = userSvc.isUserLoggedIn;

            $scope.ideaHasImage = function() {
                return typeof $scope.idea.image !== 'undefined';
            };

            ctrl.editIdea = function(idea) {
                if (ctrl.isUserAuthor()) {
                    //removes $$hashKey and checked because they can't be stored in backend
                    _.forEach($scope.idea.rolesreq, function(roles) {
                        delete roles.$$hashKey;
                        delete roles.checked;
                    });
                    ideaSvc.editIdea($scope.idea._id, idea.title, idea.description, idea.tags, idea.rolesreq, idea.eventId).then(function() {
                        $window.ga('send', {
                            hitType: 'event',
                            eventCategory: 'ideas',
                            eventAction: 'edit'
                        });
                        ctrl.refreshIdea();
                    },
                    function() {
                        console.log("ERR: Could not update idea.");
                    });
                }
            };

            ctrl.deleteIdea = function() {
                if (ctrl.isUserAuthor()) {
                    ideaSvc.deleteIdea($scope.idea._id).then(function() {
                        $window.ga('send', {
                            hitType: 'event',
                            eventCategory: 'ideas',
                            eventAction: 'delete'
                        });
                        return;
                    },
                    function() {
                        console.log("ERR: Idea " + $scope.idea._id + " not deleted");
                    });
                }
            };

            ctrl.confirmDeleteIdea = function(ev) {
                $mdDialog.show($mdDialog.confirm()
                    .title('Deleting Your Idea...')
                    .content('Hey, ' + $scope.idea.author.name + '! Are you sure you want to delete \"' + $scope.idea.title + '\"? ' +
                        'This action is irreversible :( ')
                    .ariaLabel('Delete idea confirmation')
                    .targetEvent(ev)
                    .ok('Yes. Delete it.')
                    .cancel('No thanks!')
                ).then(function() {
                    ctrl.deleteIdea();
                },
                function() {
                    return;
                });
            };

            ctrl.isUserAuthor = function() {
                if (userSvc.isUserLoggedIn() && userSvc.getProperty('_id') === $scope.idea.authorId) {
                    return true;
                }
                return false;
            };

            ////////////////////
            // TEAM FUNCTIONS //
            ////////////////////

            $scope.focusTeam = function() {
                $scope.selectedTab = 3;
            };

            ctrl.updateTeam = function() {
                // Zero out the array
                $scope.idea.team = [];

                // Toggle Team Edit
                ctrl.enableTeamEdit = false;

                // Write to DB
                $scope.idea.backs.forEach(function(back) {
                    if (back.isInTeam === true) {
                        $scope.idea.team.push({memberId: back.authorId});
                    }
                });

                ideaSvc.updateIdea($scope.idea._id, 'team', $scope.idea.team).then(
                    function success() {
                        $window.ga('send', {
                            hitType: 'event',
                            eventCategory: 'teams',
                            eventAction: 'update'
                        });
                    },
                    function error(response) {
                        console.log(response);
                    });

                toastSvc.show('Team has been updated!');
            };

            ctrl.editTeam = function(ev) {
                $mdDialog.show({
                    templateUrl: 'ideas/ideasView/ideaTeam/editTeam.tpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        ideaObj: $scope.idea
                    },
                    controller: function($scope, $mdDialog, ideaObj) {
                        $scope.currIdea = angular.copy(ideaObj);

                        $scope.cancel = function() {
                            $mdDialog.cancel();
                        };

                        $scope.submitEdit = function() {
                            $mdDialog.hide($scope.confirmStatus());
                        };

                        // pass the account object to the dialog window
                        $scope.confirmStatus = function() {
                            var option = {
                                idea: $scope.currIdea
                            };

                            return option;
                        };
                    }
                })
                .then(function(answer) {
                    $scope.idea = answer.idea;
                    ctrl.updateTeam();
                }, function() {
                    $scope.status = 'You canceled the dialog.';
                });
            };

            // remove yourself from a team with the option to remove your back
            ctrl.removeSelfFromTeam = function(ev) {
                $scope.loadEditBack();
                if (ctrl.isUserAuthorOfInteraction($scope.userBack)) {
                    $mdDialog.show({
                        templateUrl: 'ideas/ideasView/ideaTeam/deleteFromTeam.tpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals: { team: true },
                        controller: function($scope, $mdDialog, team) {
                            $scope.team = team;

                            $scope.cancel = function() {
                                $mdDialog.cancel();
                            };

                            $scope.submitDelete = function() {
                                $mdDialog.hide();
                            };
                        }
                    })
                    .then(function() {
                        ctrl.removeUserFromTeam($scope.userBack);
                        $scope.removeInteraction('backs', $scope.userBack);
                    }, function() {
                        $scope.status = 'You canceled the dialog.';
                    });
                }
            };

            ctrl.isUserMemberOfTeam = function() {
                if (angular.isDefined($scope.idea.team) && userSvc.isUserLoggedIn()) {
                    for (var i = 0; i < $scope.idea.team.length; i++) {
                        if (userSvc.getProperty('_id') === $scope.idea.team[i].memberId) {
                            return true;
                        }
                    }
                }
                return false;
            };

            ctrl.isUserExactMemberOfTeam = function(teamIndex) {
                if (angular.isDefined($scope.idea.team) && userSvc.isUserLoggedIn()) {
                    if (userSvc.getProperty('_id') === $scope.idea.team[teamIndex].memberId) {
                        return true;
                    }
                }
                return false;
            };

            ctrl.removeUserFromTeam = function(backOfTeamMember) {
                if (ctrl.isUserMemberOfTeam && ctrl.isUserAuthorOfInteraction(backOfTeamMember)) {
                    backOfTeamMember.isInTeam = false;

                    ctrl.updateTeam();
                }
            };

            ctrl.isUserAuthorOfInteraction = function(interactionObj) {
                if (userSvc.isUserLoggedIn() && userSvc.getProperty('_id') === interactionObj.authorId) {
                    return true;
                }
                return false;
            };

            ///////////////////////
            // BACKING FUNCTIONS //
            ///////////////////////

            $scope.focusBack = function() {
                $scope.selectedTab = 2;
            };

            // Function used to trigger dialog for adding or editting a back
            ctrl.showAddBack = function(ev) {
                var template = '';
                var backObj = '';

                if (userSvc.isUserLoggedIn()) {
                    // Change data passed and template depending on if adding or editting
                    if (!$scope.hasUserBacked()) {
                        template = 'ideas/ideasView/ideaBack/ideaAddBack.tpl.html';
                        backObj = {
                            text: '',
                            types: ''
                        };
                    }
                    else {
                        template = 'ideas/ideasView/ideaBack/ideaEditBack.tpl.html';
                        $scope.loadEditBack();
                        backObj = $scope.userBack;
                    }

                    // Show Dialog
                    $mdDialog.show({
                        controller: 'DialogBackCtrl',
                        templateUrl: template,
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: false,
                        locals: {
                            backingObj: backObj,
                            author: $scope.idea.authorId
                        }
                    })
                    .then(function(answer) {
                        if (!$scope.hasUserBacked()) {
                            ctrl.newBack = answer.text;
                            $scope.selectedTypes = answer.selectTypes;
                            $scope.addNewInteraction('backs');
                        }
                        else {
                            ctrl.editBackText = answer.text;
                            $scope.selectedTypes = answer.selectTypes;
                            ctrl.editBack(backObj);
                        }
                        $scope.edittingBack = false;
                    }, function() {
                        $scope.status = 'You canceled the dialog.';
                    });
                }
            };

            // Object used to update an editted back
            ctrl.editBack = function editBack(back) {
                if (ctrl.isUserAuthorOfInteraction(back)) {
                    var now = new Date().toISOString();
                    var newBack = {}, backTypes;
                    if ($scope.status === 'You canceled the dialog.') {
                        newBack = {
                            text: ctrl.editBackText,
                            authorId: back.authorId,
                            timeCreated: back.timeCreated,
                            timeModified: back.timeModified
                        };
                        backTypes = [];
                        _.forEach($scope.selectedTypes, function(type) {
                            backTypes.push({ name: type.name, _lowername: type._lowername });
                        });
                        newBack.types = backTypes;
                    }
                    else {
                        newBack = {
                            text: ctrl.editBackText,
                            authorId: back.authorId,
                            timeCreated: back.timeCreated,
                            timeModified: now
                        };
                        backTypes = [];
                        _.forEach($scope.selectedTypes, function(type) {
                            backTypes.push({ name: type.name, _lowername: type._lowername });
                        });
                        newBack.types = backTypes;
                    }
                    ideaSvc.editBack($scope.idea._id, back._id, newBack).then(
                        function success() {
                            $window.ga('send', {
                                hitType: 'event',
                                eventCategory: 'backs',
                                eventAction: 'edit'
                            });
                            ctrl.refreshIdea();
                        },
                        function error(response) {
                            console.log(response);
                        }
                    );

                    $scope.showEditBackInput = false;
                    ctrl.editBackText = '';
                    $scope.selectedTypes = [];
                }
            };

            // Removes back for the current author on current idea
            $scope.removeBack = function(ev) {
                $scope.loadEditBack();
                if (ctrl.isUserAuthorOfInteraction($scope.userBack)) {
                    $mdDialog.show({
                        templateUrl: 'ideas/ideasView/ideaTeam/deleteFromTeam.tpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals: { team: false },
                        controller: function($scope, $mdDialog, team) {
                            $scope.team = team;

                            $scope.cancel = function() {
                                $mdDialog.cancel();
                            };

                            $scope.submitDelete = function() {
                                $mdDialog.hide();
                            };
                        }
                    })
                    .then(function() {
                        $scope.removeInteraction('backs', $scope.userBack);
                        if (ctrl.isUserMemberOfTeam()) {
                            ctrl.removeUserFromTeam($scope.userBack);
                        }
                    }, function() {
                        $scope.status = 'You canceled the dialog.';
                    });
                }
            };

            // Checks if the current user has backed the current idea
            $scope.hasUserBacked = function() {
                var hasUserBacked = false;
                if (userSvc.isUserLoggedIn() && typeof $scope.idea.backs !== 'undefined') {
                    $scope.idea.backs.forEach(function(back) {
                        if (userSvc.getProperty('_id') === back.authorId) {
                            hasUserBacked = true;
                        }
                    });
                }
                return hasUserBacked;
            };

            // Check if a back as been edited
            $scope.hasBackBeenEdited = function(back) {
                if (typeof back.timeModified !== 'undefined' && back.timeModified !== '') {
                    return true;
                }
                return false;
            };

            // Loads information from a previously made back by the current user
            $scope.loadEditBack = function loadEditBack(backObj) {
                $scope.userBack = '';
                if (typeof backObj === "undefined") {
                    var backs = $scope.idea.backs;
                    for (var i = 0; i < backs.length; i++) {
                        if (userSvc.getProperty('_id') === backs[i].authorId) {
                            backObj = backs[i];
                            $scope.userBack = backObj;
                            ctrl.editBackText = backObj.text;
                            $scope.selectedTypes = backObj.types.slice();
                            $scope.showEditBackInput = true;
                            break;
                        }
                    }
                }
            };

            // Open up an email to team members
            ctrl.parseTeamEmail = function parseTeamEmail() {
                if ($scope.idea.team.length) {
                    $scope.emailString = "mailto:";
                    $scope.idea.team.forEach(function(teamElement) {
                        if (teamElement.member.mail !== 'undefined') {
                            $scope.emailString += teamElement.member.mail + ';';
                        }
                    });
                    $window.location = $scope.emailString;
                }
            };

            ////////////////////////
            // RATING FUNCTIONS   //
            ////////////////////////

            var MAX_STARS = 5;

            ctrl.editIdeaRating = function(idea) {
                if ($scope.isUserLoggedIn()) {
                    _.forEach(idea.complexity, function(rating) {
                        delete rating.$$hashKey;
                        _.forEach(rating.stars, function(star) {
                            delete star.$$hashKey;
                        });
                    });
                    ideaSvc.editIdeaRating($scope.idea._id, idea.complexity)
                    .then(function() {
                        //ctrl.refreshIdea();
                    }, function() {
                        console.log("ERR: Could not update idea.");
                    });
                }
            };

            //turns a rating value into filled stars
            ctrl.updateStars = function(rating) {
                rating.stars = [];
                for (var i = 0; i < MAX_STARS; i++) {
                    rating.stars.push({ filled: i < rating.value });
                }
                //removes $$hashKey and checked because they can't be stored in backend
                _.forEach(rating.stars, function(roles) {
                    delete roles.$$hashKey;
                });
                ctrl.editIdeaRating($scope.idea);
            };

            $scope.toggle = function(index, rating) {
                if ($scope.isUserLoggedIn()) {
                    if (!$scope.hasUserRated(rating)) {
                        rating.push({
                            value: '',
                            stars: [],
                            authorId: userSvc.getProperty('_id')
                        });
                    }

                    //finds the user's rating and adjusts value
                    var userRating = _.find(rating, ['authorId', userSvc.getProperty('_id')]);
                    if (typeof userRating !== 'undefined') {
                        userRating.value = index + 1;
                        ctrl.updateStars(userRating);
                    }
                }
                else {
                    toastSvc.show('Please login to rate complexity.');
                }
            };

            //Pass $scope.idea.complexity as rating to see if user has rated idea
            $scope.hasUserRated = function hasUserRated(rating) {
                var userRated = false;
                if (userSvc.isUserLoggedIn() && typeof rating !== 'undefined') {
                    var find = _.find(rating, ['authorId', userSvc.getProperty('_id')]);
                    if (typeof find !== 'undefined') {
                        userRated = true;
                    }
                }
                return userRated;
            };

            //Pass 'values' or 'complexity' to retreive values or complexity for user
            $scope.loadUserRating = function loadUserRating(rating) {
                var userRating = {};
                if ($scope.isUserLoggedIn()) {
                    if (typeof rating !== undefined) {
                        rating.forEach(function(value) {
                            if (userSvc.getProperty('_id') === value.authorId) {
                                userRating = value;
                            }
                        });
                    }
                }
                return userRating;
            };
        }
    ]
);
