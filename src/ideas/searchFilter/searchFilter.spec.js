/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */

describe('SearchFilter', function() {
    "use strict";

    var $filter, search;

    var testList = [
        {
            id: 0,
            title: "Idea One",
            author: {
                name: "Test User 1"
            },
            event: {
                name: "Test Event 1"
            },
            abstract: "This is an abstract",
            likes: 8,
            tags: ["TestTag1", "TestTag14"]
        },
        {
            id: 1,
            title: "Idea Dos",
            author: {
                name: "Karl"
            },
            event: {
                name: "Test Event 2"
            },
            abstract: "OMG abstract",
            likes: 200,
            tags: ["TestTag1"]
        },
        {
            id: 3,
            title: "cAsE iNsEnSiTiVe",
            author: {
                name: "Aaron Rodgers"
            },
            event: {
                name: "Super Bowl 50"
            },
            abstract: "Relax",
            likes: 13,
            tags: ["TestTag2", "TestTag4"]
        },
        {
            id: 4,
            title: "Broken-Spacebar<Uses:Punctuation?Instead",
            author: {
                name: "Please*Fix&My%Keyboard$#@!()\'\"{}[]|\\/`~"
            },
            // no event on purpose
            abstract: "K()000*l",
            likes: 1,
            tags: ["TestTag3"]
        }
    ];

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function(_$filter_) {
        $filter = _$filter_;

        search = $filter('search');
    }));

    it('should return all results if the query is empty', function() {
        var query;
        expect(search(testList, query).length).toEqual(4);

        query = "";
        expect(search(testList, query).length).toEqual(4);
    });

    it('should return partials matches of titles by input string', function() {
        var query = "Idea";
        expect(search(testList, query).length).toEqual(2);
    });

    it('should return matches in real time', function() {
        var query = "Id";
        expect(search(testList, query).length).toEqual(2);

        query += "ea";
        expect(search(testList, query).length).toEqual(2);

        query += " One";
        expect(search(testList, query).length).toEqual(1);
    });

    it('should ignore punctuation', function() {
        var query = "BrokenSpacebarUsesPunctuationInstead";
        expect(search(testList, query).length).toEqual(1);

        query = "PleaseFixMyKeyboard";
        expect(search(testList, query).length).toEqual(1);
    });

    it('should be case-insensitive', function() {
        var query = "CaSe InSeNsItIvE";
        expect(search(testList, query).length).toEqual(1);
    });

    it('should search the abstracts', function() {
        var query = "abstract";
        expect(search(testList, query).length).toEqual(2);

        query = "Relax";
        expect(search(testList, query).length).toEqual(1);

        query = "K000l";
        expect(search(testList, query).length).toEqual(1);
    });

    it('should search the item tags', function() {
        var query = "TestTag1";
        expect(search(testList, query).length).toEqual(2);

        query = "TestTag14";
        expect(search(testList, query).length).toEqual(1);

        query = "TestTag2";
        expect(search(testList, query).length).toEqual(1);

        query = "TestTag3";
        expect(search(testList, query).length).toEqual(1);

        query = "TestTag4";
        expect(search(testList, query).length).toEqual(1);
    });

    it('should search the event tag if it exists', function() {
        var query = "Test Event 1";
        expect(search(testList, query).length).toEqual(1);

        query = "Test Event";
        expect(search(testList, query).length).toEqual(2);

        query = "Test Event 2";
        expect(search(testList, query).length).toEqual(1);

        query = "Super Bowl 50";
        expect(search(testList, query).length).toEqual(1);
    });

    it('should only have an idea in the results once', function() {
        var query = "TestTag";
        expect(search(testList, query).length).toEqual(4);
    });
});
