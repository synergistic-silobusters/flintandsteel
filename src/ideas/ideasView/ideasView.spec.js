describe('IdeasViewCtrl', function() {
	var scope, ctrl, $stateParams, ideaSvcMock, loginSvcMock;

	beforeEach(module('flintAndSteel'));

	beforeEach(inject(function ($rootScope, $controller, _$stateParams_, _ideaSvcMock_, _loginSvcMock_) {
		scope = $rootScope.$new();
		$stateParams = _$stateParams_;
		ideaSvcMock = _ideaSvcMock_;
		loginSvcMock = _loginSvcMock_;

		ctrl = $controller('IdeasViewCtrl', {
			$scope: scope,
			$stateParams: $stateParams,
			ideaSvc: ideaSvcMock,
			loginSvc: loginSvcMock
		});
	}));

	it('should exist', function() {
		expect(ctrl).toBeDefined();
	});

	describe('$scope.addNewInteraction()', function() {
		var content, commentsLength, backsLength;

		beforeEach(function() {
			content = '';
			commentsLength = scope.idea.comments.length;
			backsLength = scope.idea.backs.length;

			spyOn(document, 'getElementById').and.callFake(function() {
				return {
					value: content
				};
			});
		});

		it('should add a new comment when comment is selected', function() {
			content = 'This is a test comment!';

			scope.addNewInteraction('comments', content);

			expect(scope.idea.comments.length).toBe(commentsLength + 1);
			expect(scope.idea.comments[commentsLength].text).toBe('This is a test comment!');
		});

		it('should add a new back with no tags', function() {
			content = 'This is a test back!';

			scope.addNewInteraction('backs', content);

			expect(scope.idea.backs.length).toBe(backsLength + 1);
			expect(scope.idea.backs[backsLength].text).toBe('This is a test back!');
			expect(scope.idea.backs[backsLength].types.length).toBe(0);
		});

		it('should add a new back with two tags', function() {
			content = 'This is a test back!';
			scope.selectedTypes = [{ name: 'Experience' }, { name: 'Funding' }];

			scope.addNewInteraction('backs', content);

			expect(scope.idea.backs.length).toBe(backsLength + 1);
			expect(scope.idea.backs[backsLength].text).toBe('This is a test back!');
			expect(scope.idea.backs[backsLength].types.length).toBe(2);
			expect(scope.idea.backs[backsLength].types[0].name).toBe('Experience');
			expect(scope.idea.backs[backsLength].types[1].name).toBe('Funding');
		});
	});

	describe('$scope.likeIdea()', function() {
		var ideaLikes;

		beforeEach(function() {
			ideaLikes = scope.idea.likes;

			spyOn(loginSvcMock, 'likeIdea').and.callFake(function() {
			});
		});

		it('should like an idea', function() {
			scope.likeIdea();

			expect(scope.idea.likes).toBe(ideaLikes + 1);
			expect(loginSvcMock.likeIdea).toHaveBeenCalledWith(scope.idea.id);
		});
	});

	describe('$scope.unlikeIdea()', function() {
		var ideaLikes;

		beforeEach(function() {
			ideaLikes = scope.idea.likes;

			spyOn(loginSvcMock, 'unlikeIdea').and.callFake(function() {
			});
		});

		it('should like an idea', function() {
			scope.unlikeIdea();

			expect(scope.idea.likes).toBe(ideaLikes - 1);
			expect(loginSvcMock.unlikeIdea).toHaveBeenCalledWith(scope.idea.id);
		});
	});

	describe('$scope.isUserLiked()', function() {

		beforeEach(function() {
			scope.idea.id = 'mock_idea';
		});

		it('should return true for a liked idea', function() {
			expect(scope.isUserLiked()).toBeTruthy();
		});

		it('should return false for other ideas', function() {
			scope.idea.id = 'not_mock_idea';
			expect(scope.isUserLiked()).not.toBeTruthy();
		});
	});

	describe('$scope.querySearch()', function() {
		var results;

		beforeEach(function() {
			results = undefined;
			scope.typeChips = ideaSvcMock.getBackTypeChips();
		});

		it('should return an array of all the typeChips for an empty search', function() {
			results = scope.querySearch();
			expect(results).toBe(scope.typeChips);
		});

		it('should return an array with length 1 when searched for "K"', function() {
			results = scope.querySearch('K');
			expect(results.length).toBe(1);
			expect(results[0].name).toBe('Knowledge');
		});

		it('should return an array with length 2 when searched for "T"', function() {
			results = scope.querySearch('T');
			expect(results.length).toBe(2);
			expect(results[0].name).toBe('Time');
			expect(results[1].name).toBe('Test Chip');
		});

		it('should work with lowercase searches', function() {
			results = scope.querySearch('fund');
			expect(results.length).toBe(1);
			expect(results[0].name).toBe('Funding');
		});

		it('should return nothing for unacceptable back types', function() {
			results = scope.querySearch('technology');
			expect(results.length).toBe(0);
		});
	});

});