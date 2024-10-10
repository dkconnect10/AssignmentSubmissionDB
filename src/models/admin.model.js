
import mongoose from 'mongoose';


const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
    }
}, {
    timestamps: true
});


adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  adminSchema.methods.isPasswordCorrect = function (password) {
    return bcrypt.compare(password, this.password);
  };

  

  
export const Admin =  mongoose.model('Admin', adminSchema);
