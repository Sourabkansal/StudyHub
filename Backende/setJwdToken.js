import jwt from "jsonwebtoken"; // Fixed typo: jwd -> jwt

const createTokenSetcookie = async (res, id) => {
    let token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true, 
        sameSite: "none", 
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
}

export default createTokenSetcookie;