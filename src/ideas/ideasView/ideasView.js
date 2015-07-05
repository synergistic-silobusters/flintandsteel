/* global angular */

angular.module('flintAndSteel')
.controller('IdeasViewCtrl',
	[
		'$scope',
		'$stateParams',
		'$interval',
		'$mdDialog',
		'ideaSvc',
		'loginSvc',
		function($scope, $stateParams, $interval, $mdDialog, ideaSvc, loginSvc){

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

			ideaSvc.getIdea($stateParams.ideaId, function getIdeaSuccess(data) {
				$scope.idea = data;
			}, function getIdeaError(data, status, headers, config) {
				console.log(status);
			});

			var ideaUpdateEvents = new EventSource('/idea/' + $stateParams.ideaId + '/events');
			ideaUpdateEvents.addEventListener("updateIdea_" + $stateParams.ideaId, function(event) {
				var idea = JSON.parse(event.data);
	      if(typeof idea !== 'undefined') {
					$scope.$apply(function() {
						$scope.idea = idea;
					});
	      }
	    });

			$scope.$on('$stateChangeStart', function() {
				ideaUpdateEvents.close();
			});

			$scope.momentizeTime = function momentizeTime(time) {
				return moment(time).calendar();
			}

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
					function success(data) {
						//console.log(data);
					},
					function error(data, status, headers, config) {
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
					function success(data) {
						//console.log(data);
					},
					function error(data, status, headers, config) {
						console.log(status);
					});
				loginSvc.likeIdea($scope.idea.id);
			};

			$scope.unlikeIdea = function unlikeIdea() {
				_.remove($scope.idea.likes, function (n) {
					return n === loginSvc.getProperty('name');
				});
				ideaSvc.updateIdea($scope.idea.id, 'likes', $scope.idea.likes,
					function success(data) {
						//console.log(data);
					},
					function error(data, status, headers, config) {
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
				var results = query ? $scope.typeChips.filter(createFilterFor(query)) : [];
				return results;
	    	};

	    	$scope.openLikes = function openLikes(ev, likesArray) {
				$mdDialog.show({
					parent: angular.element(document.body),
					targetEvent: ev,
					template:
						'<md-dialog aria-label="Users dialog">' +
						'	<md-toolbar>' +
						'		<div class="md-toolbar-tools">' +
						'			<h2>Users who liked this idea</h2>' +
						'		</div>' +
						'	</md-toolbar>' +
						'	<md-dialog-content>' +
						'		<md-list>' +
						'			<md-list-item ng-if="users.length > 0" ng-repeat="user in users">' +
						'				<div>{{user}}</div>' +
						'			</md-list-item>' +
						'			<md-list-item ng-if="users.length === 0">' +
						'				<div>No likes yet!</div>' +
						'			</md-list-item>' +
						'		</md-list>' +
						'	</md-dialog-content>' +
						'	<div class="md-actions">' +
						'		<md-button ng-click="closeDialog()" class="md-primary">' +
						'			Close' +
						'		</md-button>' +
						'	</div>' +
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

			function createFilterFor(query) {
				var lowercaseQuery = angular.lowercase(query);
				return function filterFn(type) {
					return (type._lowername.indexOf(lowercaseQuery) === 0);
				};
			}
		}
	]
);
