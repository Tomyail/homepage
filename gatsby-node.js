const _ = require('lodash');
const Promise = require('bluebird');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js');
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              limit: 1000
            ) {
              edges {
                node {
                  frontmatter {
                    title
                    path
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges;

        _.each(posts, (post, index) => {
          const previous =
            index === posts.length - 1 ? false : posts[index + 1].node;
          const next = index === 0 ? false : posts[index - 1].node;

          createPage({
            path: post.node.frontmatter.path,
            component: blogPost,
            context: {
              index,
              previous,
              next
            }
          });
        });
      })
    );
  });
};

// exports.onCreateNode = ({ node, boundActionCreators, getNode, graphql }) => {
//   const { createNodeField } = boundActionCreators;

//   if (node.internal.type === `MarkdownRemark`) {
//     const value = createFilePath({ node, getNode });
//     console.log('onCreateNode', value);
//     createNodeField({
//       name: `slug`,
//       node,
//       value
//     });
//   }
// };
