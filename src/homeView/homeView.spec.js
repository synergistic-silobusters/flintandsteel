describe('HomeViewCtrl', function() {
    var scope, ctrl;

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        ctrl = $controller('HomeViewCtrl', { $scope: scope });
    }));

    it('should exist', function() {
        expect(scope).toBeDefined();
    });
});