import validator from 'validator';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

import { Context } from '../../index';
import { JWT_SIGNATURE } from '../keys';

interface SignupArgs {
  credentials: {
    email: string;
    password: string;
  };
  name: string;
  bio: string;
}

interface SigninArgs {
  credentials: {
    email: string;
    password: string;
  };
}

interface UserPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    parent: any,
    { credentials: { email, password }, name, bio }: SignupArgs,
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
        token: null,
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
        token: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: 'Missing name or bio.',
          },
        ],
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    await prisma.profile.create({
      data: {
        bio,
        userId: user.id,
      },
    });

    return {
      userErrors: [],
      token: JWT.sign(
        {
          userId: user.id,
        },
        JWT_SIGNATURE,
        { expiresIn: 3600000 }
      ),
    };
  },

  signin: async (
    parent: any,
    { credentials: { email, password } }: SigninArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        userErrors: [
          {
            message: 'Invalid credentials.',
          },
        ],
        token: null,
      };
    }

    const passwordIsMatch = bcrypt.compare(password, user.password);

    if (!passwordIsMatch) {
      return {
        userErrors: [
          {
            message: 'Invalid credentials.',
          },
        ],
        token: null,
      };
    }

    return {
      userErrors: [],
      token: JWT.sign(
        {
          userId: user.id,
        },
        JWT_SIGNATURE,
        { expiresIn: 3600000 }
      ),
    };
  },
};
