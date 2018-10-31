userItem = {
  "mappings": {
    "_doc": {
      "dynamic": false,
      "properties": {

        "itemInfo": {
          "properties": {
            "name": {
              "type": "text",
              "fields": {
                "keyword": {
                  "type": "keyword"
                }
              },
              "analyzer": "nameIndexAnalyzer",
              "search_analyzer": "nameSearchAnalyzer"
            },
            "level": {
              "type": "keyword",
            },

          }
        },
        "itemId": {
          "type": "keyword",
        },
        "itemType": {
          "type": "keyword",
        },
        "userId": {
          "type": "keyword",
        },
        "favorite": {
          "type": "keyword",
        },
        "createdAt": {
          "type": "keyword",
        },
        "expiredAt": {
          "type": "keyword",
        },
      }
    }
  },
  "settings": {
    "index": {
      "analysis": {
        "analyzer": {
          "nameIndexAnalyzer": {
            "filter": [
              "lowercase"
            ],
            "tokenizer": "nameIndexTokenizer"
          },
          "nameSearchAnalyzer": {
            "filter": [
              "lowercase"
            ],
            "tokenizer": "nameSearchTokenizer"
          },
          "lowercaseAnalyzer": {
            "type": "custom",
            "tokenizer": "keyword",
            "filter": [
              "lowercase"
            ]
          }
        },
        "tokenizer": {
          "nameIndexTokenizer": {
            "token_chars": [
              "letter",
              "digit",
              "punctuation",
              "whitespace"
            ],
            "min_gram": "2",
            "type": "ngram",
            "max_gram": "3"
          },
          "nameSearchTokenizer": {
            "token_chars": [
              "letter",
              "digit",
              "punctuation"
            ],
            "min_gram": "2",
            "type": "ngram",
            "max_gram": "3"
          }
        },
        "normalizer": {
          "lowercaseNormalizer": {
            "type": "custom",
            "char_filter": [],
            "filter": ["lowercase"]
          }
        }
      }
    }
  }
}
module.exports = {
  userItem
}