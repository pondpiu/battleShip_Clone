const Water = require('./models/water');

const Logger = require('../app/logger');

//create the 2d array of empty water
function createEmptyOcean(width,height){
  let ocean = [];
  for (let j =0; j<height; j++){
    ocean.push(
      Array.apply(null, new Array(width)).map(() => {return createEmptyWater();})
    );
  }
  return ocean;
}

function placeShips(ocean, numBattleShip, numCruisers, numDestroyers, numSubmarines){
  //place BattleShip
  for(let i = 0; i<numBattleShip; i++){
    ocean = tryPlaceShip(ocean, 1, 4);
  }
  //place Cruisers
  for(let i = 0; i<numCruisers; i++){
    ocean = tryPlaceShip(ocean, 2, 3);
  }
  //place Destroyers
  for(let i = 0; i<numDestroyers; i++){
    ocean = tryPlaceShip(ocean, 3, 2);
  }
  //place Submarines
  for(let i = 0; i<numSubmarines; i++){
    ocean = tryPlaceShip(ocean, 4, 1);
  }
  return ocean;
}

// ------- private function --------- //

function tryPlaceShip(ocean, unit, length){
  let coord = [];
  do{
    coord = randomCoord();
  }
  while(!checkLegalPlaceShip(ocean,coord, length ));
  ocean = placeShip(ocean, coord, unit, length);

  return ocean;
}

function placeShip(ocean, coord, unit, length){
  return _placeShip(ocean, coord[0], coord[1], coord[2], unit, length);
}

function _placeShip(ocean, x, y, orientation, unit, length){
  let dx = 0;
  let dy = 0;
  if(orientation == 0){ // vertical
    dx = 1;
  }else{
    dy = 1;
  }
  for(let i=0; i<length;i++){
    let newWater = {
      type: 0,
      unit: unit,
      headPos: [x,y],
      orientation: orientation
    };
    ocean[y+(i*dy)][x+(i*dx)] = newWater;
  }
  return ocean;
}

function randomCoord(){
  //random integer 0 to 9
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);
  const orientation = Math.floor(Math.random() * 2);
  return [x, y, orientation];
}

function checkLegalPlaceShip(ocean, coord, length){
  return _checkLegalPlaceShip(ocean, coord[0], coord[1], coord[2], length);
}

function _checkLegalPlaceShip(ocean, x, y, orientation, length){
  let dx = 0;
  let dy = 0;
  if(orientation == 0){ // vertical
    dx = 1;
  }else{
    dy = 1;
  }

  for(let i=0; i<length;i++){
    if(!checkLegal(ocean, x+(i*dx), y+(i*dy))){ // not legal
      return false;
    };
  };
  return true;
};

function checkLegal(ocean, x, y){
  if( x < 0 || y < 0 || x > 9 || y > 9){ return false; }

  // the ships cannot overlap or be placed directly adjacent to each other on the grid.
  if(checkInvalidWaterUnit(x-1, y-1, ocean) || checkInvalidWaterUnit(x, y-1, ocean) || checkInvalidWaterUnit(x+1, y-1, ocean)) return false; // check upper 3 water 
  if(checkInvalidWaterUnit(x-1, y, ocean) || checkInvalidWaterUnit(x, y, ocean) || checkInvalidWaterUnit(x+1, y, ocean)) return false; // check middle 3 water
  if(checkInvalidWaterUnit(x-1, y+1, ocean) || checkInvalidWaterUnit(x, y+1, ocean) || checkInvalidWaterUnit(x+1, y+1, ocean)) return false; // check bottom 3 water

  return true;
}

function checkInvalidWaterUnit(x, y, ocean){
  //clamp pos inside 2d array
  x = Math.max(Math.min(x,9),0);
  y = Math.max(Math.min(y,9),0);

  return ocean[y][x].unit != 0;

}

function createEmptyWater(){
  const newWater = JSON.parse(JSON.stringify(Water.Water)); //clone the water
  return newWater;
}

function printOcean(ocean){
  for(let i=0; i<ocean.length; i++){
    str = "";
    for (let j=0; j<ocean[i].length; j++){
      str += ocean[i][j].unit;
      str += " ";
    }
    Logger.log(str);
  }
}

function generateClientBoard(_id, moveNum, ocean, createAt){
  const cleintOcean = ocean.map( (waterArray) =>{
    return waterArray.map( (water) => {
      visibleUnit = -1;
      //only show unit type if its type 1 or 3 ( miss or sunk)
      if(water.type == 1 || water.type == 3){
        visibleUnit = water.unit;
      }
      visibleWater = {
        type: water.type,
        unit: visibleUnit
      };
      return visibleWater;
    });
  });

  let clientBoard = {
    boardId: _id,
    moveNum: moveNum,
    ocean: cleintOcean,
    createAt: createAt
  };
  return clientBoard;
}

function generateNewOcean(){
  return _generateNewOcean(10, 10, 1, 2, 3, 4);
}

function _generateNewOcean(width, height, numBattleShip, numCruisers, numDestroyers, numSubmarines){
  const emptyOcean = createEmptyOcean(width,height);
  const newOcean = placeShips(emptyOcean, numBattleShip, numCruisers, numDestroyers, numSubmarines);
  totalUnit = numBattleShip + numCruisers + numDestroyers + numSubmarines;
  return [newOcean, totalUnit];
}

// battleResult : { type: Number }
// 0 = invalid, 1 = miss, 2 = hit, 3 = sunk
function attackWaterAtPos(x, y, ocean){
  if( !isNumber(x) || !isNumber(y) || x>9 || y>9 || x<0 || y<0 ){
    return [0, "("+ x + ","+ y + ") is not a valid coordinate", ocean]
  }
  let targetWater = ocean[y][x];

  if( targetWater.type !== 0 ) {
    return [0, "the position has already been attacked", ocean];
  }
  if( targetWater.unit == 0 ){
    ocean[y][x].type = 1;
    return [1, "Miss", ocean]
  }

  headX = targetWater.headPos[0];
  headY = targetWater.headPos[1];
  orientation = targetWater.orientation;
  ocean[y][x].type = 2;

  if( targetWater.unit == 1 ){
    return trySunk(headX, headY, orientation, 4, "Battleship", ocean);
  }
  if( targetWater.unit == 2 ){
    return trySunk(headX, headY, orientation, 3, "Cruisers", ocean);
  }
  if( targetWater.unit == 3 ){
    return trySunk(headX, headY, orientation, 2, "Destroyers", ocean);
  }
  if( targetWater.unit == 4 ){
    return trySunk(headX, headY, orientation, 1, "Submarines", ocean);
  }
  return [0, "Some errors occured. The unit type "+ targetWater.unit + " of the water is not a valid unit type. "]
  
}

function checkShipSunk(x, y, orientation, length, ocean){
  let dx = 0;
  let dy = 0;
  if(orientation == 0){ // vertical
    dx = 1;
  }else{
    dy = 1;
  }
  
  let sunkOcean = JSON.parse(JSON.stringify(ocean)); //clone the ocean

  for(let i=0; i<length;i++){
    if(ocean[y+(i*dy)][x+(i*dx)].type == 0){ // not sunk
      return [false];
    };
    if(ocean[y+(i*dy)][x+(i*dx)].type == 1){ // not legal
      console.log("error checkShipSunk : found miss type in between ship")
      return [false];
    };
    if(ocean[y+(i*dy)][x+(i*dx)].type == 3){ // not legal
      console.log("error checkShipSunk : ship already sunk")
      return [false];
    };

    if(ocean[y+(i*dy)][x+(i*dx)].type == 2){ // water has been hit
      sunkOcean[y+(i*dy)][x+(i*dx)].type = 3;
    } 
  };
  return [true, sunkOcean];
}

function trySunk(headX, headY, orientation, length, shipName, ocean){
  const checkSunkResult = checkShipSunk(headX, headY, orientation, length, ocean);
    if(checkSunkResult[0]){
      return [3, "You just sank the "+shipName, checkSunkResult[1]];
    }else{
      return [2, "Hit", ocean];
    }
}

// Returns if a value is really a number
function isNumber (value) {
  return typeof value === 'number' && isFinite(value);
  };

module.exports = { printOcean, generateClientBoard, generateNewOcean, attackWaterAtPos };