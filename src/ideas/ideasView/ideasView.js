/* global angular */
/* global _ */
/* global moment */
/* global EventSource */

angular.module('flintAndSteel')
.controller('IdeasViewCtrl',
    [
        '$scope', '$stateParams', '$interval', '$mdDialog', 'ideaSvc', 'loginSvc', '$state', '$mdToast',
        function($scope, $stateParams, $interval, $mdDialog, ideaSvc, loginSvc, $state, $mdToast) {
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
            ctrl.editBackText = '';            
            ctrl.newComment = '';
            ctrl.newBack = '';
            ctrl.enableEdit = false;

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
            };

            ctrl.refreshIdea = function() {
                ideaSvc.getIdea($stateParams.ideaId, function getIdeaSuccess(data) {
                    if (data === 'IDEA_NOT_FOUND') {
                        $mdToast.show($mdToast.simple()
                  .content('Sorry, that idea does not exist')
                  .action('OK')
                  .highlightAction(false)
                  .position('top right'));
                        $state.go('home');
                    }
                    else {
                        data.likes.forEach(function(like) {
                            loginSvc.getUserById(like.userId, function getUserByIdSuccess(userObj) {
                                like.user = userObj;
                            }, function getUserByIdError(data, status) {
                                like.user = {
                                    name: "Unknown User",
                                    mail: "unknown@unknown.com",
                                    username: "unknown"
                                };
                                console.log(status);
                            });
                        });
                        data.comments.forEach(function(comment) {
                            loginSvc.getUserById(comment.authorId, function getUserByIdSuccess(userObj) {
                                comment.author = userObj;
                            }, function getUserByIdError(data, status) {
                                comment.author = {
                                    name: "Unknown User",
                                    mail: "unknown@unknown.com",
                                    username: "unknown"
                                };
                                console.log(status);
                            });
                        });
                        data.backs.forEach(function(back) {
                            loginSvc.getUserById(back.authorId, function getUserByIdSuccess(userObj) {
                                back.author = userObj;
                            }, function getUserByIdError(data, status) {
                                back.author = {
                                    name: "Unknown User",
                                    mail: "unknown@unknown.com",
                                    username: "unknown"
                                };
                                console.log(status);
                            });
                        });
                        data.team.forEach(function(member) {
                            loginSvc.getUserById(member.memberId, function getUserByIdSuccess(userObj) {
                                member.member = userObj;
                            }, function getUserByIdError(data, status) {
                                member.member = {
                                    name: "Unknown User",
                                    mail: "unknown@unknown.com",
                                    username: "unknown"
                                };
                                console.log(status);
                            });
                        });
                        loginSvc.getUserById(data.authorId, function getUserByIdSuccess(userObj) {
                            data.author = userObj;
                        }, function getUserByIdError(data, status) {
                            data.author = {
                                name: "Unknown User",
                                mail: "unknown@unknown.com",
                                username: "unknown"
                            };
                            console.log(status);
                        });
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
                    $mdToast.show($mdToast.simple()
                        .content(content)
                        .action('OK')
                        .highlightAction(false)
                        .position('top right'));
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
                if (type === 'comments' || type === 'backs') {
                    if (type === 'comments') {
                        $scope.idea[type].push({
                            text: ctrl.newComment,
                            authorId: loginSvc.getProperty('_id'),
                            time: now
                        });
                    }
                    else if (type === 'backs') {
                        $scope.idea[type].push({
                            text: ctrl.newBack,
                            authorId: loginSvc.getProperty('_id'),
                            time: now,
                            types: $scope.selectedTypes
                        });
                    }
                    ideaSvc.updateIdea($scope.idea._id, type, $scope.idea[type],
                    function success() { },
                    function error(data, status) {
                        console.log(status);
                    });

                    $scope.selectedTypes = [];
                    $scope.selectedType = undefined;
                    ctrl.newComment = '';
                    ctrl.newBack = '';
                    ctrl.refreshIdea();
                }
            };

            $scope.likeIdea = function likeIdea() {
                $scope.idea.likes.push({userId: loginSvc.getProperty('_id')});
                ideaSvc.updateIdea($scope.idea._id, 'likes', $scope.idea.likes,
                    function success() { },
                    function error(data, status) {
                        console.log(status);
                    });
                loginSvc.likeIdea($scope.idea._id);
                ctrl.refreshIdea();
            };

            $scope.unlikeIdea = function unlikeIdea() {
                _.remove($scope.idea.likes, function(n) {
                    return n.userId === loginSvc.getProperty('_id');
                });
                ideaSvc.updateIdea($scope.idea._id, 'likes', $scope.idea.likes,
                    function success() { },
                    function error(data, status) {
                        console.log(status);
                    });
                loginSvc.unlikeIdea($scope.idea._id);
                ctrl.refreshIdea();
            };

            $scope.isUserLiked = function isUserLiked() {
                var likedIdeas = loginSvc.getProperty('likedIdeas');
                //console.log(likedIdeas);
                return (_.findIndex(likedIdeas, function(item) { return item === $scope.idea._id; }) !== -1);
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
                        '               <div>{{user.user.name}}</div>' +
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
                    ideaSvc.updateIdea($scope.idea._id, "title", title, function() {
                        ideaSvc.updateIdea($scope.idea._id, "description", description, function() {
                            ideaSvc.updateIdea($scope.idea._id, "editedOn", (new Date()).toISOString(), function() {
                                ctrl.refreshIdea();
                            },
                            function() {
                                console.log("ERR: Could not update idea.");
                            });
                        },
                        function() {
                            console.log("ERR: Could not update idea.");
                        });
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
                    .content('Hey, ' + $scope.idea.author + '! Are you sure you want to delete \"' + $scope.idea.title + '\"? This action is irreversible :( ')
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
                // Write to DB
                $scope.idea.backs.forEach(function(back) {
                    if (back.isInTeam) {
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
            };

            ctrl.isUserAuthor = function() {
                if (loginSvc.isUserLoggedIn() && loginSvc.getProperty('_id') === $scope.idea.authorId) {
                    return true;
                }
                return false;
            };

            ctrl.isUserAuthorOfComment = function(commentIndex) {
                if (loginSvc.isUserLoggedIn() && loginSvc.getProperty('_id') === $scope.idea.comments[commentIndex].authorId) {
                    return true;
                }
                return false;
            };

            ctrl.isUserAuthorOfBack = function(backIndex) {
                if (loginSvc.isUserLoggedIn() && loginSvc.getProperty('_id') === $scope.idea.backs[backIndex].authorId) {
                    return true;
                }
                return false;
            };

            ctrl.deleteComment = function(commentIndex) {
                if (ctrl.isUserAuthorOfComment(commentIndex)) {
                    $scope.idea.comments.splice(commentIndex, 1, {
                        text: "This comment was deleted",
                        from: loginSvc.getProperty('name'),
                        deleted: true,
                        time: new Date().toISOString()
                    });
                    ideaSvc.updateIdea($scope.idea._id, "comments", $scope.idea.comments, function() {
                        return;
                    },
                    function() {
                        console.log("ERR: Comment " + commentIndex + " not deleted");
                    });
                }
            };

            ctrl.editBack = function editBack(backIndex) {
                if (ctrl.isUserAuthorOfBack(backIndex)) {
                    var now = new Date().toISOString();
                    $scope.idea.backs[backIndex].text = ctrl.editBackText;
                    $scope.idea.backs[backIndex].types = $scope.selectedTypes;
                    $scope.idea.backs[backIndex].timeModified = now;
                    ideaSvc.updateIdea($scope.idea._id, 'backs', $scope.idea.backs,
                    function success() {
                        $scope.showEditBackInput = false;
                        ctrl.editBackText = '';                   
                    },
                    function error(data, status) {
                        console.log(status);
                    });
                    ctrl.refreshIdea();
                }
            };            

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

            $scope.hasBackBeenEdited = function(back) {
                if (typeof back.timeModified !== 'undefined' && back.timeModified !== '') {
                    return true;
                }
                return false;
            };

            $scope.loadEditBack = function loadEditBack() {
                $scope.idea.backs.forEach(function(back, index) {
                    if (loginSvc.getProperty('_id') === back.authorId) {
                        $scope.userBackIndex = index;
                        ctrl.editBackText = back.text;
                        $scope.selectedTypes = back.types;
                        $scope.showEditBackInput = true;                        
                    }
                });
            };            
        }
    ]
);
