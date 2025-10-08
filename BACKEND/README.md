## ROUTERS
### /auth
- **POST /register**<br />
Creates a new user via database. It also logges in the new user. 
- **POST /login**<br />
Logges in a user via database. 

### /me
- **GET /**<br/>
Returns the logged user. Their informations are stored in the _request_ object via Middleware authMw
- **GET /posts**<br />
Returns all the posts published by logged user, regardless of their community.
- **GET /communities**<br />
Returns all the communities of which logged user is member or moderator in the following format: {moderating, member}
- **PUT /**<br />
Updates most of logged user's infos. 
- **PATCH /profilePic**<br />
Updates logged user's profile picture via cloudonary. 
- **PATCH /password**<br />
Updates logged user's password. 
- **DELETE /**<br />
Deletes logged user from database

### /users
- _controls_ 
  - _validate userId_: checks if the id is mobgolse format via joi. <br />
  - _checkExistingUser_: Middleware that checks if the user exists in database. <br />
- **Endpoints**
 - **GET /:userId**<br />
Returns the user with id userId, if existing. 
 - **GET /:userId/posts**<br />
Returns all posts made by user with id userId. 
 - **GET /:userId/communities**<br />
Returns all communities of which user with id userId in member or moderator in the following format: {moderating, member}

### /users/:userId/notifications
- _controls_
 - _validate userId_
- **POST /**<br />
Creates a new notification for userId.
- **GET /**<br />
Gets all userId's notifications.
- **PATCH /:notificationId**<br />
Modifies the "read" property from false to true for notification with id notificationId

### /follows
- **POST /:userId/following/:followingId**<br />
Creates a new follow connection between userId and followingId, more specifically userId Is following followingId. 
- **GET /:userId/followers**<br />
Gets all the followers of userId. 
- **GET /:userId/following**<br />
Gets all the other users that userId is following. 
- **DELETE /:userId/following/:followingId**<br />
Deletes the following connection between userId and followingId, more specifically userId is stopping following followingId. 

### /communities
- **POST /**<br />
Creates a new community. Default status: pending (only the andmin can change the status to approved or rehected); default Active: false (once the member quota is reached, the boolean valute Is toggled). 
- **GET /approved**<br />
Gets all the approved communities. 
- **GET /pending**<br />
Gets all the pending communities. 
- **GET /:community id**<br />
Gets the community with id communityId. 
- **DELETE /:communityId**<br />
Deletes the community with id communityId. 

### /posts
- **POST /**<br />
Creates a new post in the specified/current community. 
- **GET /:postId**<br />
Gets post with id postId. 
- **PATCH /:postId**<br />
Updates the property "content" of post with id postId. 
- **PATCH /:postId/cover**<br />
Updates cover of post with id postId. 
- **DELETE /:postId**<br />
Deletes post with id postId. 

### /post/:postId/comments
- **POST /**<br />
Creates a new commenti for post with id postId. 
- **POST /:commentId**<br />
Creates a new reply to the commenti with id commentId. It's possibile just one reply per comment. 
- **GET /**<br />
Gets all the comments for post with id postId. 
- **GET /:commentId**<br />
Gets the commenti with id commentId. 
- **PATCH /:commentId**<br />
Updates the property "content" for commenti with id commentId. 
- **DELETE /:commentId**<br />
Deletes the commenti with id commentId