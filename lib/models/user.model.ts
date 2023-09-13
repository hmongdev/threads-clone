import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  threads: [
    // one user can have multiple threads
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thread'
    }
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    // one user can belong to multiple communities
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community'
    }
  ]
});

// if User already exists, use that User
// if User doesn't exist, create a new one in DB
export const User = mongoose.models.User || mongoose.model('User', userSchema);