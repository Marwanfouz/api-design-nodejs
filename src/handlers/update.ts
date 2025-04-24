import prisma from "../db";
import { Request, Response } from "express";

// Get Updates
export const getUpdates = async (req: Request, res: Response) => {
  // const update = prisma.product.findUnique({
  //   where: {
  //     id: req.body.id,
  //   },
  //   include: {
  //     updates: true,
  //   },
  // });
  // res.json({ data: update });

  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce<any[]>((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  res.json({ data: updates });
};
// Get one update
export const getOneUpdate = async (req: Request, res: Response) => {
  const update = await prisma.update.findFirst({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: update });
};

export const createUpdate = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
    },
  });

  if (!product) {
    res.json({ message: "nope" });
    return;
  }

  const update = await prisma.update.create({
    data: {
      product: { connect: { id: product.id } },
      title: req.body.title,
      body: req.body.body,
      status: req.body.status,
      version: req.body.version,
      asset: req.body.asset,
    },
  });

  res.json({ data: update });
};

export const updateUpdate = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const update = products.reduce<any[]>((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  const match = update.find((update) => update.id === req.params.id);

  if (!match) {
    res.json({ message: "nope" });
    return;
  }

  const updatedUpdate = await prisma.update.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  res.json({ data: updatedUpdate });
};

export const deleteUpdate = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const update = products.reduce<any[]>((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  const match = update.find((update) => update.id === req.params.id);

  if (!match) {
    res.json({ message: "nope" });
    return;
  }

  const deletedUpdate = await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: deletedUpdate });
};
