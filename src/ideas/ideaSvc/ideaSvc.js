/* global angular */

angular.module('flintAndSteel')
.factory('ideaSvc', 
	[
		'$http',
		function($http) {

			var mockIdea = {
				id: 'mock_idea',
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
					},
					{
						text: 'This is gold, gold I tell you!',
						from: 'The Man',
						time: moment().subtract(30, 'minutes').calendar()
					}
				],
				backs: [
					{
						text: 'management experience',
						from: 'Some Manager',
						time: moment().subtract(7, 'days').calendar(),
						types: [
							{ name: 'Experience' },
							{ name: 'Knowledge' }
						]
					},
					{
						text: 'TEN MILLION DOLLARS',
						from: 'Just Kidding',
						time: moment().subtract(84, 'hours').calendar(),
						types: [
							{ name: 'Funding' }
						]
					}
				]
			};
			this.postIdea = function postIdea(idea, successCb, errorCb){
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
				
			};
			this.getIdea = function getIdea(ideaId, successCb, errorCb) {
				if (ideaId === 'mock_idea') {
					successCb(mockIdea);
				}
				else {
					$http.get('/idea?id=' + ideaId)
						.success(successCb)
						.error(errorCb);
				}
			};
			this.getIdeaHeaders = function getIdeaHeaders(successCb, errorCb) {
				$http.get('/ideaheaders')
					.success(successCb)
					.error(errorCb);
			};
			this.getUniqueId = function getUniqueId(successCb, errorCb) {
				$http.get('/uniqueId?for=idea')
					.success(successCb)
					.error(errorCb);
			};
			this.updateIdea = function updateIdea(ideaId, property, data, successCb, errorCb) {
				if (ideaId !== 'mock_idea') {
					$http.post('/updateidea', 
							{
								id: ideaId,
								property: property,
								value: data
							}
						)
						.success(successCb)
						.error(errorCb);
				}
			};
			this.getBackTypeChips = function getBackTypeChips() {
				var types = [
					{ name: 'Experience' },
					{ name: 'Funding' },
					{ name: 'Time' },
					{ name: 'Knowledge' },
					{ name: 'Social Network'},
					{ name: 'Materials' }
				];
				return types.map(function (type) {
					type._lowername = type.name.toLowerCase();
					return type;
				});
			};

			return {
				postIdea: this.postIdea,
				getIdea: this.getIdea,
				getIdeaHeaders: this.getIdeaHeaders,
				getUniqueId: this.getUniqueId,
				updateIdea: this.updateIdea,
				getBackTypeChips: this.getBackTypeChips
			};
		}
	]
);