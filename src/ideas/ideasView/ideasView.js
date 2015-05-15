/* global angular */

angular.module('flintAndSteel')
.controller('IdeasViewCtrl', 
	[
		'$scope',
		'$stateParams',
		'ideaSvc',
		'loginSvc', 
		function($scope, $stateParams, ideaSvc, loginSvc){

			/*
			The way this works
				1) This view gets an ideaId from the $stateParams object, likely $stateParams.ideaId
				2) The controller then uses ideaSvc.getIdea() to fetch an idea from the server
				3) That idea is stored in $scope.idea
				4) Angular's two-way binding magic
				5) Profit
			 */

			$scope.debug = false;

			$scope.addNewInteraction = function addNewInteraction(type, content) {
				if (type === 'comments' || type === 'backs') {
					$scope.idea[type].push({
						text: content,
						from: loginSvc.getProperty('name'),
						time: moment().calendar()
					});
					document.getElementById('comment-box').value = '';
					document.getElementById('back-box').value = '';
					content = null;
				}
			};
			$scope.isUserLoggedIn = loginSvc.isUserLoggedIn;

			ideaSvc.getIdeaHeaders(function(data) {
				$scope.headers = data;
			},
			function(data, status, headers, config) {
				console.log(status);
			});

			$scope.idea = {
				title: 'The bestest Idea ever!',
				description: 'Apophenia order-flow systema futurity garage sentient car advert. Footage 3D-printed Legba free-market lights courier camera Kowloon youtube fluidity euro-pop garage bicycle augmented reality. Dome military-grade faded meta--space vehicle warehouse. Computer concrete corrupted vehicle tower dead knife cyber-camera augmented reality table shrine apophenia tiger-team-ware soul-delay. Hacker pistol into plastic realism sub-orbital futurity girl geodesic disposable boat sentient tanto urban. Plastic alcohol bicycle carbon courier spook gang wristwatch katana sensory sign long-chain hydrocarbons assault nano. ',
				author: 'Yash Kulshrestha',
				image: '../assets/defaultideahero.jpg',
				likes: 23,
				managerLikes: 6,
				comments: [
					{
						text: 'This sounds cool',
						from: 'Nobody',
						time: moment().subtract(1, 'days').calendar()
					},
					{
						text: 'Hey, I was thinking the same thing!',
						from: 'Another Nobody',
						time: moment().subtract(4, 'hours').calendar()
					}
				],
				backs: [
					{
						text: 'management experience',
						from: 'Some Manager',
						time: moment().subtract(7, 'days').calendar()
					},
					{
						text: 'TEN MILLION DOLLARS',
						from: 'Just Kidding',
						time: moment().subtract(84, 'hours').calendar()
					}
				]
			};
		}
	]
);