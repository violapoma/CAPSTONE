## ROUTERS
### /auth
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

###/users
- **GET /:userId**<br />
Returns the user with id userId, if existing. 
- **GET /:userId/posts**<br />
Returns all posts made by user with id userId. 
- **GET /:userId/communities**<br />
Returns all communities of which user with id userId in member or moderator in the following format: {moderating, member}

###/users/:userId/notifications
- **POST /**<br />
Creates a new notification for userId.
- **GET /**<br />
Gets all userId's notifications.
- **PATCH /:notificationId**<br />
Modifies the "read" property from false to true for notification with id notificationId
