const db = require("../models");
const Project = db.project;
var html_to_pdf = require('html-pdf-node');

// Create and Save a new Project
exports.create = (req, res) => {
    var html = "";
    if (req.body.projectId != undefined) {
        html = '<div style="border:1px solid black; width: 250px;border-radius: 5px; padding: 20px;"> <div style= "text-align:center;padding-bottom:5px"> <b>Project Data</b> </div> <hr> <table style="border: none;"> <tbody> <tr> <td >Project ID</td> <td >:</td> <td> ' + req.body.projectId  + '</td> </tr> <tr> <td >Project Name</td> <td >:</td> <td >' + req.body.projectName + '</td> </tr> <tr> <td >Budget</td> <td >:</td> <td >' + req.body.budjet + '</td> </tr> <tr> <td >End Date</td> <td >:</td> <td>' + req.body.endDate + '</td> </tr> </tbody> </table> </div>';
    } else {
        var id = Math.floor(100000 + Math.random() * 900000);
        html = '<div style="border:1px solid black; width: 250px;border-radius: 5px; padding: 20px;"> <div style= "text-align:center;padding-bottom:5px"> <b>Project Data</b> </div> <hr> <table style="border: none;"> <tbody> <tr> <td >Project ID</td> <td >:</td> <td> ' + id + '</td> </tr> <tr> <td >Project Name</td> <td >:</td> <td >' + req.body.projectName + '</td> </tr> <tr> <td >Budget</td> <td >:</td> <td >' + req.body.budjet + '</td> </tr> <tr> <td >End Date</td> <td >:</td> <td>' + req.body.endDate + '</td> </tr> </tbody> </table> </div>';
    }
    let options = { format: 'A4' };

    let file = { content: html };

    html_to_pdf.generatePdf(file, options).then(pdfBuffer => {

        if (req.body.projectId != undefined) {
            var condition = { projectId: req.body.projectId} ;

            Project.find(condition).sort({ _id: -1 })
                .then(data => {
                    Project.findByIdAndUpdate(data[0]._id, { $set: { projectName: req.body.projectName, pdf: pdfBuffer.toString('base64') } }, { useFindAndModify: false })
                        .then(data => {
                            if (!data) {
                                res.status(404).send({
                                    message: `Cannot update Project with id=${id}. Maybe Project was not found!`
                                });
                            } else res.send({ message: "Project was updated successfully." });
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: "Error updating Project with id=" + id
                            });
                        });
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while retrieving project."
                    });
                });
        } else {
            // Create a Project
            const project = new Project({
                projectId: id,
                projectName: req.body.projectName,
                budjet: req.body.budjet,
                endDate: req.body.endDate,
                pdf: pdfBuffer.toString('base64')
            });

            // Save Project in the database
            project
                .save(project)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the Project."
                    });
                });
        }
       
    });


    
};

// Retrieve all Project from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

    Project.find(condition).sort({ _id: -1 })
        .then(data => {
            res.send(data[0]);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving project."
            });
        });
};

// Find a single Project with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Project.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Project with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Project with id=" + id });
        });
};

// Update a Project by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Project.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Project with id=${id}. Maybe Project was not found!`
                });
            } else res.send({ message: "Project was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Project with id=" + id
            });
        });
};
