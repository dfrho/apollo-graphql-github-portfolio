import React from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_CURRENT_USER = gql`
{
  viewer {
    login
    name
  }
}
`;

const Profile = () => {
  return (
    <Query query={GET_CURRENT_USER}>
      {({ data, loading }) => {
        const { viewer } = data || { viewer: null };

        if (loading || !viewer) {
          return <p>no viewer dude</p>;
        }

        return (
          <div>
            {viewer.name} {viewer.login}
          </div>
        )
      }}
    </Query>
  )
}

export default Profile;
