const express = require("express");
const bodyParser = require("body-parser");
const cors=require("cors");
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require("./routes/index.route");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
  );
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(cors())
app.use(routes);
app.listen(3000, function () {
  console.log(`starting app on: http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello");
});
