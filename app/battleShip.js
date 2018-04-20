const Water = require('./models/water');

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
  if( x>9 || y>9 ) return false;
  if(ocean[y][x].unit != 0) return false;
  
  return true;
}

function createEmptyWater(){
  let newWater = Water.Water
  return newWater;
}

function printOcean(ocean){
  console.log("------ for debuggin only -----------");
  for(let i=0; i<ocean.length; i++){
    str = "";
    for (let j=0; j<ocean[i].length; j++){
      str += ocean[i][j].unit;
      str += " ";
    }
    console.log(str);
  }
  console.log("------ for debuggin only -----------");
}

module.exports = { createEmptyOcean, placeShips, printOcean };