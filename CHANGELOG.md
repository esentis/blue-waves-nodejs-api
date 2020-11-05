# 0.0.2

New endpoints:

* /ratings
  * /add POST request body:

  ```json
    "beachId": String,
    "userId" : String,
    "rating": Number
    ```

  * /search GET response body:

  ```json
    "results":[
        {
           "beachId": String,
           "userId" : String,
           "rating": Number
        },
        {
           "beachId": String,
           "userId" : String,
           "rating": Number
        },
    ]
  ```

* /users
  * /add POST request body:

  ```json
    "username": String,
    "id": String,
    "joinDate": String,
    ```

  * /delete POST request body:

  ```json
    "userId": String,
  ```

## 0.0.1

* Project init.
