/* global angular */

angular.module('flintAndSteel')
.factory('ideaSvcMock', 
	[
		function() {
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
					throw new NotImplementedException('getIdea');
				},
				getIdeaHeaders: function getIdeaHeaders(successCb, errorCb) {
					throw new NotImplementedException('getIdeaHeaders');
				},
				getUniqueId: function getUniqueId(successCb, errorCb) {
					throw new NotImplementedException('getUniqueId');
				},
				updateIdea: function updateIdea(ideaId, property, data, successCb, errorCb) {
					throw new NotImplementedException('updateIdea');
				},
				getBackTypeChips: function getBackTypeChips() {
					throw new NotImplementedException('getBackTypeChips');
				}
			};
		}
	]
);