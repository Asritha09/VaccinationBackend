const express = require("express");
const app = express();
const cors = require("cors")
const mongoose = require("mongoose");


app.use(cors())
app.use(express.json())
app.use(express.urlencoded())


const UserModel = require("./models/UserSchema")
const VaccinationModel = require("./models/VaccinationSchema")
const SlotBookingModel =require("./models/SlotBookingSchema");
const AdminModel = require("./models/AdminSchema")



// const mongo_url = "mongodb+srv://ravindradodda:R@vi1234@cluster0.xbfnrvl.mongodb.net/?retryWrites=true&w=majority";
const mongo_url = "mongodb+srv://ravi:8E24PrbDNLVDIRLr@havit.i3tiyjw.mongodb.net/covidvaccination?retryWrites=true&w=majority"

mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });



app.post('/userSignup', async (req, res) => {
    const { email, password } = req.body;
    // const email="kumar@gmail.com"
    // const password="1234"



    const result = await UserModel.findOne({ email })


    if (result !== null && result.email === email) {
        res.send({ message: "Email already exists" })
    }
    else {

        const newUser = new UserModel({ email, password });
        newUser.save()
            .then((response) => {

                if (response.email === email) {
                    res.json({ message: 'SignUp successfully' });
                }
                else {
                    res.json({ message: "Error occured" })

                }

            })
            .catch((err) => {
                res.json({ message: "Error occured" })
            })

    }
});


app.post('/adminSignup', async (req, res) => {
    const { email, password } = req.body;
    // const email="kumar@gmail.com"
    // const password="1234"



    const result = await AdminModel.findOne({ email })


    if (result !== null && result.email === email) {
        res.send({ message: "Email already exists" })
    }
    else {

        const newAdmin = new AdminModel({ email, password });
        newAdmin.save()
            .then((response) => {

                if (response.email === email) {
                    res.json({ message: 'SignUp successfully' });
                }
                else {
                    res.json({ message: "Error occured" })

                }

            })
            .catch((err) => {
                res.json({ message: "Error occured" })
            })

    }
});




app.post("/userLogin", async (req, res) => {

    const { email, password } = req.body


    try {
        await UserModel.findOne({ email })

            .then((response) => {

                if (response.email === email) {
                    if (password === response.password) {
                        res.send({ message: "Login Successful" })
                    }
                    else {
                        res.send({ message: "Incorrect password" })
                    }
                }
                else if (response.email === undefined) {
                    res.send({ message: "Email not found" })
                }

            })
            .catch((err) => {
                res.send({ message: "Email not found" })
            })
    }

    catch (error) {
        res.status(500).send('Error occured');
    }


})


app.post("/adminLogin", async (req, res) => {

    const { email, password } = req.body


    try {
        await AdminModel.findOne({ email })

            .then((response) => {

                if (response.email === email) {
                    if (password === response.password) {
                        res.send({ message: "Login Successful" })
                    }
                    else {
                        res.send({ message: "Incorrect password" })
                    }
                }
                else if (response.email === undefined) {
                    res.send({ message: "Email not found" })
                }

            })
            .catch((err) => {
                res.send({ message: "Email not found" })
            })
    }

    catch (error) {
        res.status(500).send('Error occured');
    }


})


app.get('/getVaccinationCenters', async (req, res) => {
    const data = await VaccinationModel.find()
    res.json({  data })
 
});

app.post('/vaccinationSlots', async (req, res) => {
 
    const centerName=req.body.slotCenterName
    const email=req.body.email
    const date=req.body.formattedDate
    
    try {
        const updatedCentre = await VaccinationModel.findOneAndUpdate(
            { centerName: centerName, "workingHours.Date": date },
            { $push: { "workingHours.$.Slots": email }, $inc: { "workingHours.$.NumberOfPeople": 1 } }
          );


      if (updatedCentre) {
        res.json({ message: 'Vaccination slot booked successfully' });
      } else {
        res.json({ error: 'Working hour not found for the provided date' });
      }
    } catch (error) {
      res.json({ error: 'Internal server error' });
    }
  });
  




app.post('/addVaccinationCenters', (req, res) => {
    // const { name, address, workingHours } = req.body;
    const centerName=req.body.slotCenterName
    const address=req.body.cityName
    const workingHours=req.body.workingHours
    // const centerName = "Center2" 
    // const address = "Narasaraopet" 
    // const workingHours = [ 
    //     {
    //         Date: '21-06-2023',
    //         NumberOfPeople: 7
    //     }
    // ]
    try {
        const newCenter = new VaccinationModel({ centerName, address, workingHours });
        newCenter.save()
            .then((response) => {
                res.json({ message: 'Vaccination centre added successfully' });
            })
    }
    catch (err) {
        res.json({ message: "Error Occured" })
    }

});


app.post('/getDosageDetails', async (req, res) => {
    try {
    //   const id = "648ae58fa8f3ae8d62f63200";
    const id=req.body.id
      const data = await VaccinationModel.findById(id);
  
      if (!data) {
        return res.status(404).json({ error: 'Vaccination centre not found' });
      }
  
      let totalNumberOfPeople = 0;
  
      data.workingHours.forEach((workingHour) => {
        totalNumberOfPeople += workingHour.NumberOfPeople;
      });
  
      res.json(totalNumberOfPeople);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  



  app.delete('/removeVaccinationCentre', async (req, res) => {
    const centerName = req.body.slotCenterName;
    const address = req.body.cityName;
    
    try {
      const centre = await VaccinationModel.findOneAndRemove({ centerName, address });
      if (centre) {
        res.json({ message: 'Center removed successfully' });
      } else {
        res.json({ message: 'Center not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error occurred while removing center' });
    }
  });
  
  


app.listen(3001, () => {
    console.log("Server running");
});

