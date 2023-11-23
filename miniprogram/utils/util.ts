export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

export function loginToServer(code: string) {
  wx.request({
    url: 'http://43.138.26.196:8000/user/login',
    method: 'POST',
    data: {
      code: code
    },
    success(res) {
      console.log(res);
    },
    fail(err) {
      console.error(err);
    }
  });
}