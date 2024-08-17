# Travelogue

Travelogue is a social media platform for sharing travel experiences through posts with captions, images, and comments.

## Tech Stack

Frontend: React.js, Redux, Material UI, Tailwind CSS.  
Backend: Express.js, Node.js, JsonWebToken, Cloudinary.  
Databases: MongoDB, Mongoose

## Features

- Authorization and Authentication using JWT
- Google Login
- Image Uploading
- Like, Comment and Tag
- Search using Keywords or Tags
- Related Posts recommendation
- Pagination

## API

- **Posts**

  - **/api/posts**

    - **GET**: Get all posts from database
    - **POST**: Create a post in database

  - **/api/posts/:id**

    - **GET**: Get a post with ID 'id'
    - **PATCH**: Update a post with ID 'id'
    - **DELETE**: Delete a post with ID 'id'

  - **/api/posts/:id/likePost**

    - **POST**: Like post with ID 'id'

  - **/api/posts/search**

    - **GET**: Get posts matching keywords and tags using URL query parameters 'q' and 'tags'. 'q' is a string of words and tags is string of tags seperated by ',' comas.

  - **/api/posts/images**
    - **POST**: Upload images by sending the image file in multipart/formdata.

- **User**

  - **/api/signUp**

    - **POST**: Create a user in database. Returns an User object and an access token in response and a JWT refresh token in cookie that expires in 7 Days.
      - If the user account already exist with an email it returns an error code 'USER_ALREADY_EXISTS'

  - **/api/signIn**

    - **POST**: Logins a user. Returns a User object and an access token in response and a JWT refresh token in cookie that expires in 7 Days.
      - If the given email or password is incorrect it returns an error code 'INCORRECT_EMAIL_OR_PASSWORD'
      - If no user account exists with the given email it returns an error code 'USER_NOT_FOUND'

  - **/api/logout**

    - **GET**: Logs out a user by destroying the cookie.

  - **/api/refresh**
    - **GET**: Returns a refresh token. A refresh token is used to refresh an access token and to maintain user login session.
    - If no refresh token cookie is found it returns an error code 'TOKEN_NOT_FOUND'.

## Post Schema

```javascript
{
    title: { type: String, required: true },
    message: { type: String, required: true },
    images: [
        {
            originalname: { type: String, required: true },
            mimetype: { type: String, required: true },
            // URL of image
            path: { type: String, required: true },
            size: { type: Number, required: true },
            filename: { type: String, required: true },
        },
    ],
    // User ID of owner of the post
    owner: { type: String, required: true },
    comments: [
        {
            text: { type: String, required: true },
            // User ID of owner of the comment
            owner: { type: String, required: true },
        },
    ],
    tags: [String],
    likes: [{ type: String, required: true }],
    createdAt: { type: Date, default: new Date() },
}
```

## User Schema

```javascript
{
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    posts: [ { type: String } ],
    // External Auth Service ID eg. 'GOOGLE' for google
    externalId: { type: String, default: null },
    externalType: { type: String, default: null },
}
```

## Screenshots

#### Home (/)

![Home](/images/Home.png)

#### Post (/posts/:id)

![Post](/images/Post.png)

#### Create and Edit (/posts/create | /posts/:id/edit)

![Creat and Edit](/images/Create_and_Edit.png)

#### Sign Up and Sign In

![SignUp](/images/SignUp.png)![SignIn](/images/SignIn.png)
