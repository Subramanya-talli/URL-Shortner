const express = require("express")
const dotenv = require("dotenv");
const URL = require("./model/url.js")
const { connectToMongoDb } =require("./connect.js")
const urlRoute = require("./routes/url.js")
const path = require("path")
const staticRouter = require('./routes/staticRouter.js')


const app = express();
app.use(express.json()) 
app.use(express.urlencoded({extended: false}))// which supports Form Data


const PORT = process.env.PORT || 3000;
dotenv.config({path : "config.env"})

app.use('/url', urlRoute);
app.use('/', staticRouter);


app.get('/:shortId', async function(req, res) {
  try {
      const shortId = req.params.shortId;
      const entry = await URL.findOneAndUpdate(
          { shortId },
          { $push: { visitHistory: { timestamp: Date.now() } } },
          { new: true }
      );

      if (!entry) {
          console.log('URL not found for shortId:', shortId); // Log if URL not found
          return res.status(404).json({ error: 'URL not found' });
      }

      res.redirect(entry.redirectUrl);
  } catch (error) {
      console.error('Error occurred:', error); // Log any errors
      res.status(500).json({ error: 'Internal server error' });
  }
});



connectToMongoDb(process.env.MONGODB_URL)
.then(()=>console.log("MongoDb got connected")
)



app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))

app.listen(PORT, ()=>{
    console.log(`Server is running in PORT ${PORT}`)
})