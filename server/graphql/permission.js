const {rule, shield, and, or, not} = require('graphql-shield')

const isAdmin = rule()(async (parent, args, ctx, info) => {
  let credentials = ctx.request.auth.credentials
  let claims = credentials.claims
  if (!(claims && claims.groups.length)) {
    let setClaimToFireBase = require('../utils/general').setClaimToFireBase
    claims = await setClaimToFireBase(credentials.user_id)
  }
  return (claims.groups||[]).includes('ADMIN')
})

const permissions = shield({
  Mutation: {
    createOneCard: isAdmin,
    deleteOneCard: isAdmin,
    updateOneCard: isAdmin,

    createOneDeck: isAdmin,
    deleteOneDeck: isAdmin,
    updateOneDeck: isAdmin,

    createOneTopic: isAdmin,
    deleteOneTopic: isAdmin,
    updateOneTopic: isAdmin,

  },
})


module.exports = {
  permissions,
}