import gql from 'graphql-tag';

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
  mutation postTournamentResult($eventDate: String!, $rank: [String!]!, $market: String!) {
    postTournamentResult(eventDate: $eventDate, rank: $rank, market: $market)
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
