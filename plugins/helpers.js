
const regexp = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/,
  pwd: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/
}

const uuid = (string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx') => {
  string = string.replace('y', (Math.floor(Math.random() * 4) + 8).toString(16))
  while (string.includes('x')) {
    const x = Math.floor(Math.random() * 16).toString(16)
    string = string.replace('x', x)
  }
  return string
}

const $sanitize = string => {
  string = string.replace(/&/g, '&amp;')
  string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  string = string.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  return string
}

const datetimeToFormatString = (date, format = 'yyyy/M/d H:mm') => {
  format = format.replace(/yyyy/g, date.getFullYear())
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2))
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2))
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3))
  format = format.replace(/M/g, (date.getMonth() + 1))
  format = format.replace(/d/g, (date.getDate()))
  format = format.replace(/H/g, (date.getHours()))
  format = format.replace(/m/g, (date.getMinutes()))
  format = format.replace(/s/g, (date.getSeconds()))
  format = format.replace(/S/g, (date.getMilliseconds()))
  return format
}

const datetimeToRelativeTimeString = date => {
  const sec1Year = 365 * 24 * 60 * 60 * 1000
  const sec1Day = 24 * 60 * 60 * 1000
  const sec1Hour = 60 * 60 * 1000
  const sec1Min = 60 * 1000
  const diff = new Date().getTime() - date.getTime()
  return diff > sec1Year ? `${Math.floor(diff / sec1Year)}年前`
    : diff > sec1Day ? `${Math.floor(diff / sec1Day)}日前`
      : diff > sec1Hour ? `${Math.floor(diff / sec1Hour)}時間前`
        : diff > sec1Min ? `${Math.floor(diff / sec1Min)}分前`
          : '今'
}

export default (context, inject) => {

  inject('timestring', {
    $format: datetimeToFormatString,
    $relative: datetimeToRelativeTimeString
  })
  inject('html', {
    $sanitize
  })

  // エラー処理
  inject('throw', context.error)
  // 正規表現
  inject('regexp', regexp)
  // uuid作成
  inject('uuid', uuid)
}
