const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true
  },
  dateTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  eventClass: {
    type: String,
    required: true
  },
  description: {
      type: String,
      required: true
  },
  coordinators: {
      type: [String],
      required: true
  },
  sponsers: {
      type: [String],
      required: true
  },
});
const Event = mongoose.model('Events', EventSchema);

module.exports = Event;
