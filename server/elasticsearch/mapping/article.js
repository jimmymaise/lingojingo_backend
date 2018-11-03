article = {
  "mappings": {
    "_doc": {
      "dynamic": false,
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

        "author": {
          "type": "keyword",
          "null_value": "NULL"
        },
        "mainLevel": {
          "type": "keyword",
          "null_value": "NULL"
        },
        "publicationYear": {
          "type": "keyword",
        },
        "grade": {
          "type": "keyword",
        },
        "genre": {
          "type": "keyword",
        },
        "permissionsLine": {
          "type": "keyword",
        },
        "image": {
          "type": "keyword",
        },
        "id": {
          "type": "keyword",
        },

        "description": {
          "type": "keyword",
        },
        "language": {
          "type": "keyword",
        }
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
  article
}