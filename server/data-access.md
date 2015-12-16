# Getting Data From The Server

## API endpoints

* `/ideas`
* `/ideas/{id}`
* `/ideas/search`
* `/users/login`
* `/users/{id}`
* `/events`
* `/events/{id}`
* `/comments`
* `/comments/{id}`

## CRUD Operations

| CRUD Operation | HTTP Verb |
|----------------|-----------|
| Create         | `POST`    |
| Read           | `GET`     |
| Update         | `PATCH`   |
| Delete         | `DELETE`  |

## Searching

The API endpoint `/ideas/search` can be used to search through the list of ideas for some data in particular. This API endpoint needs 2 query parameters to work, `forterm` and `inpath`. The `forterm` parameter is used to specify the value that you want the server to search for while the `inpath` parameter indicates where to search. 

Check out the end of the examples section to see implementations using Angular's `$http` service. 

## Using a PATCH to update

To update an existing object, run a PATCH request against the appropriate route with a set of patch commands in the format mentioned below. If nothing is passed as a command, the request will be ignored.

A patch command is a plain old JavaScript object containing either two or three members depending on the operation requested. The members are as follows:


| Member      | Type     | Description                                                                                                                                                                                                                                                                                    |
|-------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `operation` | `string` | `{"append"|"create"|"delete"|"modify"}` - This member specifies the operation to run. Append adds to an array, create will add the `path` and the `value` under the given id, delete with remove the provided `path` and modify will reassign the data at the `path` to the `value` passed in. |
| `path`      | `string` | Location to run the operation on represented as a string delimited by '/'.                                                                                                                                                                                                                     |
| `value`     | `string` | If the operation is `append`, `create`, or `modify`, this data will be stored, appended to the array or used to replace old data. If the operation is `delete`, this member will be ignored. Stringified JSON is allowed.                                                                      |

Check out the end of the examples section to see implementations using Angular's `$http` service. 

## Examples

| Operation                      | HTTP Call                |
|--------------------------------|--------------------------|
| To get idea headers            | `GET /ideas`             |
| To get one idea object         | `GET /ideas/{id}`        |
| To add a new idea to the list  | `POST /ideas`            |
| To delete an idea              | `DELETE /ideas/{id}`     |
| To update an idea              | `PATCH /ideas/{id}`      |
| To search for an idea          | `GET /ideas/search`      |
| To get a user object           | `GET /users/{id}`        |
| To login a user                | `POST /users/login`      |
| To register a new user         | `POST /users`            |
| To delete a user               | `DELETE /users/{id}`     |
| To update an existing user     | `PATCH /users/{id}`      |
| To get event headers           | `GET /events`            |
| To get an event object         | `GET /events/{id}`       |
| To add a new event             | `POST /events`           |
| To update an event             | `PATCH /events/{id}`     |
| To delete an event             | `DELETE /events/{id}`    |
| To post a new comment          | `POST /comments`         |
| To update a comment            | `PATCH /comments/{id}`   |
| To delete a comment            | `DELETE /comments/{id}`  |

In angular using the `$http` service,

```javascript
// get the idea headers
$http.get('/ideas').then(function(headers) {
    // do something with the headers
}).catch(function(error) {
    // something went wrong!
});

// add a new user 
$http.post('/users', userObj).then(function(response) {
    console.log('User creation successful!');
}).catch(function(error) {
    // something went wrong!
});

// to delete an event
$http.delete('/events/' + eventIdToDelete).then(function(response) {
    console.log('Event was successfully deleted!');
}).catch(function(error) {
    // something went wrong!
});

// to update an idea
var patchCommands = [
    { "operation": "append", "path": "/comments/", "value": JSON.stringify(newCommentObj) },
    { "operation": "modify", "path": "/likes", "value", "50" },
    { "operation": "delete", "path": "/team/userId" },
    { "operation": "create", "path": "/eventId", "value": "newEventId" }
];
$http.patch('/ideas/' + ideaId, patchCommands).then(function(response) {
    console.log('Idea updated!');
}).catch(function(error) {
    // something went wrong!
});

// search for all ideas by a particular author
$http.get('/ideas/search?forterm=' + anAuthorId + '&inpath=authorId')
.then(function(docs) {
    console.log(docs);
}).catch(function(error) {
    // something went wrong!
});

// search all ideas backed by a certain user
$http.get('/ideas/search?forterm=' + anAuthorId + '&inpath=backs.authorId')
.then(function(docs) {
    console.log(docs);
}).catch(function(error) {
    // something went wrong!
});

// search for all ideas in an event
$http.get('/ideas/search?forterm=' + anEventId + '&inpath=eventId')
.then(function(docs) {
    console.log(docs);
}).catch(function(error) {
    // something went wrong!
});

```