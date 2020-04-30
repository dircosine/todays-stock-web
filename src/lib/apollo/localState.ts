export const defaults = {
  isLoggedIn: Boolean(localStorage.getItem('token')) || false,
};

export const resolvers = {
  Query: {
    isLoggedIn: () => Boolean(localStorage.getItem('token')) || false,
  },
  Mutation: {
    logUserIn: (_: any, { token }: any, { cache }: any) => {
      localStorage.setItem('token', token);
      cache.writeData({
        data: {
          isLoggedIn: true,
        },
      });
      return null;
    },
    logUserOut: (_: any, __: any, { cache }: any) => {
      localStorage.removeItem('token');
      return null;
    },
  },
};
