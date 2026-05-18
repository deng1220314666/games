export const registerPwa = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
        })
    }
}

// 获取通知权限
export const requestNotifyPermission = async () => {
    // 浏览器是否支持通知
    if (!('Notification' in window)) {
        console.log('当前浏览器不支持通知')
        return
    }

    // 当前权限状态
    console.log('当前权限:', Notification.permission)

    // 已授权
    if (Notification.permission === 'granted') {
        console.log('已经授权')
        return 'granted'
    }

    // 已拒绝
    if (Notification.permission === 'denied') {
        console.log('用户已经拒绝')
        return 'denied'
    }

    // 请求权限
    const permission = await Notification.requestPermission()

    console.log('用户选择:', permission)

    return permission
}