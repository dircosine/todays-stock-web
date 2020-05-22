export const defaults = {
  isLoggedIn: Boolean(localStorage.getItem('email')) || false,
};

export const resolvers = {
  Query: {
    isLoggedIn: () => Boolean(localStorage.getItem('email')) || false,
  },
  Mutation: {
    logUserIn: (_: any, { email }: any, { cache }: any) => {
      localStorage.setItem('email', email);
      cache.writeData({
        data: {
          isLoggedIn: true,
        },
      });
      return null;
    },
    logUserOut: (_: any, __: any, { cache }: any) => {
      localStorage.removeItem('email');
      return null;
    },
  },
};
