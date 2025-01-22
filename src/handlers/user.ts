import prisma from "../db";
import { comparePassword, createJWT, hashPassword } from "../modules/auth";
import { Request, Response } from "express";

export const createNewUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    res.json({ message: "Username and password are required" });
    return;
  }

  const user = await prisma.user.create({
    data: {
      username,
      password: await hashPassword(password),
    },
  });

  const token = createJWT(user);

  res.json({ token });
}

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    res.json({ message: "Username and password are required" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  const isValid = await comparePassword(req.body.password, user!.password);

  if (!isValid) {
    res.status(401);
    res.send("Invalid username or password");
    return;
  }

  const token = createJWT(user);

  res.json({ token });

}
