const schemas = {
  User: {
    // 定義資料型態
    type: 'object',
    // 定義必要屬性
    required: ['id', 'email', 'password', 'createdAt', 'updatedAt'],
    // 定義所有屬性
    properties: {
      id: {
        type: 'integer',
        description: '使用者的 ID'
      },
      email: {
        type: 'string',
        description: '使用者的信箱'
      },
      password: {
        type: 'string',
        description: '使用者的密碼'
      },
      createdAt: {
        type: 'string',
        description: '該筆資料建立的日期，由資料庫自動生成'
      },
      updatedAt: {
        type: 'string',
        description: '該筆資料最近更新的日期，由資料庫自動生成'
      }
    }
  },

  Album: {
    // 定義資料型態
    type: 'object',
    // 定義必要屬性
    required: ['id', 'userId', 'title', 'createdAt', 'updatedAt'],
    // 定義所有屬性
    properties: {
      id: {
        type: 'integer',
        description: '相簿的 ID'
      },
      userId: {
        type: 'integer',
        description: '相簿擁有者的 ID'
      },
      title: {
        type: 'string',
        description: '相簿的標題'
      },
      createdAt: {
        type: 'string',
        description: '該筆資料建立的日期，由資料庫自動生成'
      },
      updatedAt: {
        type: 'string',
        description: '該筆資料最近更新的日期，由資料庫自動生成'
      }
    }
  },

  Photo: {
    // 定義資料型態
    type: 'object',
    // 定義必要屬性
    required: ['id', 'albumId', 'description', 'image', 'createdAt', 'updatedAt'],
    // 定義所有屬性
    properties: {
      id: {
        type: 'integer',
        description: '相片的 ID'
      },
      albumId: {
        type: 'integer',
        description: '相片所在的相簿 ID'
      },
      description: {
        type: 'string',
        description: '相片的描述'
      },
      image: {
        type: 'string',
        description: '相片存儲位置路徑'
      },
      createdAt: {
        type: 'string',
        description: '該筆資料建立的日期，由資料庫自動生成'
      },
      updatedAt: {
        type: 'string',
        description: '該筆資料最近更新的日期，由資料庫自動生成'
      }
    }
  }
}

module.exports = schemas
