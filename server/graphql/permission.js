const {rule, shield, and, or, not} = require('graphql-shield')

const isAdmin = rule()(async (parent, args, ctx, info) => {
  let credentials = ctx.request.auth.credentials
  let claims = await getClaims(credentials)
  return (claims.groups || []).includes('ADMIN')
})

async function getClaims(credentials) {
  let claims = credentials.claims
  if (!(claims && claims.groups.length)) {
    let setClaimToFireBase = require('../utils/general').setClaimToFireBase
    return await setClaimToFireBase(credentials.user_id)
  }
  return claims
}

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
  getClaims
}
