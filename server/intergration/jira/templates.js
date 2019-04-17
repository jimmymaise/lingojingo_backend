let bodyData = `{

  "fields": {
    "project": {
      "key": "{{projectKey}}"
    },
    "summary": "{{summary}}",
    "customfield_10031":"{{email}}",
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
      "name": "Duyet Mai"
    },
    "reporter": {
      "name": "Duyet Mai"
    }
  }
}`

exports.bodyData = bodyData;
