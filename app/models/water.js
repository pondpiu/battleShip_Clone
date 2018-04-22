// let Water = {
//   // 0 = unknow, 1 = miss, 2 = hit, 3 = sunk
//   type: { type: Number ,required: true, default: 0},

//   0 = empty, 1 = Battleship, 2 = Cruisers, 3 = Destroyers, 4 =  Submarines
//   unit: { type: Number, default: 0 },

//   headPos: { type: Number },

//   // 0 = vertical, 1 = horizontal
//   orientation : {type: Number}
// }

const Water = {
  type: 0,
  unit: 0,
  headPos: null,
  orientation: 0
}

module.exports = { Water};