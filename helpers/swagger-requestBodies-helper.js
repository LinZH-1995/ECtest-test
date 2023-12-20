const requestBodies = {
  signUp: {
    description: '使用信箱與密碼與確認密碼註冊',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['email', 'password', 'checkPassword'],
          properties: {
            email: {
              type: 'string',
              description: '使用者的信箱'
            },
            password: {
              type: 'string',
              description: '使用者的密碼'
            },
            checkPassword: {
              type: 'string',
              description: '二次確認密碼'
            }
          }
        }
      }
    }
  },

  signIn: {
    description: '使用信箱與密碼登入',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              description: '使用者的信箱'
            },
            password: {
              type: 'string',
              description: '使用者的密碼'
            }
          }
        }
      }
    }
  },

  // Photos API
  postPhoto: {
    description: '新增相片',
    required: true,
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          required: ['albumId', 'description', 'image'],
          properties: {
            albumId: {
              type: 'integer',
              description: '相簿 ID'
            },
            description: {
              type: 'string',
              description: '相片描述'
            },
            image: {
              type: 'string',
              format: 'binary',
              description: '上傳的相片'
            }
          }
        }
      }
    }
  },

  putPhoto: {
    description: '修改相片',
    required: true,
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          required: ['albumId', 'description', 'image'],
          properties: {
            albumId: {
              type: 'integer',
              description: '相簿 ID'
            },
            description: {
              type: 'string',
              description: '相片描述'
            },
            image: {
              type: 'string',
              format: 'binary',
              description: '上傳的相片'
            }
          }
        }
      }
    }
  },

  // Albums API
  postAlbum: {
    description: '新增相簿',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              description: '相簿標題'
            }
          }
        }
      }
    }
  },

  putAlbum: {
    description: '修改相簿',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              description: '相簿標題'
            }
          }
        }
      }
    }
  }
}

module.exports = requestBodies
