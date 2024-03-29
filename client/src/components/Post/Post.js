import React from 'react';
import { gql, useMutation } from '@apollo/client';

import './Post.css';

const PUBLISH_POST = gql`
  mutation publishPost($postId: ID!) {
    postPublish(postId: $postId) {
      post {
        title
      }
    }
  }
`;

const UNPUBLISH_POST = gql`
  mutation unpublishPost($postId: ID!) {
    postUnpublish(postId: $postId) {
      post {
        title
      }
    }
  }
`;

export default function Post({
  title,
  content,
  date,
  user,
  published,
  id,
  isMyProfile,
}) {
  const [publishPost, { data, loading }] = useMutation(PUBLISH_POST);
  const [unpublishPost, { data: unpublishData, loading: unpublishLoading }] =
    useMutation(UNPUBLISH_POST);

  const formatedDate = new Date(Number(date));

  return (
    <div
      className="Post"
      style={published === false ? { backgroundColor: 'hotpink' } : {}}
    >
      {isMyProfile && published === false && (
        <p
          className="Post__publish"
          onClick={() => {
            publishPost({
              variables: {
                postId: id,
              },
            });
          }}
        >
          publish
        </p>
      )}
      {isMyProfile && published === true && (
        <p
          className="Post__publish"
          onClick={() => {
            unpublishPost({
              variables: {
                postId: id,
              },
            });
          }}
        >
          unpublish
        </p>
      )}
      <div className="Post__header-container">
        <h2>{title}</h2>
        <h4>
          Created At {`${formatedDate}`.split(' ').splice(0, 3).join(' ')} by{' '}
          {user}
        </h4>
      </div>
      <p>{content}</p>
    </div>
  );
}
