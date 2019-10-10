class Time {
    currentTime () {
        const now = new Date()
        const y = now.getFullYear()
        const m = now.getMonth() + 1
        const d = now.getDate()
        const hours = now.getHours()
        const minutes = now.getMinutes()
        const second = now.getSeconds()
        return y + '-' + (m < 0 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (second < 10 ? '0' + second : second)
    }
    timestampTransform (timestamp) {
        const now = new Date(timestamp)
        const y = now.getFullYear()
        const m = now.getMonth() + 1
        const d = now.getDate()
        const hours = now.getHours()
        const minutes = now.getMinutes()
        const second = now.getSeconds()
        return y + '-' + (m < 0 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (second < 10 ? '0' + second : second)
    }
}
module.exports = new Time()