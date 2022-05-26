import { Context } from '../index';

interface ProfileparentType {
  id: number;
  bio: string;
  userId: number;
}

export const Profile = {
  user: (parent: ProfileparentType, args: any, { prisma }: Context) => {
    return prisma.user.findUnique({
      where: {
        id: parent.userId,
      },
    });
  },
};
