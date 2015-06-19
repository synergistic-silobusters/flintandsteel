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

			$scope.idea = {};
			$scope.typeChips = ideaSvc.getBackTypeChips();
			$scope.selectedTypes = [];
			$scope.selectedType = undefined;
			$scope.searchText = undefined;

			getIdea = function() {
				ideaSvc.getIdea($stateParams.ideaId, function getIdeaSuccess(data) {
					$scope.idea = data;
				}, function getIdeaError(data, status, headers, config) {
					console.log(status);
				});
			};

			getIdea();
			var ideaInterval = $interval(getIdea, 3000);

			$scope.$on('$stateChangeStart', function() {
				$interval.cancel(ideaInterval);
			});

			$scope.momentizeTime = function momentizeTime(time) {
				return moment(time).calendar();
			}

			$scope.addNewInteraction = function addNewInteraction(type, content) {
				var now = new Date().toISOString();
				if (type === 'comments' || type === 'backs') {
					if (type === 'comments') {
						$scope.idea[type].push({
							text: content,
							from: loginSvc.getProperty('name'),
							time: now
						});
					}
					else if (type === 'backs') {
						$scope.idea[type].push({
							text: content,
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
					var commentBox = document.getElementById('comment-box');
					var backBox = document.getElementById('back-box');
					if (commentBox !== null) {
						commentBox.value = '';
						angular.element(document.getElementById('comment-box-container')).removeClass('md-input-has-value');
					}
					if (backBox !== null) {
						backBox.value = '';
						angular.element(document.getElementById('back-box-container')).removeClass('md-input-has-value');
					}

					content = null;
					$scope.selectedTypes = [];
					$scope.selectedType = undefined;
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
