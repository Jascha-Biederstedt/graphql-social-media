import { Post, Prisma } from '@prisma/client';

import { Context } from '../../index';

interface PostCreateArgs {
  post: { title: string; content: string };
}

interface PostUpdateArgs {
  postId: string;
  post: {
    title?: string;
    content?: string;
  };
}

interface PostDeleteArgs {
  postId: string;
}

interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postResolvers = {
  postCreate: async (
    parent: any,
    { post: { title, content } }: PostCreateArgs,
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: 'You must provide a title and content to create a post.',
          },
        ],
        post: null,
      };
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: 1,
      },
    });

    return {
      userErrors: [],
      post,
    };
  },

  postUpdate: async (
    parent: any,
    { postId, post: { title, content } }: PostUpdateArgs,
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    if (!title && !content) {
      return {
        userErrors: [
          {
            message: 'Need to have at least one field to update.',
          },
        ],
        post: null,
      };
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: 'Post does not exist.',
          },
        ],
        post: null,
      };
    }

    let payloadToUpdate = {
      title,
      content,
    };

    if (!title) delete payloadToUpdate.title;
    if (!content) delete payloadToUpdate.content;

    return {
      userErrors: [],
      post: await prisma.post.update({
        data: {
          ...payloadToUpdate,
        },
        where: {
          id: Number(postId),
        },
      }),
    };
  },

  postDelete: async (
    parent: any,
    { postId }: PostDeleteArgs,
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: 'Post does not exist.',
          },
        ],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: await prisma.post.delete({
        where: {
          id: Number(postId),
        },
      }),
    };
  },
};
