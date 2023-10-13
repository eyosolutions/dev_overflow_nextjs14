import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkID: string;
  name: string;
  userName: string;
  picture: string;
  email: string;
  password?: string;
  bio?: string;
  location?: string;
  portfolioWebsite?: string;
  reputation?: number;
  joinedAt: Date;
  saved: Schema.Types.ObjectId[];
};

const UserSchema = new Schema({
  clerkID: { type: String, required: true },
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  picture: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  bio: { type: String},
  location: { type: String },
  portfolioWebsite: { type: String },
  reputation: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
  saved: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
});

const User = models.User || model('User', UserSchema);

export default User;
