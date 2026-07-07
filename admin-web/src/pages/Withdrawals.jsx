import { useEffect, useState } from 'react'
import { Card, Table, Tabs, Tag, Button, Popconfirm, message, Space, Typography } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { http, apiError, downloadCsv } from '../api.js'

const STATUS = { pending: { text: '待审', color: 'gold' }, approved: { text: '已通过', color: 'blue' }, done: { text: '已打款', color: 'green' }, rejected: { text: '已拒绝', color: 'red' } }

export default function Withdrawals() {
  const [status, setStatus] = useState('pending')
  const [data, setData] = useState([])
  const [payFor, setPayFor] = useState(null)

  const load = async (st) => {
    const q = st ? '?status=' + st : ''
    setData(await http.get('/withdrawals' + q))
  }
  useEffect(() => {
    load(status).catch((e) => message.error(apiError(e)))
  }, [status])

  const review = async (id, action, body = {}) => {
    try {
      await http.post(`/withdrawals/${id}/review`, { action, ...body })
      message.success('已处理')
      load(status)
    } catch (e) {
      message.error(apiError(e))
    }
  }

  const cols = [
    { title: '时间', dataIndex: 'created_at', width: 160, render: (t) => new Date(t).toLocaleString() },
    { title: '用户', dataIndex: 'name', render: (n, r) => (<div>{n || r.user_id}<div style={{ fontSize: 12, color: '#999' }}>{r.platform}</div></div>) },
    { title: '金额', dataIndex: 'amount_ton', render: (v) => <b>{v} TON</b> },
    { title: '扣积分', dataIndex: 'coins' },
    { title: '地址', dataIndex: 'address', ellipsis: true, render: (a) => <Typography.Text copyable style={{ maxWidth: 200 }} ellipsis>{a}</Typography.Text> },
    { title: '状态', dataIndex: 'status', width: 90, render: (s) => <Tag color={STATUS[s]?.color}>{STATUS[s]?.text || s}</Tag> },
    {
      title: '操作',
      width: 200,
      render: (_, r) =>
        r.status === 'pending' || r.status === 'approved' ? (
          <Space>
            <Button type="primary" size="small" onClick={() => setPayFor(r)}>通过打款</Button>
            <Popconfirm title="拒绝并退还积分？" onConfirm={() => review(r.id, 'reject')}>
              <Button danger size="small">拒绝退还</Button>
            </Popconfirm>
          </Space>
        ) : (
          <span style={{ color: '#999', fontSize: 12 }}>{r.tx_hash || '-'}</span>
        ),
    },
  ]

  return (
    <Card
      title="提现审核"
      extra={
        <Button icon={<DownloadOutlined />} onClick={() => downloadCsv('/withdrawals/export', { status }, 'withdrawals.csv')}>
          导出CSV
        </Button>
      }
    >
      <Tabs
        activeKey={status}
        onChange={setStatus}
        items={[
          { key: 'pending', label: '待审' },
          { key: 'done', label: '已打款' },
          { key: 'rejected', label: '已拒绝' },
          { key: '', label: '全部' },
        ]}
      />
      <Table rowKey="id" columns={cols} dataSource={data} size="small" pagination={{ pageSize: 20 }} />

      <ModalForm title="确认打款" open={!!payFor} onOpenChange={(o) => !o && setPayFor(null)} modalProps={{ destroyOnClose: true }}
        onFinish={async (v) => {
          await review(payFor.id, 'pay', { txHash: v.txHash || '', note: v.note || '' })
          setPayFor(null)
          return true
        }}>
        <p>给 <b>{payFor?.address}</b> 打款 <b>{payFor?.amount_ton} TON</b>，链上转账完成后填交易哈希：</p>
        <ProFormText name="txHash" label="交易哈希（可留空）" />
        <ProFormText name="note" label="备注（可选）" />
      </ModalForm>
    </Card>
  )
}
