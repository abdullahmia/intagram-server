const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
// eslint-disable-next-line no-unused-vars
const db = require("./db/db");
const routes = require("./routes/index");
require("dotenv").config({ path: `${__dirname}/../.env` });

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route middleware
app.use("/api", routes);

// server configuration
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});
