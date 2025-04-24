import prisma from "../db";
import { comparePassword, createJWT, hashPassword } from "../modules/auth";
import { NextFunction, Request, Response } from "express";

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create user in the database
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Generate token
    const token = createJWT(user);

    res.status(201).json({ token }); // No return needed
  } catch (error: any) {
    if (error.code === "P2002") {
      // Prisma unique constraint error
      res.status(409).json({ message: "Username already exists" });
      return;
    }

    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
};
