import { Context } from '../index';

export const Query = {
  me: async (parent: any, args: any, { prisma, userInfo }: Context) => {
    if (!userInfo) return null;

    return await prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });
  },

  posts: (parent: any, args: any, { prisma }: Context) => {
    return prisma.post.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
  },
};
