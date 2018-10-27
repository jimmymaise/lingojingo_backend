let bodyData = `{

  "fields": {
    "project": {
      "key": "{{projectKey}}"
    },
    "summary": "{{summary}}",
    "customfield_10046":{"value": "{{email}}"},
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Mô tả lỗi: {{description}} "
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Mong đợi: {{expected}}"
            }
          ]
        }
      ]
    }, "issuetype": {
      "name": "Bug"
    },
    "assignee": {
      "name": "theduyet"
    },
    "reporter": {
      "name": "theduyet"
    }
  }
}`

exports.bodyData = bodyData;
