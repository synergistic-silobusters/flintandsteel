/* global angular */

angular.module('flintAndSteel')
.factory('ideaSvcMock', 
	[
		function() {
			var mockIdea = {
				id: 'mock_idea',
				title: 'The bestest Idea ever!',
				description: 'Apophenia order-flow systema futurity garage sentient car advert. Footage 3D-printed Legba free-market lights courier camera Kowloon youtube fluidity euro-pop garage bicycle augmented reality. Dome military-grade faded meta--space vehicle warehouse. Computer concrete corrupted vehicle tower dead knife cyber-camera augmented reality table shrine apophenia tiger-team-ware soul-delay. Hacker pistol into plastic realism sub-orbital futurity girl geodesic disposable boat sentient tanto urban. Plastic alcohol bicycle carbon courier spook gang wristwatch katana sensory sign long-chain hydrocarbons assault nano. ',
				author: 'Yash Kulshrestha',
				image: '../assets/defaultideahero.jpg',
				likes: [
					'cottageclaw',
					'vbfond',
					'curvechange',
					'bothdesigned',
					'gymnastfinance',
					'aberrantcollagen',
					'kuwaitiinspiring',
					'basteglyderau',
					'adoptionpanting',
					'tokenslagoon',
					'welshwood',
					'kumquatslant',
					'anaerobedigits',
					'chouxthames',
					'pizzago'
				],
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

			function NotImplementedException(call) {
				this.name = 'NotImplementedException';
				this.message = 'Method ' + call + ' has not been implemented!';
				this.toString = function() {
					return this.name + ': ' + this.message;
				};
			}

			return {
				postIdea: function postIdea(idea, successCb, errorCb) {
					successCb('Created');
				},
				getIdea: function getIdea(ideaId, successCb, errorCb) {
					successCb(mockIdea);
				},
				getIdeaHeaders: function getIdeaHeaders(successCb, errorCb) {
					return [
						{
							id: 'mock_idea',
							title: 'The bestest Idea ever!',
							author: 'Yash Kulshrestha',
							likes: 23
						}
					];
				},
				getUniqueId: function getUniqueId(successCb, errorCb) {
					throw new NotImplementedException('getUniqueId');
				},
				updateIdea: function updateIdea(ideaId, property, data, successCb, errorCb) {
					mockIdea[property] = data;
					successCb('OK');
				},
				getBackTypeChips: function getBackTypeChips() {
					var types = [
						{ name: 'Experience' },
						{ name: 'Funding' },
						{ name: 'Time' },
						{ name: 'Knowledge' },
						{ name: 'Social Network'},
						{ name: 'Materials' },
						{ name: 'Test Chip'}
					];
					return types.map(function (type) {
						type._lowername = type.name.toLowerCase();
						return type;
					});
				}
			};
		}
	]
);