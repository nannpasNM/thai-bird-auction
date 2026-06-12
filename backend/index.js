const express = require("express");
const cors = require("cors");

const auctionRoutes = require("./routes/auctionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", auctionRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
