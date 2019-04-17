let bodyData = `{

  "fields": {
    "project": {
      "key": "{{projectKey}}"
    },
    "summary": "{{summary}}",
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
        }, {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "Email: {{email}} "
            }
          ]
        }

      ]
    }, "issuetype": {
      "name": "Bug"
    },
    "assignee": {
      "name": "phat"
    }
  }
}`

exports.bodyData = bodyData;
