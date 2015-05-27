describe('ideaSvc', function() {
	var ideaSvc, $httpBackend, dummyIdea;

	beforeEach(module('flintAndSteel'));

	beforeEach(inject(function (_ideaSvc_, _$httpBackend_) {
		ideaSvc = _ideaSvc_;
		$httpBackend = _$httpBackend_;

		dummyIdea = {
			title: 'Test title',
			author: 'Guybrush Threepwood',
			description: 'Test description',
			likes: 45,
			comments: [
				{
					text: 'Yeah, mhm.',
					name: 'Dude',
					time: moment().subtract(4, 'days').calendar()
				}
			],
			backs: [
				{
					text: 'Some resources',
					name: 'Some Guy',
					time: moment().calendar(),
					types: [
						{ name: 'Experience' },
						{ name: 'Knowledge' }
					]
				}
			]
		};
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it('should exist', function() {
		expect(ideaSvc).toBeDefined();
	});

	describe('ideaSvc.postIdea', function() {
		var postIdeaHandler, uniqueIdHandler;

		beforeEach(function() {
			postIdeaHandler = $httpBackend.whenPOST('/idea')
								.respond('201', 'Created');
			uniqueIdHandler = $httpBackend.whenGET('/uniqueid?for=idea')
								.respond('200', 9001);
		});

		it('should add a newly submitted idea', function() {
			$httpBackend.expectGET('/uniqueid?for=idea');
			$httpBackend.expectPOST('/idea', dummyIdea);

			ideaSvc.postIdea(dummyIdea, function (data) {

			}, function (data, status, headers, config) {

			});

			$httpBackend.flush();
		});
	});

	describe('ideaSvc.getIdea', function() {
		var getIdeaHandler;

		beforeEach(function() {
			getIdeaHandler = $httpBackend.whenGET('/idea?id=9001')
								.respond('200', dummyIdea);
		});

		it('it should return an idea when provided an idea', function() {
			$httpBackend.expectGET('/idea?id=9001');

			ideaSvc.getIdea(9001, function (data) {

			}, function (data, status, headers, config) {

			});

			$httpBackend.flush();
		});

		it('should return the mock idea when asked', function() {
			var mockIdea;

			ideaSvc.getIdea('mock_idea', function (data) {
				mockIdea = data;
			}, function (data, status, headers, config) {

			});

			expect(mockIdea).toBeDefined();
			expect(mockIdea.id).toBe('mock_idea');
		});

	});

	describe('ideaSvc.getIdeaHeaders', function() {
		var getIdeaHeadersHandler, dummyHeaders;

		beforeEach(function() {
			dummyHeaders = [
				{
					id: 'mock_idea',
					name: 'The Bestest Idea Ever',
					author: 'Yash Kulshrestha',
					likes: 23
				}
			];
			getIdeaHeadersHandler = $httpBackend.whenGET('/ideaheaders')
										.respond('200', dummyHeaders);
		});

		it('should return idea headers', function() {
			$httpBackend.expectGET('/ideaheaders');

			ideaSvc.getIdeaHeaders(function (data) {

			}, function (data, status, headers, config) {

			});

			$httpBackend.flush();
		});
	});

	describe('ideaSvc.updateIdea', function() {
		var updateIdeaHandler, updatedIdea;

		beforeEach(function() {
			updatedIdea = {
				id: 'dummy_idea',
				property: 'likes',
				value: 24
			};
			updateIdeaHandler = $httpBackend.whenPOST('/updateidea', updatedIdea).respond('200', 'OK');
		});

		it('should update the idea with new passed in information', function() {
			$httpBackend.expectPOST('/updateidea', updatedIdea);

			ideaSvc.updateIdea('dummy_idea', 'likes', 24, function (data) {

			}, function (data, status, headers, config) {

			});

			$httpBackend.flush();
		});
	});

	describe('ideaSvc.getBackTypeChips', function() {
		var backTypes;

		it('should return the back types with lowercase property', function() {
			backTypes = ideaSvc.getBackTypeChips();

			expect(backTypes).toBeDefined();
			expect(backTypes[0].name).toBe('Experience');
			expect(backTypes[0]._lowername).toBe('experience');
		});
	});

});