const mongoose = require("mongoose");
const { Schema } = mongoose;

//students will be added to the class level when they are registered
//level: 100/200/300/400
const ClassLevelSchema = new Schema(
  {  
    name: {type: String, required: true},
    description: {type: String},
    createdBy: {type: Schema.Types.ObjectId, ref: "Admin", required: true},
    students: [{type: Schema.Types.ObjectId, ref: "Student"}],
    subjects: [{type: Schema.Types.ObjectId, ref: "Subject"}],
    teachers: [{type: Schema.Types.ObjectId, ref: "Teacher"}],
  },
  { timestamps: true }
);

const ClassLevel = mongoose.model("ClassLevel", ClassLevelSchema);
module.exports = ClassLevel;