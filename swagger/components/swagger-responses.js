const responses = {
  // 200 狀態碼的響應
  200: {
    GeneralRes: {
      contenets: 'application/json',
      description: "status: '請求成功(success)', data: '請求的資料'"
    }

  },
  // 400 狀態碼的響應
  400: {
    contenets: 'application/json',
    description: '請求中的值無效或格式錯誤'
  },
  // 401 狀態碼的響應
  401: {
    contenets: 'application/json',
    description: 'Unauthorized - token 的值無效或格式錯誤'
  }
}

module.exports = responses
