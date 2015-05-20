/* global angular */

angular.module('flintAndSteel')
.factory('ideaSvc', 
	[
		'$http',
		'appSettings',
		function($http, appSettings) {

			var mockIdea = {
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

			return {
				postIdea: function postIdea(idea, successCb, errorCb){
					$http.get('/uniqueid?for=idea')
						.success(function getIdSucess(data) {
							idea.id = data;
							$http.post('/idea', idea)
								.success(successCb)
								.error(errorCb);
						})
						.error(function getIdFailed(data, status, headers, config) {
							console.log(status);
						});
					
				},
				getIdea: function getIdea(ideaId, successCb, errorCb) {
					if (ideaId === 'mock_idea') {
						successCb(mockIdea);
					}
					else {
						$http.get('/idea?id=' + ideaId)
							.success(successCb)
							.error(errorCb);
					}
				},
				getIdeaHeaders: function getIdeaHeaders(successCb, errorCb) {
					$http.get('/ideaheaders')
						.success(successCb)
						.error(errorCb);
				},
				getUniqueId: function getUniqueId(successCb, errorCb) {
					$http.get('/uniqueId?for=idea')
						.success(successCb)
						.error(errorCb);
				}
			};
		}
	]
);