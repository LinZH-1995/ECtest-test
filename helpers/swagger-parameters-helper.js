const parameters = {
  // userId
  userId_path: {
    in: 'path',
    name: 'id',
    required: true,
    description: '使用者的 ID',
    schema: { type: 'integer' }
  },

  userId_query: {
    in: 'query',
    name: 'userId',
    required: true,
    description: '使用者的 ID',
    schema: { type: 'integer' }
  },

  // albumId
  albumId_path: {
    in: 'path',
    name: 'id',
    required: true,
    description: '相簿的 ID',
    schema: { type: 'integer' }
  },

  albumId_query: {
    in: 'query',
    name: 'albumId',
    required: true,
    description: '相簿的 ID',
    schema: { type: 'integer' }
  },

  // photoId
  photoId_path: {
    in: 'path',
    name: 'id',
    required: true,
    description: '相片的 ID',
    schema: { type: 'integer' }
  },

  photoId_query: {
    in: 'query',
    name: 'photoId',
    required: true,
    description: '相片的 ID',
    schema: { type: 'integer' }
  }
}

module.exports = parameters
