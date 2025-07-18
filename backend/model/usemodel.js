import mongoose from 'mongoose' 
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required :true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age :{
  type :String,
  required:false
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'developer', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  otp:{
   type :String,
   require :true

  }
  ,
  isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verficationToken:String,
    verficationTokenExpiresAt:Date,

    
},{timestamps:true});

const User = mongoose.model('User', userSchema);
export default User;
