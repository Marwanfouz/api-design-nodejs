import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import bcrypt from "bcrypt";

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(5);
  const hash = await bcrypt.hash(password, salt);
  return hash
}

export const comparePassword = async (password: string, hash: string) => {
  const result = await bcrypt.compare(password, hash);
  return result
}

export const createJWT = (user: any) => {
  const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET!);
  return token
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if(!bearer) {
    res.status(401)
    res.json({message: "Unauthorized"})
    return
  }

  const [_, token] = bearer.split(' ');

  if (!token) {
    res.status(401)
    res.json({message: "Unauthorized"})
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = payload
    next()
  } catch (error) {
    console.log(error)
    res.status(401)
    res.json({message: "Unauthorized"})
  }


}