import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import Link from '../../Link';
import Button from '../../Button'

import '../style.css';

const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
} }
`;

const UNSTAR_REPOSITORY = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
} }
`;

const WATCH_REPOSITORY = gql`
  mutation($id: ID!, $viewerSubscription: SubscriptionState!) {
    updateSubscription(
      input: { state: $viewerSubscription, subscribableId: $id }
    ) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
};

const isWatch = viewerSubscription =>
  viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

const RepositoryItem = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred,
}) => (
    <div>
      <div className="RepositoryItem-title">
        <h2>
          <Link href={url}>{name}</Link>
        </h2>

        <div className="RepositoryItem-title-action">
          {stargazers.totalCount} Stars
      </div>
        <div>
          <Mutation
            mutation={WATCH_REPOSITORY}
            variables={{
              id,
              viewerSubscription: isWatch(viewerSubscription)
                ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
            }}
          >
            {(updateSubscription, { data, loading, error }) => (
              <Button
                className="RepositoryItem-title-action"
                data-test-id="updateSubscription"
                onClick={updateSubscription}
              >
                {watchers.totalCount}{' '}
                {isWatch(viewerSubscription) ? 'Unwatch' : 'Watch'}
              </Button>
            )}
          </Mutation>

          {!viewerHasStarred ? (
            <Mutation mutation={STAR_REPOSITORY} variables={{ id }}>
              {(addStar, { data, loading, error }) => (
                <Button
                  className={'RepositoryItem-title-action-add'}
                  onClick={addStar}
                >
                  {stargazers.totalCount} Stars
              </Button>
              )}
            </Mutation>
          ) : (
              <Mutation mutation={UNSTAR_REPOSITORY} variables={{ id }}>
                {(removeStar, { data, loading, error }) => (
                  <Button
                    className={'RepositoryItem-title-action-remove'}
                    onClick={removeStar}
                  >
                    {stargazers.totalCount} Star{stargazers.totalCount !== 1 ? 's' : ''}
                  </Button>
                )}
              </Mutation>
            )}
          {/* Here comes your updateSubscription mutation */}
        </div>
      </div>

      <div className="RepositoryItem-description">
        <div
          className="RepositoryItem-description-info"
          dangerouslySetInnerHTML={{ __html: descriptionHTML }}
        />
        <div className="RepositoryItem-description-details">
          <div>
            {primaryLanguage && (
              <span>Language: {primaryLanguage.name}</span>
            )}
          </div>
          <div>
            {owner && (
              <span>
                Owner: <a href={owner.url}>{owner.login}</a>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

export default RepositoryItem;
