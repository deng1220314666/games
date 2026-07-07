import { useEffect, useState, useCallback } from 'react'
import { Space, Select, DatePicker, Table } from 'antd'
import { http, apiError } from '../api.js'
import { message } from 'antd'

const { RangePicker } = DatePicker
const SRC = {
  daily_checkin: '签到',
  watch_ad: '看广告',
  play_game: '玩游戏',
  invite: '邀请奖励',
  invite_rebate: '邀请返佣',
  admin_adjust: '后台调整',
}

export default function UserLedger({ userId }) {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState()
  const [range, setRange] = useState()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const load = useCallback(
    async (p = page, ps = pageSize) => {
      setLoading(true)
      try {
        const params = { page: p, pageSize: ps }
        if (source) params.source = source
        if (range && range[0]) {
          params.from = range[0].toISOString()
          params.to = range[1].toISOString()
        }
        const res = await http.get(`/users/${userId}/ledger`, { params })
        setData(res.data)
        setTotal(res.total)
      } catch (e) {
        message.error(apiError(e))
      } finally {
        setLoading(false)
      }
    },
    [userId, source, range, page, pageSize]
  )

  useEffect(() => {
    setPage(1)
    load(1, pageSize)
    // eslint-disable-next-line
  }, [userId, source, range])

  const cols = [
    { title: '时间', dataIndex: 'created_at', render: (t) => new Date(t).toLocaleString() },
    { title: '来源', dataIndex: 'source', render: (s) => SRC[s] || s },
    { title: '积分', dataIndex: 'amount', render: (v) => <span style={{ color: v > 0 ? '#52c41a' : '#e5484d' }}>{v > 0 ? '+' : ''}{v}</span> },
    { title: '备注', dataIndex: 'meta', render: (m) => (m?.reason || '') },
  ]

  return (
    <>
      <Space style={{ marginBottom: 12 }} wrap>
        <Select
          allowClear
          placeholder="全部来源"
          style={{ width: 140 }}
          value={source}
          onChange={setSource}
          options={Object.entries(SRC).map(([v, l]) => ({ value: v, label: l }))}
        />
        <RangePicker showTime onChange={setRange} />
      </Space>
      <Table
        rowKey={(r, i) => i}
        loading={loading}
        size="small"
        columns={cols}
        dataSource={data}
        pagination={{
          current: page,
          pageSize,
          total,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => {
            setPage(p)
            setPageSize(ps)
            load(p, ps)
          },
        }}
      />
    </>
  )
}
