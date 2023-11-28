const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require('cors');

const routers = require("./routers/index");
const {connectDatabase} = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middleWares/errors/customErrorHandler");

dotenv.config({
    path : "./config/env/config.env"
});




connectDatabase();

const app  = express();
const PORT = process.env.PORT;


app.use(cors());

// req.body'den gelen değerleri alabilmek için gerekli
app.use(express.json());

app.use("/api",routers);

app.use(customErrorHandler);

app.listen(PORT,() => {
    console.log(`app started on ${PORT} : ${process.env.NODE_ENV}`);
});