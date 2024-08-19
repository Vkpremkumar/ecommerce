const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization")
    const authToken = authHeader.replace('Bearer ', '').trim();
    // console.log(`Authtoken :`,authToken);
    if (!authToken) {
        return res.status(401).json({ message: `Token is required..` })
    }
    // if(authToken){
    // const token = authHeader.split(" ")[1];
    // console.log(`Token :`,authToken)

    jwt.verify(authToken, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
            return res.status(403).json({ message: `Token is invalid` })
        }
        console.log("Decoded token : ", decode)

        req.id = decode.userId;
        req.username = decode.username;
        req.role = decode.role
        // console.log(`User is :`,req.user);

        // checks if the registered user role as Admin

        if (req.id === req.params.id || req.role === "Admin" || req.role === "Super Admin") {
            next();
        } else {
            return res.status(401).json({ message: `Unauthorized user` });
        }

    })
    // }else{
    // return res.status(401).json({message:`You are not authenticated`})
    // }
}

// this function is for admin user only
// const verifyTokenAndAuthorization = (req,res,next)=>{
//     verifyToken(req,res,()=>{
//         if(req.id === req.params.id && req.role === "Admin"){
//             // console.log(`User Id :`,req.user.id);
//             // console.log(`Params Id :`,req.params.id);
//             console.log(`Admin :`,req.role);

//             next();
//         }else{
//             return res.status(401).json({message:`You are not allowed to do that!..`})
//         }
//     });
// }

module.exports = { verifyToken };