const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const gql = require('graphql');
const rootSchema = require('../../schema');

describe('Post object type', function() {
  describe('Query', function() {
    it('should return list of posts', function() {
      const query = `
        query {
          posts {
            title
            content
          }
        }
      `;
      const expected = {
        data: {
          posts: [
            { title: 'Some post', content: 'Some content' },
            { title: 'Another post', content: 'Some other content' }
          ]
        }
      };
      const getPostsStub = sinon.stub(
        rootSchema._queryType._fields.posts,
        'resolve'
      );

      getPostsStub.returns([
        { title: 'Some post', content: 'Some content' },
        { title: 'Another post', content: 'Some other content' }
      ]);

      return gql.graphql(rootSchema, query).then(function(result) {
        expect(result).to.deep.equal(expected);
        getPostsStub.restore();
      });
    });
  });

  describe('Mutation', function() {
    it('should return the newly created post', function() {
      const query = `
        mutation {
          createPost(title: "some title" content: "some content") {
            title
            content
          }
        }
      `;
      const expected = {
        data: {
          createPost: { title: 'Some post', content: 'Some content' }
        }
      };
      const createPostStub = sinon.stub(
        rootSchema._mutationType._fields.createPost,
        'resolve'
      );

      createPostStub.returns({
        title: 'Some post',
        content: 'Some content'
      });

      return gql.graphql(rootSchema, query).then(function(result) {
        expect(result).to.deep.equal(expected);
        createPostStub.restore();
      });
    });

    it('should call mutation method with args', function() {
      const query = `
        mutation {
          createPost(title: "some title" content: "some content") {
            title
            content
          }
        }
      `;
      const getPostsMock = sinon.mock(
        rootSchema._mutationType._fields.createPost
      );
      
      getPostsMock.expects('resolve').once().withArgs(undefined, {
        title: 'some title',
        content: 'some content'
      });
      
      return gql.graphql(rootSchema, query).then(function(result) {
        getPostsMock.verify();
      });
    });
  });
});
