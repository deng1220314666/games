import { defineStore } from 'pinia'

// TON 钱包连接状态与提现记录。
export const useWalletStore = defineStore('wallet', {
  state: () => ({
    connected: false,
    address: '',
    chain: '',
    tonBalance: 0, // 链上余额(展示,来自后端/toncenter)
    withdrawals: [], // { id, amountTon, address, status, time } status: pending|done|rejected
  }),

  getters: {
    shortAddress: (state) =>
      state.address
        ? `${state.address.slice(0, 4)}...${state.address.slice(-4)}`
        : '',
  },

  actions: {
    setWallet(w) {
      if (w) {
        this.connected = true
        this.address = w.address
        this.chain = w.chain || ''
      } else {
        this.connected = false
        this.address = ''
        this.chain = ''
      }
    },
    addWithdrawal(record) {
      this.withdrawals.unshift(record)
    },
    updateWithdrawal(id, patch) {
      const w = this.withdrawals.find((x) => x.id === id)
      if (w) Object.assign(w, patch)
    },
  },

  persist: {
    key: 'tt-wallet',
    storage: window.localStorage,
    paths: ['withdrawals'], // 连接状态每次由 TON Connect 恢复,不持久化地址
  },
})
