import gql from 'graphql-tag';

// *** Local
export const CHECK_LOCAL_LOGIN = gql`
  {
    isLoggedIn @client
  }
`;

export const LOCAL_LOG_IN = gql`
  mutation logUserIn($email: String!) {
    logUserIn(email: $email) @client
  }
`;

export const LOCAL_LOG_OUT = gql`
  mutation logUserOut {
    logUserOut @client
  }
`;
// ***

export const CREATE_COMMENT = gql`
  mutation createComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      userId
      message
      tags
      createdAt
    }
  }
`;

export const DONE_STAGE = gql`
  {
    getTodaysTournament {
      stockInfo
      marketStat
      scores
    }
  }
`;

export const POST_RESULT = gql`
  mutation postTournamentResult(
    $eventDate: String!
    $rank: [String!]!
    $market: String!
    $userEmail: String
  ) {
    postTournamentResult(eventDate: $eventDate, rank: $rank, market: $market, userEmail: $userEmail)
  }
`;

export const FORUM_PAGE = gql`
  {
    getTodaysTournament {
      eventDate
      stockInfo
      marketStat
      scores
    }
    getAllComments {
      id
      message
      user {
        id
        name
      }
      tags
      tournament {
        eventDate
      }
      createdAt
    }
  }
`;

export const TOURNAMENT_PAGE = gql`
  {
    getTodaysTournament {
      stockInfo
      eventDate
    }
  }
`;

export const GET_EVENTDATE = gql`
  {
    getEventDate
  }
`;

export const CREATE_USER = gql`
  mutation createUser($email: String!, $resultIds: [Int]) {
    createUser(email: $email, resultIds: $resultIds) {
      id
      email
      name
      tournamentResults {
        rank
        tournament {
          eventDate
        }
      }
    }
  }
`;

export const GET_USER = gql`
  query getUser($email: String!) {
    getUser(email: $email) {
      id
      name
      email
      tournamentResults {
        id
        rank
        tournament {
          eventDate
        }
      }
    }
  }
`;

export const GET_TOURNAMENT_RESULTS = gql`
  query getTournamentResults($userEmail: String!) {
    getTournamentResults(userEmail: $userEmail) {
      id
      rank
      tournament {
        eventDate
      }
    }
  }
`;
