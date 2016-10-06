/* global angular */
/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */

describe('ideaCard', function() {
    "use strict";

    var scope, $compile, element;

    function getCompiledElement(scope) {
        return $compile(angular.element('<idea-card idea="idea"></idea-card>'))(scope);
    }

    beforeEach(function() {
        module('flintAndSteel');
        module('ideas/ideaCard/ideaCard.tpl.html');

        inject(function($rootScope, _$compile_) {
            scope = $rootScope.$new();
            $compile = _$compile_;
        });
    });

    it('should exist', function() {
        element = getCompiledElement(scope);
        expect(element).toBeDefined();
    });
});
