const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./db");
const router = require("./routes/index");
const path = require("path");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDoc = YAML.load("./api.yaml");

const PORT = process.env.PORT || 9000;

connectDB();

const app = express();
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "static/images")));
app.use("/api", router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});
