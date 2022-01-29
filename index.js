require("dotenv").config();
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser')
//import routes
const authRoute = require("./routes/auth");
const toDoRoute = require("./routes/toDo");

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoute);
app.use("/api/todo", toDoRoute);
mongoose
    .connect(process.env.MONGO_URI)
    .then(console.log("connected to mongo db"))
    .catch(err => console.log(err))


app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})
