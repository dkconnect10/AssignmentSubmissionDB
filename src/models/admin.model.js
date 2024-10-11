import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'


const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    refreshToken: {
        type: String
    }
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            name:this.name,
            password:this.password
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expireIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

adminSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expireIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Admin  = mongoose.model("Admin",adminSchema)
