const mongoose = require('mongoose');

const SlotBookingSchema = new mongoose.Schema({
centerId: { 
      type: String, 
      required: true 
   },
  emails: 
  { 
    type: [String],
    default:[]
  },

});
const SlotBookingModel = mongoose.model("slots", SlotBookingSchema);

module.exports = SlotBookingModel;




