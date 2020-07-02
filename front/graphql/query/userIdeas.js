export default `
query userIdeas($userId: String!, $nextToken: String, $limit: Int) {
  userIdeas(userId: $userId, nextToken: $nextToken, limit: $limit) {
    items {
      ideaId
      shortId
      slug
      authorName
      strippedContent
      title
      createdDate
      ideaDate
      likesCount
      commentsCount
    }
    nextToken
  }
}`
