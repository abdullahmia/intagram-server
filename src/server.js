const express = require("express");
const app = express();
const cors = require("cors");
// eslint-disable-next-line no-unused-vars
const db = require("./db/db");
const routes = require("./routes/index");
require("dotenv").config({ path: `${__dirname}/../.env` });

// middlewares
app.use(cors());
app.use(express.json());

// route middleware
app.use("/api", routes);

// server configuration
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server is ruiing at http://localhost:${port}`);
});
