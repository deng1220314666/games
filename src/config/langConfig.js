export const langConfig = {
  en: {
    privateAccess: 'Private Access',
    onlineUsers: 'users online now',

    title: 'Private Community Access',

    desc1: 'Some profiles may contain sensitive content.',
    desc2: 'Please confirm your age to continue.',

    online: 'Online',

    requestText: 'Sent you a private request',

    continueBtn: 'Continue',

    laterBtn: 'Maybe Later',

    footer: 'You must be 18+ to access private profiles'
  },

  bi: {
    privateAccess: 'Akses Pribadi',
    onlineUsers: 'pengguna sedang online',

    title: 'Akses Komunitas Pribadi',

    desc1: 'Beberapa profil mungkin berisi konten sensitif.',
    desc2: 'Harap konfirmasi usia Anda untuk melanjutkan.',

    online: 'Online',

    requestText: 'Mengirim permintaan pribadi kepada Anda',

    continueBtn: 'Lanjutkan',

    laterBtn: 'Nanti Saja',

    footer: 'Anda harus berusia 18+ untuk mengakses profil pribadi'
  },

  id: {
    privateAccess: 'Akses Pribadi',
    onlineUsers: 'pengguna sedang online',

    title: 'Akses Komunitas Pribadi',

    desc1: 'Beberapa profil mungkin berisi konten sensitif.',
    desc2: 'Harap konfirmasi usia Anda untuk melanjutkan.',

    online: 'Online',

    requestText: 'Mengirim permintaan pribadi kepada Anda',

    continueBtn: 'Lanjutkan',

    laterBtn: 'Nanti Saja',

    footer: 'Anda harus berusia 18+ untuk mengakses profil pribadi'
  },

  zh: {
    privateAccess: '私人访问',
    onlineUsers: '用户在线',

    title: '私人社区访问',

    desc1: '部分内容可能包含敏感信息。',
    desc2: '请确认您的年龄以继续。',

    online: '在线',

    requestText: '向您发送了私人请求',

    continueBtn: '继续',

    laterBtn: '稍后再说',

    footer: '您必须年满18岁才能访问私人内容'
  }
}

export const getLang = () => {
  const navLang = navigator.language || navigator.userLanguage || 'en'
  const shortLang = navLang.split('-')[0].toLowerCase()
  
  if (langConfig[shortLang]) {
    return shortLang
  }
  
  return 'en'
}

export const getLangConfig = () => {
  const lang = getLang()
  return langConfig[lang] || langConfig['en']
}

export default { langConfig, getLang, getLangConfig }