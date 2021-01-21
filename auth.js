const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try{
        const token = req.header("x-auth-token");
        if(!token){
            return res.status(401).json({msg: "No auth token, authorization denied"});
        }
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        if(!verified){
            return res.status(402).json({msg: "Token verification failed, auth denied"})
        }
        req.user = verified.id;
        next();
    } catch (err){
        console.log(err);
    }
}

module.exports = auth;