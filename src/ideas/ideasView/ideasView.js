/* global angular */
/* global _ */
/* global moment */
/* global EventSource */

angular.module('flintAndSteel')
.controller('IdeasViewCtrl',
    [
        '$scope', '$stateParams', '$interval', '$mdDialog', 'ideaSvc', 'loginSvc', '$state', '$mdToast',
        function($scope, $stateParams, $interval, $mdDialog, ideaSvc, loginSvc, $state, $mdToast){
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
            ctrl.newComment = '';
            ctrl.newBack = '';
            ctrl.enableEdit = false;

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
                        $scope.idea = data;
                        ctrl.enableEdit = false;
                    }
                }, function getIdeaError(data, status) {
                    console.log(status);
                });
            };

            ctrl.refreshIdea();

            var ideaUpdateEvents = new EventSource('/idea/' + $stateParams.ideaId + '/events');
            ideaUpdateEvents.addEventListener("updateIdea_" + $stateParams.ideaId, function(event) {
                var idea = JSON.parse(event.data);
                if(typeof idea !== 'undefined' && idea !== null) {
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

            $scope.addNewInteraction = function addNewInteraction(type) {
                var now = new Date().toISOString();
                if (type === 'comments' || type === 'backs') {
                    if (type === 'comments') {
                        $scope.idea[type].push({
                            text: ctrl.newComment,
                            from: loginSvc.getProperty('name'),
                            time: now
                        });
                    }
                    else if (type === 'backs') {
                        $scope.idea[type].push({
                            text: ctrl.newBack,
                            from: loginSvc.getProperty('name'),
                            time: now,
                            types: $scope.selectedTypes
                        });
                    }
                    ideaSvc.updateIdea($scope.idea.id, type, $scope.idea[type],
                    function success() { },
                    function error(data, status) {
                        console.log(status);
                    });

                    $scope.selectedTypes = [];
                    $scope.selectedType = undefined;
                    ctrl.newComment = '';
                    ctrl.newBack = '';
                }
            };

            $scope.likeIdea = function likeIdea() {
                $scope.idea.likes.push(loginSvc.getProperty('name'));
                ideaSvc.updateIdea($scope.idea.id, 'likes', $scope.idea.likes,
                    function success() { },
                    function error(data, status) {
                        console.log(status);
                    });
                loginSvc.likeIdea($scope.idea.id);
            };

            $scope.unlikeIdea = function unlikeIdea() {
                _.remove($scope.idea.likes, function (n) {
                    return n === loginSvc.getProperty('name');
                });
                ideaSvc.updateIdea($scope.idea.id, 'likes', $scope.idea.likes,
                    function success() { },
                    function error(data, status) {
                        console.log(status);
                    });
                loginSvc.unlikeIdea($scope.idea.id);
            };

            $scope.isUserLiked = function isUserLiked() {
                var likedIdeas = loginSvc.getProperty('likedIdeas');
                //console.log(likedIdeas);
                return (_.findIndex(likedIdeas, function(item) { return item === $scope.idea.id; }) !== -1);
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
                        '               <div>{{user}}</div>' +
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
                    controller: function ($scope, $mdDialog, users) {
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
                    ideaSvc.updateIdea($scope.idea.id, "title", title, function() {
                        ideaSvc.updateIdea($scope.idea.id, "description", description, function() {
                            ideaSvc.updateIdea($scope.idea.id, "editedOn", (new Date()).toISOString(), function() {
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
                    ideaSvc.deleteIdea($scope.idea.id, function() {
                        return;
                    },
                    function() {
                        console.log("ERR: Idea " + $scope.idea.id + " not deleted");
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

            ctrl.isUserAuthor = function() {
                if (loginSvc.isUserLoggedIn() && loginSvc.getProperty('name') === $scope.idea.author) {
                    return true;
                }
                return false;
            };

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(type) {
                    return (type._lowername.indexOf(lowercaseQuery) === 0);
                };
            }
        }
    ]
);
