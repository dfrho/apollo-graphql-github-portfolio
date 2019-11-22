import React, { Fragment } from 'react';
import Loading from '../../Loading';
import RepositoryItem from '../RepositoryItem';
import FetchMore from '../../FetchMore';
import '../style.css';

const updateQuery = (previousResult, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return previousResult;
  }
  return {
    ...previousResult,
    viewer: {
      ...previousResult.viewer,
      repositories: {
        ...previousResult.viewer.repositories,
        ...fetchMoreResult.viewer.repositories,
        edges: [
          ...previousResult.viewer.repositories.edges,
          ...fetchMoreResult.viewer.repositories.edges,
        ],
      },
    },
  };
};

const RepositoryList = ({ repositories, fetchMore, loading }) => (
  <Fragment>
    {repositories.edges.map(({ node }) => (
      <div key={node.id} className="RepositoryItem">
        <RepositoryItem {...node} />
      </div>
    ))}

    <FetchMore
      loading={loading}
      hasNextPage={repositories.pageInfo.hasNextPage}
      variables={{
        cursor: repositories.pageInfo.endCursor,
      }}
      updateQuery={updateQuery}
      fetchMore={fetchMore}
    >
      Repositories
    </FetchMore>

    {loading ? (
      <Loading />
    ) : (
        repositories.pageInfo.hasNextPage && (
          <button
            type="button"
            onClick={() =>
              fetchMore({
                variables: {
                  cursor: repositories.pageInfo.endCursor,
                },
                updateQuery,
              })}

          >
            More Repositories
</button>)
      )}

  </Fragment>
)

export default RepositoryList;
