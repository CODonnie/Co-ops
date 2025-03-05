import mongoose, { Schema, Document, model, Types } from "mongoose";
import bcrypt from "bcryptjs";

//User -> Workspace -> Project <-> Goals(tasks)

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword(userPassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(userPassword, this.password);
};

export const User =
  mongoose.models.User<IUser> || model<IUser>("User", UserSchema);

//Workspace -> Project <-> Goals(tasks)

export interface IWorkspace extends Document {
  name: string;
  admin: Types.ObjectId;
  colleagues: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
const WorkspaceSchema = new Schema<IWorkspace>(
  {
    name: { type: String, required: true, unique: true },
    admin: { type: Schema.Types.ObjectId, ref: "User" },
    colleagues: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Workspace =
  mongoose.models.Workspace<IWorkspace> ||
  model<IWorkspace>("Workspace", WorkspaceSchema);

//Project <-> Goals(tasks)

export interface IProject extends Document {
  title: string;
  workspace: Types.ObjectId;
  goals: Types.ObjectId;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, unique: true },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    goals: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

export const Project =
  mongoose.models.Project<IProject> ||
  model<IProject>("Project", ProjectSchema);

//Goals(tasks)

export interface ITask extends Document {
  title: string;
  project: Types.ObjectId;
  completed: boolean;
  assignedTo: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, unique: true },
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    completed: { type: Boolean, required: true, default: false },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Task =
  mongoose.models.Task<ITask> || model<ITask>("Task", TaskSchema);
