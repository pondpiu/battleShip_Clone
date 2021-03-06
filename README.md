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
- bid(string): Board ID

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

### ATTACK A BOARD BY ID

Path: /board/attack/{bid}   
HTTP Method: POST   
Return Data: attack result message  
Description: make a attack on board with id = Board ID at position (x,y)    

URI parameter
- bid(string): Board ID

Body parameter
- x(int): target position in x coordinate
- y(int): target position in y coordinate

Example: /board/attack/5adcb3000959235b5c891a28
    with body: x = 2, y = 3
```
{
    "message": "Miss"
}
```

### RESET A BOARD BY ID

Path: /board/reset/{bid}    
HTTP Method: GET    
Return Data: reset result message   
Description: reset a board with id = Board ID   

URI parameter
- bid(string): Board ID

Example: /board/reset/5adcb3000959235b5c891a28
```
{
    "message": "Board reset secuessfully"
}
```

### GET BOARD HISTORY BY ID

Path: /board/history/{bid}  
HTTP Method: GET    
Return Data: array of board history 
Description: get history of a board with id = Board ID  

Example: /board/history/5add607651be5c53f4b1c9e1
```
[
    { "ocean": 
        [
            [ { "type": 0, "unit": 3, "headPos": [2, 7], "orientation": 0},{"type": 0, "unit": 0, "headPos": null, "orientation": 0},  "type": 0, "unit": 0, "headPos": null, "orientation": 0}, { "type": 0, "unit": 0, "headPos": null, "orientation": 0}, {"type": 0, "unit": 0, "headPos": null, "orientation": 0}, {"type": 0, "unit": 0, "headPos": null, "orientation": 0}, {"type": 0, "unit": 0, "headPos": null, "orientation": 0}, {"type": 0, "unit": 0, "headPos": null,"orientation": 0}, { "type": 0, "unit": 0, "headPos": null, "orientation": 0}, {"type": 0, "unit": 0, "headPos": null, "orientation": 0}
            ],
            .
            .
            .
            [ ... ]
        ],
        "_id": "5add607651be5c53f4b1c9e2",
        "boardId": "5add607651be5c53f4b1c9e1",
        "moveNum": 0,
        "createAt": "2018-04-23T04:26:30.670Z",
        "unitLeft": 10,
        "message": "initialize",
        "__v": 0
    },
    {
        "ocean": 
            [
               [ ... ],
                .
                .
                .
                [ ... ]           
            ]
        ],
        "_id": "5add607e51be5c53f4b1c9e3",
        "boardId": "5add607651be5c53f4b1c9e1",
        "moveNum": 1,
        "createAt": "2018-04-23T04:26:38.078Z",
        "unitLeft": 10,
        "message": "Miss",
        "__v": 0
    }
]
```
