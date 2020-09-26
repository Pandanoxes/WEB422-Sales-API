const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataService = require("./modules/data-service.js");
const { ppid } = require("process");
const { json } = require("body-parser");
require("dotenv").config({ path: "./config/keys.env" });

const myData = dataService(`${process.env.MONGO_CONNECTION_STRING}`);

const app = express();

app.use(cors());

app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT || 8080;

// ************* API Routes

// POST /api/sales (NOTE: This route must read the contents of the request body)
app.post("/api/sales", (req, res) => {
  myData
    .addNewSale(req.body)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch(() => {
      res.json({ message: "Fail to add new Sale" });
    });
});
// GET /api/sales (NOTE: This route must accept the numeric query parameters "page" and "perPage", ie: /api/sales?page=1&perPage=5 )
app.get("/api/sales", (req, res) => {
  myData
    .getAllSales(req.query.page, req.query.perPage)
    .then((data) => {
      res.json({ sales: data });
    })
    .catch(() => {
      res.json({ message: "Fail to get sales" });
    });
});
// GET /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.get("/api/sales/:_id", (req, res) => {
  myData
    .getSaleById(req.params._id)
    .then((data) => {
      res.json({ sale: data });
    })
    .catch(() => {
      res.json({ message: "Fail to get sale." });
    });
});
// PUT /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8 as well as read the contents of the request body)
app.put("/api/sales/:_id", (req, res) => {
  myData
    .updateSaleById(req.body, req.params._id)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch(() => {
      res.json({ message: "Fail to update sale." });
    });
});
// DELETE /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.delete("/api/sales/:_id", (req, res) => {
  myData
    .deleteSaleById(req.params._id)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch(() => {
      res.json({ message: "Fail to delete sale." });
    });
});
// ************* Initialize the Service & Start the Server

myData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
