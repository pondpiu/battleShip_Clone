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
