import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    projectName: { type: String, required: true, trim: true },
    appwriteEndpoint: { type: String, required: true, trim: true },
    projectId: { type: String, required: true, trim: true },
    apiKey: { type: String, required: true, select: false },
    lastPinged: { type: Date, default: null },
    status: {
      type: String,
      enum: ["active", "failed", "unknown"],
      default: "unknown",
    },
    autoPingEnabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

projectSchema.index({ userId: 1, projectName: 1 });

export default mongoose.model("Project", projectSchema);
