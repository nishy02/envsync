require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors()); 
app.use(express.json());

const PORT = process.env.PORT || 5000;
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const secretRoutes = require("./routes/secretRoutes");
app.use("/secrets", secretRoutes);

const projectRoutes = require("./routes/projectRoutes");
app.use("/projects", projectRoutes);

app.get("/", (req, res) => {
  res.send("EnvSync API running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
