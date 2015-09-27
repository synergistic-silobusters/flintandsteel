angular.module('flintAndSteel')
.filter('search', 
    [
        function() {
            return function(items, searchTerm) {
                if (typeof searchTerm === "undefined" || searchTerm === '') {
                    return items;
                }
                var retArray = [];
                var re = /[.,-\/#!$%\^&\*;:{}=\-_`~()\<\>\'\"@\[\]\|\\\?]/g;
                items.map(function(item) {
                    var normalizedSearch = searchTerm.replace(re,"").toLowerCase();
                    var normalizedTitle = item.title.replace(re,"").toLowerCase();
                    var normalizedAuthor = item.author.replace(re,"").toLowerCase();
                    if (normalizedTitle.indexOf(normalizedSearch) >= 0) {
                        retArray.push(item);
                    }
                    else if (normalizedAuthor.indexOf(normalizedSearch) >= 0) {
                        retArray.push(item);
                    }
                });
                return retArray;
            }
        }
    ]
);
