import { Context } from '../../index';

interface SignupArgs {
  email: string;
  name: string;
  password: string;
  bio: string;
}

export const authResolvers = {
  signup: (
    parent: any,
    { email, name, password, bio }: SignupArgs,
    { prisma }: Context
  ) => {},
};
