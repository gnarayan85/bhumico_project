module.exports = mongoose => {
  var schema = mongoose.Schema(
      {
      projectId: Number,
      projectName: String,
      budjet: Number,
      endDate : String,
      pdf: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Project = mongoose.model("project", schema);
    return Project;
};
