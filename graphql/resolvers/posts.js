const Post = require("../../model/Post");
const checkAuth = require("../../utils/checkAuth");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },

    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) return post;
        else throw new Error("Post not found");
      } catch (error) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createAt: new Date().toDateString(),
      });

      const post = await newPost.save();

      return post;
    },
  },
};
