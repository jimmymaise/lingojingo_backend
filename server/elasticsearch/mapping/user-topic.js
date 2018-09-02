userTopic = {
  "mappings": {
    "_doc": {
      "properties": {
        // "_id": {
        //   "type": "keyword"
        // },
        "userId": {
          "type": "keyword"
        },
        "topicId": {
          "type": "keyword",
          "null_value": "NULL"
        },
        "topicType": {
          "type": "keyword",
          "null_value": "NULL"
        },
        "deckId": {
          "type": "keyword"
        },
        "exams": {
          "type": "keyword"
        },
        "highestResult": {
          "properties": {
            "examId": {
              "type": "keyword"
            },
            "score": {
              "type": "keyword"
            },
            "result": {
              "type": "keyword"
            },
            "timeSpent": {
              "type": "keyword"
            },
            "totalQuestions": {
              "type": "keyword"
            },

          },

        }
      }
    }
  }
  ,
  "settings": {
    "index": {
      "analysis": {
        "analyzer": {
          "deck_name_index_analyzer": {
            "type": "custom",
            "tokenizer": "standard",
            "filter": ["lowercase", "standard", "deck_name"]
          },
          "deck_name_search_analyzer": {
            "type": "custom",
            "tokenizer": "standard",
            "filter": ["lowercase", "standard"]
          },
          "lowercase_analyzer": {
            "type": "custom",
            "tokenizer": "keyword",
            "filter": [
              "lowercase"
            ]
          }
        },
        "normalizer": {
          "lowercase_normalizer": {
            "type": "custom",
            "char_filter": [],
            "filter": ["lowercase"]
          }
        },
        "filter": {
          "deck_name": {
            "type": "nGram",
            "min_gram": "1",
            "max_gram": "100"
          }
        }
      }
    }
  }

}

module.exports = {
  userTopic
}