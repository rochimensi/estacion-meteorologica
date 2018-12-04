let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let timestamps = require('mongoose-timestamp');

const EventSchema = new Schema(
  {
    sensor: {
      type: String,
      enum: ['temperatura', 'viento', 'humedad'],
      required: true
    },
    valor: {
      type: String,
      required: true
    }
  }
);

EventSchema.plugin(timestamps);

let Event = mongoose.model('Event', EventSchema);

module.exports = {Event};