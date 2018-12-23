const { rule, shield, and, or, not }  = require('graphql-shield')

const isAdmin = rule()(async (parent, args, ctx, info) => {
    return true
})
console.log(isAdmin)
const permissions = shield({
    Mutation: {
        createOneCard: isAdmin,
    },
})


module.exports = {
    permissions,
}