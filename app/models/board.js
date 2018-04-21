const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema(
  {
    
    moveNum : { type: Number, required: true },
    createAt: { type: Date, default: Date.now },
    unitLeft : { type: Number, required: true },
    ocean: { type: Array ,require:true }
  }
)

// Sets the createdAt parameter equal to the current time
BoardSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('board', BoardSchema);