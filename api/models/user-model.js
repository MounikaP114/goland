
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim:true,
      required: true,
      unique: true,
      
    },
    email: {
      type: String,
      trim:true,
      required: true,
      unique: true,
      lowarcase:true,
    },
    password: {
      type: String,
      required: true,
      
    },
    avatar:{
      type:String,
      default:"https://imgs.search.brave.com/fIiS4YDOziOysTVdGkHxxtiu9UZLnmB0a8NcS4dPjeA/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA2LzMzLzU0Lzc4/LzM2MF9GXzYzMzU0/Nzg0Ml9BdWdZemV4/VHBNSjl6MVljcFRL/VUJvcUJGMENVQ2sx/MC5qcGc"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
