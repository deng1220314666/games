import { useEffect, useState } from 'react'
import { Card, Table, Tag, Typography } from 'antd'
import { http, apiError } from '../api.js'
import { message } from 'antd'

const ACTION = {
  update_settings: { t: '改经济参数', c: 'blue' },
  update_task: { t: '改任务', c: 'blue' },
  create_task: { t: '建任务', c: 'green' },
  delete_task: { t: '删任务', c: 'red' },
  update_game: { t: '改游戏', c: 'blue' },
  create_game: { t: '建游戏', c: 'green' },
  delete_game: { t: '删游戏', c: 'red' },
  adjust_balance: { t: '调积分', c: 'gold' },
  ban_user: { t: '封号', c: 'red' },
  unban_user: { t: '解封', c: 'green' },
  review_withdrawal: { t: '审提现', c: 'purple' },
  export_users: { t: '导出用户', c: 'default' },
  export_withdrawals: { t: '导出提现', c: 'default' },
  change_password: { t: '改密码', c: 'orange' },
}

export default function Audit() {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const load = async (p = page, ps = pageSize) => {
    setLoading(true)
    try {
      const res = await http.get('/audit', { params: { page: p, pageSize: ps } })
      setData(res.data)
      setTotal(res.total)
    } catch (e) {
      message.error(apiError(e))
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [])

  const cols = [
    { title: '时间', dataIndex: 'created_at', width: 170, render: (t) => new Date(t).toLocaleString() },
    { title: '操作员', dataIndex: 'admin', width: 100 },
    { title: '动作', dataIndex: 'action', width: 110, render: (a) => <Tag color={ACTION[a]?.c}>{ACTION[a]?.t || a}</Tag> },
    { title: '对象', dataIndex: 'target', width: 160, ellipsis: true, render: (t) => t || '-' },
    { title: '详情', dataIndex: 'detail', render: (d) => (d ? <Typography.Text style={{ fontSize: 12 }} code>{JSON.stringify(d)}</Typography.Text> : '-') },
  ]

  return (
    <Card title="操作审计日志">
      <Table
        rowKey="id"
        loading={loading}
        size="small"
        columns={cols}
        dataSource={data}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => {
            setPage(p)
            setPageSize(ps)
            load(p, ps)
          },
        }}
      />
    </Card>
  )
}
