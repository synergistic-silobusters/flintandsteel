describe('SidenavCtrl', function() {
	var $rootScope, scope, ctrl, $mdSidenav, $state, ideaSvcMock;

	beforeEach(module('flintAndSteel'));
	beforeEach(module('ui.router'));

	beforeEach(inject(function (_$rootScope_, $controller, _$state_, _$mdSidenav_, _ideaSvcMock_) {
		$rootScope = _$rootScope_;
		scope = $rootScope.$new();
		$state = _$state_;
		$mdSidenav = _$mdSidenav_;
		ideaSvcMock = _ideaSvcMock_;

		spyOn($state, 'go');
		/*
		// TODO - figure out how to test the $mdSidenav calls
		spyOn($mdSidenav, 'isLockedOpen');
		spyOn($mdSidenav, 'close');*/

		ctrl = $controller('SidenavCtrl', {
			$scope: scope,
			$state: $state,
			$mdSidenav: $mdSidenav,
			ideaSvc: ideaSvcMock
		});
	}));

	it('should exist', function() {
		expect(ctrl).toBeDefined();
	});

	describe('$scope.navTo()', function() {
		var state;

		beforeEach(function() {
			state = undefined;
		});

		it('should navigate to the passed in state', function() {
			state = 'home';
			scope.navTo(state);

			expect($state.go).toHaveBeenCalledWith(state);
			// TODO - figure out how to test the $mdSidenav calls.
		});

		it('should navigate to the mock_idea ideaView', function() {
			state = 'idea';
			scope.navTo(state);

			expect($state.go).toHaveBeenCalledWith(state, {ideaId: 'mock_idea'});
			// TODO - figure out how to test the $mdSidenav calls.
		});
	});
	
	describe('$scope.$on(newIdeaAdded)', function() {

		beforeEach(function() {
			spyOn(ideaSvcMock, 'getIdeaHeaders');
		});

		it('should catch the newIdeaAdded event', function() {
			$rootScope.$emit('newIdeaAdded');

			expect(ideaSvcMock.getIdeaHeaders).toHaveBeenCalled();
		});
	});

});