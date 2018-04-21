const mongoose = require('mongoose');
const BoardHistory = require('./models/boardHistory');

const Logger = require('../app/logger');

function saveHistory( board, msg, callback ){
  boardHistory = new BoardHistory(
    {
      boardId: board._id,
      ocean: board.ocean,
      moveNum : board.moveNum,
      createAt: board.updateAt,
      unitLeft: board.unitLeft,
      message: msg
    }
  );

  boardHistory.save((err, boardHistory) => {
    if(err){
      Logger.log("History.saveHistory : "+err);
    }else{
      if (callback && typeof callback === 'function') {
        callback(boardHistory);
        // Do some other stuff if callback is exists.
      }else{
        Logger.log("History saved!");
      }
    }
  });
}

module.exports = { saveHistory };