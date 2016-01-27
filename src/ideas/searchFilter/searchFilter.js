/* global angular */

angular.module('flintAndSteel')
.filter('search',
    [
        function() {
            "use strict";

            return function(items, searchTerm) {
                if (typeof searchTerm === "undefined" || searchTerm === '') {
                    return items;
                }
                var retArray = [];
                var re = /[ .,-\/#!$%\^&\*;:{}=\-_`~()<>\'\"@\[\]\|\\\?]/g;
                items.forEach(function(item) {
                    var normalizedSearch = searchTerm.replace(re,"").toLowerCase();
                    var normalizedTitle = item.title.replace(re,"").toLowerCase();
                    var normalizedAuthor = item.author.name.replace(re,"").toLowerCase();
                    var normalizedEvent = "";
                    if (angular.isDefined(item.event)) {
                        normalizedEvent = item.event.name.replace(re,"").toLowerCase();
                    }
                    var normalizedAbstract = item.abstract.replace(re,"").toLowerCase();
                    var normalizedTags = item.tags;
                    if (normalizedTitle.indexOf(normalizedSearch) >= 0) {
                        retArray.push(item);
                    }
                    else if (normalizedAuthor.indexOf(normalizedSearch) >= 0) {
                        retArray.push(item);
                    }
                    else if (normalizedEvent.indexOf(normalizedSearch) >= 0) {
                        retArray.push(item);
                    }
                    else if (normalizedAbstract.indexOf(normalizedSearch) >= 0) {
                        retArray.push(item);
                    }
                    else if (typeof normalizedTags !== 'undefined') {
                        for (var i = 0; i < normalizedTags.length; ++i) {
                            var tag = normalizedTags[i].replace(re,"").toLowerCase();
                            if (tag.indexOf(normalizedSearch) >= 0) {
                                retArray.push(item);
                                break;
                            }                            
                        }
                    }
                });
                return retArray;
            };
        }
    ]
);
