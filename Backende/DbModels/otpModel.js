import mongoose from "mongoose";

const otpscema = new mongoose.Schema({
          email:{type : String , required : true},
          otp:{type : String , required : true},
          expireAt : {
            type: Date,
            required: true,
            default: () => Date.now() + 10 * 60 * 1000 // Expires in 10 minutes
          },

})
export const OTP = mongoose.model("OTP" , otpscema);
