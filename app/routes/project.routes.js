module.exports = app => {
  const projects = require("../controllers/project.controller.js");

  var router = require("express").Router();

  // Create a new projects
    router.post("/", projects.create);

  // Retrieve all projects
    router.get("/", projects.findAll);

  // Retrieve a single projects with id
    router.get("/:id", projects.findOne);

  // Update a projects with id
    router.put("/:id", projects.update);

  app.use("/api/project", router);
};
