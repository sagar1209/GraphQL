import { prisma } from "..";
import Dataloader from "dataloader";
import { User } from "@prisma/client";

type BatchUser = (ids: number[]) => Promise<User[]>;

const batchusers: BatchUser = async (ids) => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  const userMap: { [key: string]: User } = {};

  users.forEach((user) => {
    userMap[user.id] = user;
  });

  return ids.map((id) => userMap[id]);
};

//@ts-ignorer
export const userLoader = new Dataloader<number, User>(batchusers);
