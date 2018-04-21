const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema(
  {
    moveNum : { type: Number, required: true },
    updateAt: { type: Date, default: Date.now },
    unitLeft : { type: Number, required: true },
    ocean: { type: Array ,require:true }
  }
)

// Sets the updateAt parameter equal to the current time
BoardSchema.pre('save', next => {
  now = new Date();
  if(!this.updateAt) {
    this.updateAt = now;
  }
  next();
});

module.exports = mongoose.model('board', BoardSchema);