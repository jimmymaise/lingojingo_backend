article = {
  "mappings": {
    "_doc": {
      "dynamic": false,
      "properties": {

        "title": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword"
            }
          },
          "analyzer": "articleNameIndexAnalyzer",
          "search_analyzer": "articleNameSearchAnalyzer"
        },

        "author": {
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
          "articleNameIndexAnalyzer": {
            "filter": [
              "lowercase"
            ],
            "tokenizer": "articleNameIndexTokenizer"
          },
          "articleNameSearchAnalyzer": {
            "filter": [
              "lowercase"
            ],
            "tokenizer": "articleNameSearchTokenizer"
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
          "articleNameIndexTokenizer": {
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
          "articleNameSearchTokenizer": {
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