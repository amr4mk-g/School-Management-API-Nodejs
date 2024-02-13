const mongoose = require("mongoose");
const { Schema } = mongoose;

const teacherSchema = new Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    dateEmployed: {type: Date, default: Date.now},
    teacherId: {type: String, required: true,
      default: function () {
        return ("TEA" + Math.floor(100 + Math.random() * 900) +
          Date.now().toString().slice(2, 4) + this.name.split(" ")
          .map(name => name[0]).join("").toUpperCase());
      },
    },
    //if withdrawn, the teacher will not be able to login
    isWithdrawn: {type: Boolean, default: false},
    //if suspended, the teacher can login but cannot perform any task
    isSuspended: {type: Boolean, default: false},
    //A teacher can teach in more than one class level
    classLevel: {type: String},
    role: {type: String, default: "teacher"},
    subject: {type: Schema.Types.ObjectId, ref: "Subject"},
    applicationStatus: {type: String, enum: ["pending", "approved", "rejected"], default: "pending"},
    program: {type: String},
    academicYear: {type: String},
    createdBy: {type: Schema.Types.ObjectId, ref: "Admin"},
    academicTerm: {type: String},
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;