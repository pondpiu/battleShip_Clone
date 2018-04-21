const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardHistorySchema = new Schema(
  {
    boardId: { type: String , required: true },
    moveNum : { type: Number, required: true },
    createAt: { type: Date, required: true },
    unitLeft : { type: Number, required: true },
    ocean: { type: Array ,require:true },
  }
)

module.exports = mongoose.model('boardHistory', BoardHistorySchema);