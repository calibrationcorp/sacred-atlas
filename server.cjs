const express = require("express");
const path = require("node:path");

const app = express();
const publicDirectory = path.join(__dirname, "public");

app.use(express.static(publicDirectory));
app.get("/{*route}", (request, response, next) => {
  if (request.path.startsWith("/api/") || path.extname(request.path)) {
    return next();
  }
  return response.sendFile(path.join(publicDirectory, "index.html"));
});

app.listen(process.env.PORT || 10000, "0.0.0.0");
