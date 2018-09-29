song = {
  "mappings": {
    "_doc": {
      "dynamic": false,
      "properties": {

        "songName": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword"
            }
          },
          "analyzer": "songNameIndexAnalyzer",
          "search_analyzer": "songNameSearchAnalyzer"
        },
        "cards": {
          "type": "array",
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
          "songNameIndexAnalyzer": {
            "filter": [
              "lowercase"
            ],
            "tokenizer": "songNameIndexTokenizer"
          },
          "songNameSearchAnalyzer": {
            "filter": [
              "lowercase"
            ],
            "tokenizer": "songNameSearchTokenizer"
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
          "songNameIndexTokenizer": {
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
          "songNameSearchTokenizer": {
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