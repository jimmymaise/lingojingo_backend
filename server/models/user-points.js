// This collection is a view

//  Create from table "reward_history");
//   var pipeline = [
//     {
//       "$lookup": {
//         "from": "reward_point",
//         "localField": "type",
//         "foreignField": "type",
//         "as": "reward_point_table"
//       }
//     },
//     {
//       "$unwind": {
//         "path": "$reward_point_table",
//         "includeArrayIndex": "arrayIndex",
//         "preserveNullAndEmptyArrays": false
//       }
//     },
//     {
//       "$group": {
//         "_id": "$userId",
//         "point": {
//           "$sum": "$reward_point_table.point"
//         }
//       }
//     }
//   ];
//
'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class User_Point extends MongoModels {
};

User_Point.collectionName = 'user_points';

User_Point.schema = Joi.object().keys({
  _id: Joi.string(),
  point: Joi.number(),
}).options({stripUnknown: true});


module.exports = User_Point;