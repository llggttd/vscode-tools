
/**
 * 0-0000000 00000000 00000000 00000000 00000000 00-00000-0 0000-0000 00000000
 * 1bit符号位-41bit时间戳-5bit数据中心ID-5位工作机器ID-12bit序列号
 * 
 * 目前javascript中int类型只能支持到2^53-1，所以这里进行简化
 * 00000 00000000 00000000 00000000 00000000 0000-000-0 00000000
 * 41bit时间戳-3bit工作机器ID-9bit序列号
 */

/**
 * 起始时间 2020-01-01 08:00:00
 */
const TWEPOCH = 1577836800000
const BITS_WOKER_ID = 3
const BITS_SEQUENCE = 9
const SEQUENCE_MASK = -1 ^ (-1 << BITS_SEQUENCE)
let sequence = 0
let lastTimestamp = -1

/**
 * 获取工作机器ID, 分布式部署时每台机器要返回不同的值
 */
function getWorkId() {
  return 2
}

/**
 * 获取当前时间的毫秒值
 */
function getMilliSecend() {
  return parseInt(new Date().getTime().toString())
}

/**
 * 获取下一毫秒
 * @param {Number} timestamp
 */
function nextMilliSecond(timestamp) {
  let next = getMilliSecend()
  while (next <= timestamp) {
    next = getMilliSecend()
  }
  return next
}

/**
 * 获取分布式ID
 */
function nextId() {
  let timestamp = getMilliSecend()
  if (lastTimestamp === timestamp) {
    sequence = (sequence + 1) & SEQUENCE_MASK
    if (sequence == 0) {
      timestamp = nextMilliSecond(timestamp)
    }
  } else {
    sequence = 0
  }
  lastTimestamp = timestamp
  let workId = getWorkId()
  console.log('%s - %s', timestamp, sequence)
  return Math.pow(2, BITS_SEQUENCE + BITS_WOKER_ID) * (timestamp - TWEPOCH)
    + Math.pow(2, BITS_SEQUENCE) * workId
    + sequence
}

module.exports = {
  nextId: nextId
}
