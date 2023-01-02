# Blogging App
This is an api for a blog app built with | Nodejs + Express + Mongodb

> C.R.U.D, Paginate, Filter, Sort and Search API
---
## Table of contents

- [Blogging App](#blogging-app)
  - [Table of contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Setup](#setup)
  - [Base URL](#base-url)
  - [Models](#models)
    - [User](#user)
    - [Blog](#blog)
  - [APIs](#apis)
    - [Signup User](#signup-user)
    - [Login User](#login-user)
    - [Add New Article](#add-new-article)
    - [List of Own Articles](#list-of-own-articles)
      - [example ( Filter by state )](#example--filter-by-state-)
    - [Update an Article By Id](#update-an-article-by-id)
    - [Get Own Article By Id](#get-own-article-by-id)
    - [Get All Published Articles](#get-all-published-articles)
      - [example ( Pagination, Search and Orderable)](#example--pagination-search-and-orderable)
    - [Get a Published Article By Id](#get-a-published-article-by-id)
    - [Delete Own Article By Id](#delete-own-article-by-id)
  - [Contributor](#contributor)
  
---
## Requirements
1. Users should have a first_name, last_name, email, password, (you can add other
attributes you want to store about the user)
2. A user should be able to sign up and sign in into the blog app
3. Use JWT as authentication strategy and expire the token after 1 hour
4. A blog can be in two states; draft and published
5. Logged in and not logged in users should be able to get a list of published blogs
created
6. Logged in and not logged in users should be able to to get a published blog
7. Logged in users should be able to create a blog.
8. When a blog is created, it is in draft state
9. The owner of the blog should be able to update the state of the blog to published
10. The owner of a blog should be able to edit the blog in draft or published state
11. The owner of the blog should be able to delete the blog in draft or published
state.
12. The owner of the blog should be able to get a list of their blogs.
    a. The endpoint should be paginated
    b. It should be filterable by state
13. Blogs created should have title, description, tags, author, timestamp, state,
read_count, reading_time and body.
14. The list of blogs endpoint that can be accessed by both logged in and not logged
in users should be paginated,
    a. default it to 20 blogs per page.
    b. It should also be searchable by author, title and tags.
    c. It should also be orderable by read_count, reading_time and timestamp
15. When a single blog is requested, the api should return the user information with
the blog. The read_count of the blog too should be updated by 1
16. Come up with any algorithm for calculating the reading_time of the blog.
17. The owner of the blog should be logged in to perform actions.
18. Use the MVC pattern
19. Test application
---
## Setup
- pull this repo
- run `npm i` to install all the dependencies
- update env with your DB URL, Passport SECRET, and PORT
- run `npm run dev`

---
## Base URL
https://fine-pinafore-bull.cyclic.app/app/
- https://github.com/CodeMarshal007/Blogging-API


## Models
---

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  first_name |  string |  required |
|  last_name | string  |  required|
|  email  |  string |  required, unique  |
|  password     | string  |  required |
|  phone_number |   number |  optional  |
|  posts |   array |  auto-filled with user's articles  |
|  timestamps |  date |  auto-fill in when a user signed up |


### Blog
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  title |  string |  required, unique |
|  description | string  |  optional |
|  author  |  string |  optional  |
|  state     | array  |  required, enum: ["draft", "published"], default: "draft" |
|  read_count |   number |   default: 0  |
| reading_time |  string |  auto-calculated |
|  tags |  array |  optional |
|  body |  string |  required |
|  postedBy | string |  auto-filled with user's Id  |
|  timestamps |  date |  auto-fill in when a user create an article |



## APIs
---

### Signup User

- Route: /app/auth/signup
- Method: POST
- Body: 
```
{
  "first_name": "john",
  "last_name": "doe",
  "email": "johndoe@gmail.com",
  "password": "password1",
  "phone_number": "08012345678",
}
```

- Responses

Success
```
{   status: "true"
    message: 'Signup successful',
    user: {
        "_id": "someRandom16DigitUserId",
  "email": "johndoe@gmail.com",
    "first_name": "john",
  "last_name": "doe",

    }
}
```
---
### Login User

- Route: app/auth/login
- Method: POST
- Body: 
```
{
  "email": "johndoe@gmail.com",
   "password": "password1",
}
```

- Responses

Success
```
{
     "status": "true",
    "message": 'Issued token successfully',
    "token": 'tokensjlkafjkldsfjsd'
}
```

---
### Add New Article

- Route: app/article
- Method: POST
- Header
    - Authorization: Bearer tokensjlkafjkldsfjsd
- Body: 
```
{
   "title": "Some Cool Title",
   "description": "This is an article about something funful",
   "author": "John Doe",
   "tags": "Fun Cool",
   "body": "some random cool lorem ipsum. Be gentle on yourself and have some fun"
}
```

- Responses

Success
```
{
 "status": "true",
      "message": "successfully created an article",
      "article":{
      
          "title": "Some Cool Title",
   "description": "This is an article about something funful",
   "author": "John Doe",
   "state": "draft",
   "read_count": 0,
   "tags": ["Fun", "Cool"],
   "body": "some random cool lorem ipsum. Be gentle on yourself and have some fun",
   "postedBy": "someRandom16DigitUserId",
     "id": "someRandom16DigitBlogId"
   "createdAt": 2022-10-28T23:05:48.046+00:00,
    "updatedAt": 2022-10-28T23:05:48.046+00:00,
    "reading_time": "1 minute(s) read"
      }
}
```
---
### List of Own Articles
- Route: app/article/myarticles
- Method: GET
- Header
    - Authorization: Bearer tokensjlkafjkldsfjsd

- Responses

Success
```
{
 "status": "true",
      "message": "successfully loaded all your article(s)",
      "filteredArticles":{
        "_id": "someRandom16DigitBlogId",
          "title": "Some Cool Title",
   "description": "This is an article about something funful",
     "author": "John Doe",
   "state": "draft",
   "read_count": 0,
   "tags": ["Fun", "Cool"],
    "body": "some random cool lorem ipsum. Be gentle on yourself and have some fun",
   "createdAt": 2022-10-28T23:05:48.046+00:00,
   "updatedAt": 2022-10-28T23:05:48.046+00:00,
       "reading_time": "1 minute(s) read"
      }
}
```
#### example ( Filter by state )
```http
  GET https://fine-pinafore-bull.cyclic.app/app/?state=published
  GET https://fine-pinafore-bull.cyclic.app/app/?state=draft

  GET http://localhost:3000/app/article/myarticles?state=published
  GET http://localhost:3000/app/article/myarticles?state=draft


```
---
### Update an Article By Id
- Route: app/article/someRandom16DigitBlogId
- Method: PATCH
- Header
    - Authorization: Bearer tokensjlkafjkldsfjsd
-Body: {
  "state": "published"
}
- Responses

Success
```
{
 "status": "true",
      "message": "successfully updated an article",
      "updatedArticle":{
         "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
   }
      }
}
```
---
### Get Own Article By Id
- Route: app/article/someRandom16DigitBlogId
- Method: GET
- Header
    - Authorization: Bearer tokensjlkafjkldsfjsd

- Responses

Success
```
{
 "status": "true",
      "message": "successfully sent an article",
      "article":{
        "id": "someRandom16DigitBlogId",
          "title": "Some Cool Title",
   "description": "This is an article about something funful",
   "author": "John Doe",
   "state": "published",
   "read_count": 1,
   "tags": ["Fun", "Cool"],
   "body": "some random cool lorem ipsum. Be gentle on yourself and have some fun",
   "postedBy": {
    "_id" : "someRandom16DigitUserId"
     "first_name": "john",
     "last_name": "doe",
     "email": "johndoe@gmail.com",
      },
   "createdAt": 2022-10-28T23:05:48.046+00:00,
    "updatedAt": 2022-10-28T23:05:48.046+00:00,
    "reading_time": "1 minute(s) read"
      }
}
```
---
### Get All Published Articles
- Route: /app
- Method: GET


- Responses

Success
```
{
 "status": "true",
      "message": "successfully loaded all published articles",
      "articles":{
        "_id": "someRandom16DigitBlogId",
          "title": "Some Cool Title",
   "description": "This is an article about something funful",
     "author": "John Doe",
   "state": "published",
   "read_count": 1,
   "tags": ["Fun", "Cool"],
    "body": "some random cool lorem ipsum. Be gentle on yourself and have some fun",
     "postedBy": "someRandom16DigitUserId",
   "createdAt": 2022-10-28T23:05:48.046+00:00,
   "updatedAt": 2022-10-28T23:05:48.046+00:00,
       "reading_time": "1 minute(s) read"
      }
}
```
#### example ( Pagination, Search and Orderable)
```http
-Pagination: defaulted to 20 blogs per page if "perPage" is not specified
  GET http://localhost:3000/app?page=1&perPage=2 
  GET https://fine-pinafore-bull.cyclic.app/app?page=1&perPage=2

-search: can be search by author, title and tags (by author is used in the example below)
  GET http://localhost:3000/app?search=ade
  GET https://fine-pinafore-bull.cyclic.app/app?search=ade

-Sort ||orderable: can be sort by read_count, reading_time and timestamp. If "OrderBy" is not provided, it is ordered in ascending order
  GET http://localhost:3000?sortBy=read_count&OrderBy=desc
  GET  https://fine-pinafore-bull.cyclic.app/app?sortBy=read_count&OrderBy=desc

-Full 
 GET http://localhost:3000?page=1&perPage=2&search=ade&sortBy=read_count&OrderBy=desc

GET  https://fine-pinafore-bull.cyclic.app/app?page=1&perPage=2&search=ade&sortBy=read_count&OrderBy=desc
```

### Get a Published Article By Id
- Route: app/someRandom16DigitBlogId
- Method: GET


- Responses

Success
```
{
 "status": "true",
      "message": "successfully loaded a published article by Id",
      "articles":{
        "_id": "someRandom16DigitBlogId",
          "title": "Some Cool Title",
   "description": "This is an article about something funful",
     "author": "John Doe",
   "state": "published",
   "read_count": 2,
   "tags": ["Fun", "Cool"],
    "body": "some random cool lorem ipsum. Be gentle on yourself and have some fun",
     "postedBy": "someRandom16DigitUserId",
   "createdAt": 2022-10-28T23:05:48.046+00:00,
   "updatedAt": 2022-10-28T23:05:48.046+00:00,
       "reading_time": "1 minute(s) read"
      }
}
```
---
### Delete Own Article By Id
- Route: app/article/someRandom16DigitBlogId
- Method: DELETE
- Header
    - Authorization: Bearer tokensjlkafjkldsfjsd

- Responses

Success
```
{
 "status": "true",
      "message": "successfully deleted an article",
      "article":{
        "id": "someRandom16DigitBlogId",
          "title": "Some Cool Title",
   "description": "This is an article about something funful",
   "author": "John Doe",
   "state": "published",
   "read_count": 1,
   "tags": ["Fun", "Cool"],
   "body": "some random cool lorem ipsum. Be gentle on yourself and have some fun",
 "postedBy": "someRandom16DigitUserId",
   "createdAt": 2022-10-28T23:05:48.046+00:00,
    "updatedAt": 2022-10-28T23:05:48.046+00:00,
    "reading_time": "1 minute(s) read"
      }
}
```
---

...

## Contributor
- Abdulmajeed Adeniyi Yusuf