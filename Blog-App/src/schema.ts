import {gql} from "apollo-server"

export const typeDefs = gql`
  type Query {
     me: User
     profile(userId: ID!): Profile
     posts: [Post!]!
  }

  type Mutation {
    postCreate(post: PostInput!): PostPayload
    postUpdate(postId: ID!,post: PostInput!) : PostPayload!
    postDelete(postId: ID!): PostPayload
    postPublish(postId: ID!): PostPayload
    postUnpublish(postId: ID!): PostPayload
    signUp(credentials: CredentialsInput, name: String,bio: String): AuthPayLoad
    signin(credentials: CredentialsInput) : AuthPayLoad
  }

  type Post{
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type User{
    id:ID!
    name: String!
    email: String!
    posts: [Post!]!
  }
   type Profile{
     id:ID!
     isMyprofile: Boolean!
     bio: String!
     user: User!
   }
   type UserError{
     message: String!
   }
   type PostPayload{
       userErrors: [UserError]!
       post: Post
   }

   type AuthPayLoad{
     userErrors: [UserError]!
     token: String
   }
   input PostInput{
     title: String
     content: String
   }
   input CredentialsInput{
      email: String!
      password: String!
   }



`;
