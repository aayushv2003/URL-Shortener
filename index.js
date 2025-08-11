const express = require("express");
const path=require("path")
const cookieParser=require('cookie-parser')
const { connectToMongoDB } = require("./connect");
const {restrictToLoggedinUserOnly}=require("./middlewares/auth")


const URL = require("./models/url");
const urlRoute = require("./routes/url");
const staticRoute=require("./routes/staticRouter");
const userRoute=require("./routes/user")
const app = express();

const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("Mongodb Connected"));
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.get("/test", async (req, res) => {
  const alUrls = await URL.find({});
  return res.render("home", { urls: alUrls }); // ✅ Pass urls to EJS
});

app.use("/url", restrictToLoggedinUserOnly, urlRoute); //inline middleware so that the user must be logged in to make request on url
app.use("/",staticRoute);
app.use("/user",userRoute);
app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortID: shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT ${PORT}`));
