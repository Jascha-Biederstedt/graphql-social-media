import { Context } from '../index';

export const Query = {
  me: (parent: any, args: any, { prisma, userInfo }: Context) => {
    if (!userInfo) return null;

    return prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });
  },

  posts: (parent: any, args: any, { prisma }: Context) => {
    return prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
  },

  profile: (
    parent: any,
    { userId }: { userId: string },
    { prisma }: Context
  ) => {
    return prisma.profile.findMany({
      where: {
        userId: Number(userId),
      },
    });
  },
};
