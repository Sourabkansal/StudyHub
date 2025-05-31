import jwd from "jsonwebtoken";

const createTokenSetcookie = async ( res , id)=>{
    let token = jwd.sign({id}, process.env.JWT_SECRET , {
         expiresIn: "7d"
    });

     res.cookie('token',token ,{
          httpOnly : true,
          secure : true ,
          samesite : "strict" ,
        maxAge : 10*24*60*60*1000
     })
     
}
export default createTokenSetcookie