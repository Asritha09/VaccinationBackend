const mongoose = require('mongoose');

const VaccinationSchema = new mongoose.Schema({
  centerName: { 
    type: String,
     required: true
     },
  address: {
     type: String, 
     required: true 
    },
  workingHours: 
    [
    {
      Date:String,
      NumberOfPeople:Number,
      Slots: {
        type: [String],
        default: [],
      }, 
    }
    ],
  
    
   
 

});
const VaccinationModel = mongoose.model("centers", VaccinationSchema);

module.exports = VaccinationModel;




