export default `
query getIdea($ideaId: String!) {
  getIdea(ideaId: $ideaId) {
    ideaId
    content
    title
    createdDate
    ideaDate
    comments {
      userId
      body
      commentId
    }
  }
}`
