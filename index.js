require("dotenv").config();
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const PORT = process.env.PORT || 4000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(console.log("connected to mongo db"))
    .catch(err => console.log(err))


app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})
