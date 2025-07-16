import jwt from "jsonwebtoken";

const createTokenSetcookie = async (res, id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true, // Must be true for Netlify
        sameSite: 'none', // Required for cross-site cookies
        domain: 'studyhub2.netlify.app', //  Netlify domain
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
    });
    
    return token;
}

export default createTokenSetcookie;