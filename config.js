// This script adds the Innovation Challenge 2015 Ideas to the datastore.

var fs          = require('fs');

var filePattern = "server/datastore/ideas/idea_X.json"
var fileName    = filePattern.replace("X", "0")

var ideas = [{
  "key":0,
  "_id":"idea_0",
  "ideaId":0,
  "title":"ROKStarter",
  "description":"A \"Platform as a Service\" blah blah blah",
  "author":"The Cleveland Innovation Challenge Team",
  "likes":0,
  "comments":[],
  "backs":[]
}];

fs.stat(fileName, function(err, stat) {
  var id = 0;

  if (err == null) {
    // File exists
    console.error("ERROR: Please delete the ideas in 'server/datastore/ideas' to continue");
  } else if (err.code == 'ENOENT') {
    // File does not exist, generate ideas
    ideas.forEach(function(idea, index, arr) {
      fs.writeFile(filePattern.replace("X", index), JSON.stringify(idea), function(err) {
        if (err) throw err;
      });
    });

  } else {
    // Something went very wrong.
    console.error("ERROR: ", err.code);
    throw err;
  }
});
