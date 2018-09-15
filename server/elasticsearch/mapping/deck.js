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
          "analyzer": "deckNameIndexAnalyzer",
          "search_analyzer": "deckNameSearchAnalyzer"
        },
        "img": {
          "type": "keyword",
          "null_value": "NULL"
        },
        "categoryId": {
          "type": "keyword",
          "null_value": "NULL"
        },
        "category": {
          "properties": {
            "name": {
              "type": "keyword",
            },
            "_id": {
              "type": "keyword",
            }

          }
        }
        ,

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
          "deckNameIndexAnalyzer": {
            "filter": [
              "lowercase"
            ],
            "tokenizer": "deckNameIndexTokenizer"
          },
          "deckNameSearchAnalyzer": {
            "filter": [
              "lowercase"
            ],
            "tokenizer": "deckNameSearchTokenizer"
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
          "deckNameIndexTokenizer": {
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
          "deckNameSearchTokenizer": {
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
  deck
}