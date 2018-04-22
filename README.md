# battleShip_Clone
Node back end API for Battleship Clone

## Getting Started
get a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites
* Node.js
* yarn `( npm can also be used.)`
### Installation
1. Clone the project
2. go to root directory
```
cd battleShip_Clone
```
3. install depedencies
```
yarn install
```
4. configure port and mongo db `(create .env file at root)`
```
// .env
PORT="....."
MONGO_URI="...."
```
5. run a `development server`
```
yarn run dev
```
server will be listening on `localhost:PORT`

## Running the tests
start server and run test using mocha
### API test
testing api route
```
yarn run test
```
test result will be shown in console
### play through test
run series of api call to simulate full game play
```
yarn run play-test
```
play test will initialize and all the response from api will be shown in console
attack route will be called with incremental position until win response is return.

## API

### CREATE A NEW BOARD
Path: /board
HTTP Method: GET
Return Data: a client board and a response message
Description: Get a new instance of a board

Example: /board
```
{
    "message": "Board successfully initialize!",
    "board": {
        "boardId": "5adcb2305d0b7954c4563702",
        "moveNum": 0,
        "ocean": [
              [ {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1} ],
              .
              .
              .
              [ {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1}, {"type": 0, "unit": -1} ]
          ],
        "createAt": "2018-04-22T16:02:56.911Z"
    }
}
```

### GETTING BOARDS
Path: /board/list
HTTP Method: GET
Return Data: Array of board info `{ _id, moveNum }`
Description: Get array of board info of all existing board

Example: /board/list
```
[
    { 
        "updateAt": "2018-04-22T15:56:04.298Z",
        "_id": "5adcaef4a43c5b1898c42083",
        "moveNum": 48
    },
    {
        "updateAt": "2018-04-22T16:02:56.911Z",
        "_id": "5adcaf13a43c5b1898c42085",
        "moveNum": 0
    }
]
```

### GETTING A BOARD BY ID

Path: /board/{bid}
HTTP Method: GET
Return Data: a client board
Description: get a board according to the given board ID parameter in the URI

URI parameter

mid(int): Board ID
Example: /board/5adcb3000959235b5c891a28

```
{
    "board": {
        "boardId": "5adcb3000959235b5c891a28",
        "moveNum": 99,
        "ocean": [
            [ {"type": 1, "unit": 0}, {"type": 1, "unit": 0}, {"type": 1, "unit": 0}, {"type": 1, "unit": 0}, {"type": 1, "unit": 0}, {"type": 1, "unit": 0}, {"type": 1, "unit": 0}, {"type": 1, "unit": 0}, {"type": 3, "unit": 4}, {"type": 1, "unit": 0} ],
            .
            .
            .
            [ {"type": 1, "unit": 0}, {"type": 1, "unit": 0}, {"type": 1, "unit": 0}, {"type": 1,"unit": 0}, {"type": 3,"unit": 4}, {"type": 1, "unit": 0}, {"type": 1, "unit": 0}, {"type": 1, "unit": 0}, {"type": 3, "unit": 4}, {"type": 0, "unit": -1} ]
          ],
        "createAt": "2018-04-22T16:06:28.680Z"
    }
}
```
