import jwt from "jsonwebtoken";

export const authMiddleware = async (req,res,next) => {
    try {
      const token = req.cookies.refreshToken || req.headers["authorization"].replace("Bearer ","");
      if(!token){
        return res.status(401).json({message:"Unauthorized"})
      }
      const decodedToken = await jwt.verify(token,process.env.JWT_REFRESH_TOKEN_SECRET)
      req.user = decodedToken;
      next();
    } catch (error) {
        return res.status(401).json({message:"Unauthorized"})
    }
}
