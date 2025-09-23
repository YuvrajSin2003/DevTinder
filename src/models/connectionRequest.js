const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  formUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  Status: {
    type: String,
    requires:true,
    enum: {
      values: ["ingnored", "accepted", "intrested", "rejected"],
      message: "{VALUE} is not supported",
    },
  },
},
{
    timestamps: true
}
);

const ConnectionRequestModel = new mongoose.model("connectionRequest" , connectionRequestSchema)
module.exports = ConnectionRequestModel;
