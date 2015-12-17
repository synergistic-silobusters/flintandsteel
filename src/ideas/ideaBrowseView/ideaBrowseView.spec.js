/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */

describe('IdeaBrowseViewCtrl', function() {
    "use strict";

    var ctrl, scope, ideaSvcMock;

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function($rootScope, $controller, _ideaSvcMock_) {
        scope = $rootScope.$new();
        ideaSvcMock = _ideaSvcMock_;

        ctrl = $controller('IdeaBrowseViewCtrl', {
            $scope: scope,
            ideaSvc: ideaSvcMock
        });
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });
});
