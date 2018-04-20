const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardHistorySchema = new Schema(
  {
    boardId: { type: String , required: true },
    board: { type: [ [String] ] ,require:true },
    moveNum : { type: Number, required: true },
    createAt: { type: Date, required: true }
  }
)

module.exports = mongoose.model('boardHistory', BoardHistorySchema);