const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
    Query: {
      me: async (parent, args) => {
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id }).select(
            "-__v -password"
          );
          return userData;
        }
        throw new AuthenticationError('You Are Not Logged In');
      },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
          const user = await User.findOne({ email });
    
          if (!user) {
            throw new AuthenticationError('Incorrect credentials. Try Again!');
          }
    
          const correctPw = await user.isCorrectPassword(password);
          if (!correctPw) {
            throw new AuthenticationError('Incorrect credentials. Try Again!');
          }
        addUser: async (parent, args) => {
          if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user},
              { $addToSet: { savedBooks: args.input } },
              { new: true, runValidators: true }
            );
    
            return updatedUser;
          }
    
          throw new AuthenticationError('You Must Be Logged In!');
        },
        removeBook: async (parent, args) => {
          if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id},
              { $pull: { savedBooks: { bookId: bookId } } },
              { new: true }
            );
    
            return updatedUser;
          }
    
          throw new AuthenticationError('You Must Be Logged In');
        },
      },
    };
    
    module.exports = resolvers;