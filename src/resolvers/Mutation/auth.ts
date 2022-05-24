import { Context } from '../../index';
import validator from 'validator';
import bcrypt, { hash } from 'bcryptjs';

interface SignupArgs {
  email: string;
  name: string;
  password: string;
  bio: string;
}

interface UserPayload {
  userErrors: {
    message: string;
  }[];
  user: null;
}

export const authResolvers = {
  signup: async (
    parent: any,
    { email, name, password, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const isEmail = validator.isEmail(email);

    if (!isEmail) {
      return {
        userErrors: [
          {
            message: 'Invalid email.',
          },
        ],
        user: null,
      };
    }

    const isValidPassword = validator.isLength(password, {
      min: 5,
    });

    if (!isValidPassword) {
      return {
        userErrors: [
          {
            message: 'Password must be at least 5 characters long.',
          },
        ],
        user: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: 'Missing name or bio.',
          },
        ],
        user: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return {
      userErrors: [],
      user: null,
    };
  },
};
