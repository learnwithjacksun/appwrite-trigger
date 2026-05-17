import mongoose from "mongoose";

const pingLogSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    success: { type: Boolean, required: true },
    responseTimeMs: { type: Number },
    statusCode: { type: Number },
    message: { type: String },
    appwriteResponse: { type: mongoose.Schema.Types.Mixed },
    source: {
      type: String,
      enum: ["manual", "cron", "retry"],
      default: "manual",
    },
  },
  { timestamps: true },
);

export default mongoose.model("PingLog", pingLogSchema);
