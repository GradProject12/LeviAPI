const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(3000, function () {
  console.log(`starting app on: http://localhost:${PORT}`);
});

app.get('/',(req, res) => {
    res.send('Hello')
})

