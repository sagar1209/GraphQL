import { Context } from "..";

interface userParentType {
  id: number;
}

export const User = {
  posts: (parent: userParentType, __: any, { userInfo, prisma }: Context) => {
    const isOwnprofile = parent.id === userInfo?.userId;
    if (isOwnprofile) {
      return prisma.post.findMany({
        where: {
          authorId: parent.id,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    } else {
      return prisma.post.findMany({
        where: {
          authorId: parent.id,
          published: true,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ], 
      });
    }
  },
};
