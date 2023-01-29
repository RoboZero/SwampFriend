import mongoose, {Schema} from 'mongoose';

const friendSchema = new mongoose.Schema({
    favoriteColor: {
        type: String,
        required: true
    },
    hobbies: {
        type: String,
        required: true
    }
  });

  export default mongoose.model("friend", friendSchema);