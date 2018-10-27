song = {
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

        "img": {
          "type": "keyword",
          "null_value": "NULL"
        },

        "link": {
          "type": "keyword",
        },
        "youtubeId": {
          "type": "keyword",
        },
        "songLevel": {
          "type": "keyword",
        },
        "cardTotal": {
          "type": "keyword",
        },
        "duration": {
          "type": "keyword",
        },
        "listLyric": {
          "properties": {

            "number": {
              "type": "keyword"
            },
            "timeStart": {
              "type": "keyword"
            },
            "timeEnd": {
              "type": "keyword"
            },
            "strLyricEn": {
              "type": "keyword"
            },
            "strLyricVi": {
              "type": "keyword"
            },
          }
        },
        "bandSingerId": {
          "type": "keyword",
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
  song
}