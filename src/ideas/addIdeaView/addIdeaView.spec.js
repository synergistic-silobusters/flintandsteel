describe('AddIdeaViewCtrl', function() {
	var scope, ctrl, $mdToast, $state, ideaSvcMock, loginSvcMock;

	beforeEach(module('flintAndSteel'));
	beforeEach(module('ui.router'));

	beforeEach(inject(function($rootScope, $controller, _$mdToast_, _$state_, _ideaSvcMock_, _loginSvcMock_) {
		scope = $rootScope.$new();
		$mdToast = _$mdToast_;
		$state = _$state_;
		ideaSvcMock = _ideaSvcMock_;
		loginSvcMock = _loginSvcMock_;

		spyOn($state, 'go');
		spyOn(ideaSvcMock, 'postIdea');

		ctrl = $controller('AddIdeaViewCtrl', {
			$scope: scope,
			$state: $state,
			$mdToast: $mdToast,
			ideaSvc: ideaSvcMock,
			loginSvc: loginSvcMock
		});
	}));

	it('should exist', function() {
		expect(ctrl).toBeDefined();
	});

	it('should add a new idea', function() {
		var idea = {
			title: 'Test Title',
			description: 'This is a test idea.'
		};
		scope.addNewIdea(idea);

		expect(ideaSvcMock.postIdea).toHaveBeenCalled();
		expect(idea.likes.length).toBe(0);
		expect(idea.comments.length).toBe(0);
		expect(idea.backs.length).toBe(0);
	});

	it('should use the user\'s name as the author', function() {
		var idea = {
			title: 'Test Title',
			author: 'Test',
			description: 'This is a test idea.'
		};
		scope.addNewIdea(idea);

		expect(idea.author).not.toBe("Test");
		expect(idea.author).toBe("Darth Vader");
	});
});
