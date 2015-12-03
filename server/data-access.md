# Getting Data From The Server

## API endpoints

* `/ideas`
* `/ideas/{id}`
* `/ideas/search`
* `/users/login`
* `/users/{id}`
* `/events`
* `/events/{id}`

## CRUD Operations

| CRUD Operation | HTTP Verb |
|----------------|-----------|
| Create         | `POST`    |
| Read           | `GET`     |
| Update         | `PATCH`   |
| Delete         | `DELETE`  |

## Searching

## Using a PATCH to update

## Examples

| Operation                      | HTTP Call             |
|--------------------------------|-----------------------|
| To get idea headers            | `GET /ideas`          |
| To get one idea object         | `GET /ideas/{id}`     |
| To add a new idea to the list  | `POST /ideas`         |
| To delete an idea              | `DELETE /ideas/{id}`  |
| To update an idea              | `PATCH /ideas/{id}`   |
| To search for an idea          | `GET /ideas/search`   |
| To get a user object           | `GET /users/{id}`     |
| To login a user                | `POST /users/login`   |
| To register a new user         | `POST /users`         |
| To delete a user               | `DELETE /users/{id}`  |
| To update an existing user     | `PATCH /users/{id}`   |
| To get event headers           | `GET /events`         |
| To get an event object         | `GET /events/{id}`    |
| To add a new event             | `POST /events`        |
| To update an event             | `PATCH /events/{id}`  |
| To delete an event             | `DELETE /events/{id}` |

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
    { "operation": "create", "path": "/comments/", "value": JSON.stringify(newCommentObj) },
    { "operation": "modify", "path": "/likes", "value", "50" },
    { "operation": "delete", "path": "/team/userId" }
];
$http.patch('/ideas/' + ideaId, patchCommands).then(function(response) {
    console.log('Idea updated!');
}).catch(function(error) {
    // something went wrong!
});

```