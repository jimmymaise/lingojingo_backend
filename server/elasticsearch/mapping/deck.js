deck = {
  "mappings": {
    "_doc": {
      "dynamic":  false,
      "properties": {

        "deckName": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword"
            }
          },
          "analyzer": "deck_name_index_analyzer",
          "search_analyzer": "deck_name_search_analyzer"
        },
        "images": {
          "type": "keyword",
          "null_value": "NULL"
        },

        "topicExamQuestions": {
          "type": "keyword"
        },
        "reviewExamQuestions": {
          "type": "keyword"
        },
        "finalExamQuestions": {
          "type": "keyword",
          "null_value": "NULL"
        },
        "passScore": {
          "type": "keyword",
        }
      }
    }
  },
  "settings": {
    "index": {
      "analysis": {
        "analyzer": {
          "deck_name_index_analyzer": {
            "type": "custom",
            "tokenizer": "standard",
            "filter": ["lowercase", "standard", "deckName"]
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
          "deckName": {
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
  deck
}