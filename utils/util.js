const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatYear = date => {
  const year = date.getFullYear()
  return year
}

const formatMonth = date => {
  const month = date.getMonth() + 1
  return month
}

const formatDay = date => {
  const day = date.getDate()
  return day
}

const formatHour = date => {
  const hour = date.getHours()
  return hour
}

const formatMinute = date => {
  const minute = date.getMinutes()
  return minute
}

const formatSecond = date => {
  const second = date.getSeconds()
  return second
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatYear: formatYear,
  formatMonth: formatMonth,
  formatDay: formatDay,
  formatHour: formatHour,
  formatMinute: formatMinute,
  formatSecond: formatSecond
}