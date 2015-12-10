/* global angular */
/* global _ */
/* global moment */
/* global EventSource */

// Dialog Controller used for controlling the behavior of the dialog
//   used for login.
function DialogBackCtrl($scope, $mdDialog, ideaSvc, backingObj) {
    "use strict";
    // Populate values based off current back info
    $scope.types = ideaSvc.getBackTypeChips();
    $scope.backText = backingObj.text;
    $scope.tempTypes = backingObj.types;
    $scope.selectTypes = []; // Variable used for scope issues
    
    for (var k = 0; k < $scope.tempTypes.length; k++) {
        $scope.tempTypes[k].checked = true;
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

angular.module('flintAndSteel')
.controller('IdeasViewCtrl',
    [
        '$scope', '$stateParams', '$interval', '$mdDialog', 'ideaSvc', 'loginSvc', '$state', 'toastSvc',
        function($scope, $stateParams, $interval, $mdDialog, ideaSvc, loginSvc, $state, toastSvc) {
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

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(type) {
                    return (type._lowername.indexOf(lowercaseQuery) === 0);
                };
            }

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
                ideaSvc.getIdea($stateParams.ideaId, function getIdeaSuccess(data) {
                    if (data === 'IDEA_NOT_FOUND') {
                        toastSvc.show('Sorry, that idea does not exist');
                        $state.go('home');
                    }
                    else {
                        $scope.idea = data;
                        if (typeof $scope.idea.team === "undefined")	{
                            $scope.idea.team = [];
                        }
                        ctrl.enableEdit = false;
                        ctrl.refreshTeam();
                    }
                }, function getIdeaError(data, status) {
                    console.log(status);
                });
            };

            ctrl.refreshIdea();

            var ideaUpdateEvents = new EventSource('/idea/' + $stateParams.ideaId + '/events');
            ideaUpdateEvents.addEventListener("updateIdea_" + $stateParams.ideaId, function(event) {
                var idea = JSON.parse(event.data);
                if (typeof idea !== 'undefined' && idea !== null) {
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
            });

            $scope.$on('$stateChangeStart', function() {
                ideaUpdateEvents.close();
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
                    ideaSvc.postComment($scope.idea._id, ctrl.newComment, loginSvc.getProperty('_id'),
                        function success() {
                            ctrl.refreshIdea();
                        },
                        function error(data, status) {
                            console.log(status);
                        }
                    );
                    ctrl.newComment = '';
                    return;
                }
                var obj;
                if (type === 'likes') {
                    obj = {
                        userId: loginSvc.getProperty('_id')
                    };
                }
                else if (type === 'backs') {
                    obj = {
                        text: ctrl.newBack,
                        authorId: loginSvc.getProperty('_id'),
                        time: now,
                        types: $scope.selectedTypes
                    };

                    $scope.selectedTypes = [];
                    $scope.selectedType = undefined;
                    ctrl.newBack = '';
                }
                else if (type === 'updates') {
                    obj = {
                        text: ctrl.newUpdate,
                        authorId: loginSvc.getProperty('_id'),
                        time: now
                    };

                    ctrl.newUpdate = '';
                }

                ideaSvc.addInteraction($scope.idea._id, type, obj,
                    function success() {
                        ctrl.refreshIdea();
                    },
                    function error(data, status) {
                        console.log(status);
                    }
                );
            };

            $scope.removeInteraction = function removeInteraction(type, obj) {
                if (type === 'likes') {
                    var likeObj = {
                        userId: loginSvc.getProperty('_id')
                    };
                    ideaSvc.removeInteraction($scope.idea._id, type, likeObj,
                        function success() {
                            ctrl.refreshIdea();
                        },
                        function error(data, status) {
                            console.log(status);
                        }
                    );
                    return;
                }
                var isAuthorofInteraction = ctrl.isUserAuthorOfInteraction(obj);
                if (isAuthorofInteraction || (ctrl.isUserAuthor() && type === 'updates')) {
                    if (type === 'comments') {
                        ideaSvc.deleteComment(obj.commentId, function() {
                            ctrl.refreshIdea();
                        },
                        function() {
                            console.log("ERR: Comment " + obj.commentId + " not deleted");
                        });
                    }
                    else {
                        var copyObj = angular.copy(obj);
                        delete copyObj.author; // author object is not stored in database
                        ideaSvc.removeInteraction($scope.idea._id, type, copyObj,
                            function success() {
                                ctrl.refreshIdea();
                            },
                            function error(data, status) {
                                console.log(status);
                            }
                        );
                    }
                }
            };

            $scope.isUserLiked = function isUserLiked() {
                var userId = loginSvc.getProperty('_id');
                return (_.findIndex($scope.idea.likes, function(like) { return like.userId === userId;}) !== -1);
            };

            $scope.querySearch = function querySearch(query) {
                var results = query ? $scope.typeChips.filter(createFilterFor(query)) : $scope.typeChips;
                return results;
            };

            $scope.openLikes = function openLikes(ev, likesArray) {
                $mdDialog.show({
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    template:
                        '<md-dialog aria-label="Users dialog">' +
                        '   <md-toolbar>' +
                        '       <div class="md-toolbar-tools">' +
                        '           <h2>Users who liked this idea</h2>' +
                        '       </div>' +
                        '   </md-toolbar>' +
                        '   <md-dialog-content>' +
                        '       <md-list>' +
                        '           <md-list-item ng-if="users.length > 0" ng-repeat="user in users">' +
                        '               <div layout="row">' +
                        '                   <div layout="row" layout-align="center center">' +
                        '                       <identicon username="user.user.username" size="24"></identicon>' +
                        '                   </div>' +
                        '                   <span>&nbsp;</span>' +
                        '                   {{user.user.name}}' +
                        '               </div>' +
                        '           </md-list-item>' +
                        '           <md-list-item ng-if="users.length === 0">' +
                        '               <div>No likes yet!</div>' +
                        '           </md-list-item>' +
                        '       </md-list>' +
                        '   </md-dialog-content>' +
                        '   <div class="md-actions">' +
                        '       <md-button ng-click="closeDialog()" class="md-primary">' +
                        '           Close' +
                        '       </md-button>' +
                        '   </div>' +
                        '</md-dialog>',
                    locals: {
                        users: likesArray
                    },
                    controller: function($scope, $mdDialog, users) {
                        $scope.users = users;
                        console.log($scope.users);
                        $scope.closeDialog = function() {
                            $mdDialog.hide();
                        };
                    }
                });
            };

            $scope.isUserLoggedIn = loginSvc.isUserLoggedIn;

            $scope.ideaHasImage = function() {
                return typeof $scope.idea.image !== 'undefined';
            };

            ctrl.editIdea = function(title, description) {
                if (ctrl.isUserAuthor()) {
                    ideaSvc.editIdea($scope.idea._id, title, description, [], function() {
                        ctrl.refreshIdea();
                    },
                    function() {
                        console.log("ERR: Could not update idea.");
                    });
                }
            };

            ctrl.deleteIdea = function() {
                if (ctrl.isUserAuthor()) {
                    ideaSvc.deleteIdea($scope.idea._id, function() {
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

                ideaSvc.updateIdea($scope.idea._id, 'team', $scope.idea.team,
                    function success() {
                        //console.log(data);
                    },
                    function error(data, status) {
                        console.log(status);
                    });

                toastSvc.show('Team has been updated!');
            };

            ctrl.isUserAuthor = function() {
                if (loginSvc.isUserLoggedIn() && loginSvc.getProperty('_id') === $scope.idea.authorId) {
                    return true;
                }
                return false;
            };

            ctrl.isUserMemberOfTeam = function() {
                if (angular.isDefined($scope.idea.team) && loginSvc.isUserLoggedIn()) {
                    for (var i = 0; i < $scope.idea.team.length; i++) {
                        if (loginSvc.getProperty('_id') === $scope.idea.team[i].memberId) {
                            return true;
                        }
                    }
                }
                return false;
            };

            ctrl.isUserExactMemberOfTeam = function(teamIndex) {
                if (angular.isDefined($scope.idea.team) && loginSvc.isUserLoggedIn()) {
                    if (loginSvc.getProperty('_id') === $scope.idea.team[teamIndex].memberId) {
                        return true;
                    }
                }
                return false;
            };

            ctrl.removeUserFromTeam = function(backOfTeamMember) {
                backOfTeamMember.isInTeam = false;

                ctrl.updateTeam();
            };

            ctrl.isUserAuthorOfInteraction = function(interactionObj) {
                if (loginSvc.isUserLoggedIn() && loginSvc.getProperty('_id') === interactionObj.authorId) {
                    return true;
                }
                return false;
            };

            ///////////////////////
            // BACKING FUNCTIONS //
            ///////////////////////

            // Function used to trigger dialog for adding or editting a back
            $scope.showAddBack = function(ev) {
                var template = '';
                var backObj = '';

                // Change data passed and template depending on if adding or editting
                if (!$scope.hasUserBacked()) {
                    template = 'ideas/ideaBack/ideaAddBack.tpl.html';
                    backObj = {
                        text: '',
                        types: $scope.selectedTypes
                    };
                }
                else {
                    template = 'ideas/ideaBack/ideaEditBack.tpl.html';
                    $scope.loadEditBack();
                    backObj = $scope.userBack;
                }

                // Show Dialog
                $mdDialog.show({
                    controller: DialogBackCtrl,
                    templateUrl: template,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        backingObj: backObj
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
            };

            // Object used to update an editted back
            ctrl.editBack = function editBack(back) {
                if (ctrl.isUserAuthorOfInteraction(back)) {
                    var now = new Date().toISOString();
                    var newBack = {};
                    if ($scope.status === 'You canceled the dialog.') {
                        newBack = {
                            text: ctrl.editBackText,
                            authorId: back.authorId,
                            time: back.time,
                            timeModified: now,
                            types: $scope.selectedTypes
                        };
                    }
                    else {
                        newBack = {
                            text: ctrl.editBackText,
                            authorId: back.authorId,
                            time: back.time,
                            types: $scope.selectedTypes
                        };
                    }
                    ideaSvc.editBack($scope.idea._id, back.authorId, newBack,
                        function success() {
                            ctrl.refreshIdea();
                        },
                        function error(data, status) {
                            console.log(status);
                        }
                    );
                    $scope.showEditBackInput = false;
                    ctrl.editBackText = '';
                    $scope.selectedTypes = [];
                }
            };

            ctrl.parseTeamEmail = function parseTeamEmail() {
                var emailString = "mailto:";
                if (angular.isDefined($scope.idea.team)) {
                    $scope.idea.team.forEach(function(teamElement) {
                        emailString += teamElement.member.mail + ';';
                    });
                };
                return emailString;
            };

            $scope.removeBack = function() {
                $scope.loadEditBack();
                $scope.removeInteraction('back', $scope.userBack);
            };

            // Checks if the current user has backed the current idea
            $scope.hasUserBacked = function() {
                var hasUserBacked = false;
                if (loginSvc.isUserLoggedIn() && typeof $scope.idea.backs !== 'undefined') {
                    $scope.idea.backs.forEach(function(back) {
                        if (loginSvc.getProperty('_id') === back.authorId) {
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
                if (typeof backObj === "undefined") {
                    var backs = $scope.idea.backs;
                    for (var i = 0; i < backs.length; i++) {
                        if (loginSvc.getProperty('_id') === backs[i].authorId) {
                            backObj = backs[i];
                            break;
                        }
                    }
                }
                $scope.userBack = backObj;
                ctrl.editBackText = backObj.text;
                $scope.selectedTypes = backObj.types.slice();
                $scope.showEditBackInput = true;
            };
        }
    ]
);
