const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes/index.route");
const app = express();
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const { errorRes } = require("./services/response");
const swaggerJSDocs = YAML.load("src/swagger.yaml");
const PORT = process.env.PORT || 3000;

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/uploads", express.static("uploads"));
app.use(morgan("combined"));
app.use(helmet());
app.use(cors());
app.use(routes);

// app.use((err, req, res, next) => {
//   console.log(err);
//   return res
//     .status(500)
//     .json(
//       errorRes(
//         500,
//         "An error occured on the server, Please refer back to the backend development team."
//       )
//     );
// });

const server = app.listen(PORT, function () {
  console.log(`starting app on: http://localhost:${PORT}`);
});

const io = require("./socket").init(server);
app.get("/", (req, res) => {
  res.send("Hello");
});

module.exports = app;
