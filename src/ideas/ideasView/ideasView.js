/* global angular */

angular.module('flintAndSteel')
.controller('IdeasViewCtrl',
	[
		'$scope',
		'$stateParams',
		'$interval',
		'ideaSvc',
		'loginSvc',
		function($scope, $stateParams, $interval, ideaSvc, loginSvc){

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

			$scope.addNewInteraction = function addNewInteraction(type, content) {
				if (type === 'comments' || type === 'backs') {
					if (type === 'comments') {
						$scope.idea[type].push({
							text: content,
							from: loginSvc.getProperty('name'),
							time: moment().calendar()
						});
					}
					else if (type === 'backs') {
						$scope.idea[type].push({
							text: content,
							from: loginSvc.getProperty('name'),
							time: moment().calendar(),
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
					document.getElementById('comment-box').value = '';
					document.getElementById('back-box').value = '';
					angular.element(document.getElementById('comment-box-container')).removeClass('md-input-has-value');
					angular.element(document.getElementById('back-box-container')).removeClass('md-input-has-value');
					content = null;
					$scope.selectedTypes = [];
					$scope.selectedType = undefined;
				}
			};

			$scope.likeIdea = function likeIdea() {
				$scope.idea.likes++;
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
				$scope.idea.likes--;
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
