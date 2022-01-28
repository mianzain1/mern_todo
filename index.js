require("dotenv").config();
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const authRoute = require("./routes/auth")
const PORT = process.env.PORT || 4000;

app.use(express.json());


app.use("/api/auth", authRoute)
mongoose
    .connect(process.env.MONGO_URI)
    .then(console.log("connected to mongo db"))
    .catch(err => console.log(err))


app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})
