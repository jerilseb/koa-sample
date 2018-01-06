## Installation

Start the server by running

    npm install && npm start

The server will be started on ```localhost:3000```.

Use the ```curl``` command or a rest client like Postman to call the APIs.


------

## API Specification

> ### POST /findwords
  Returns json data about the found word combinations

* **URL**

  /findwords

* **Method:**

  `POST`
  
*  **URL Params**

   None

* **Data Params**

  dict: <dictionary_file>

* **Sample Success Response:**

  * **Code:** 200 Success
   * **Content:** `{
    "message": {
        "account + ably": "accountably",
        "account + able": "accountable",
    },
    "count": 2
}`
 
* **Sample Error Response:**

  * **Code:** 400 Bad Request
  *  **Content:** `No dictionary file given`

----

> ### GET /status
  Confirms the server is running

* **URL**

  /status

* **Method:**

  `GET`
  
*  **URL Params**

   None


* **Success Response:**

  * **Code:** 200 Success
   * **Content:** `{ message : "Server running"}`
 

----

## Run the tests

Run the tests by running

    npm test

----
