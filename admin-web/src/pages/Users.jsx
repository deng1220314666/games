import { useEffect, useState, useCallback } from 'react'
import { Card, Table, Input, Tag, Button, Drawer, Descriptions, Tabs, Spin, message, Space, Popconfirm } from 'antd'
import { ModalForm, ProFormDigit, ProFormTextArea } from '@ant-design/pro-components'
import { http, apiError } from '../api.js'

const SRC = {
  daily_checkin: '签到',
  watch_ad: '看广告',
  play_game: '玩游戏',
  invite: '邀请奖励',
  invite_rebate: '邀请返佣',
  admin_adjust: '后台调整',
}
const WD_STATUS = { pending: { t: '待审', c: 'gold' }, approved: { t: '已通过', c: 'blue' }, done: { t: '已打款', c: 'green' }, rejected: { t: '已拒绝', c: 'red' } }

export default function Users() {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [adjustOpen, setAdjustOpen] = useState(false)

  const load = useCallback(async (p = page, ps = pageSize, query = q) => {
    setLoading(true)
    try {
      const res = await http.get('/users', { params: { q: query, page: p, pageSize: ps } })
      setData(res.data)
      setTotal(res.total)
    } catch (e) {
      message.error(apiError(e))
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, q])

  useEffect(() => {
    load(1, pageSize, q)
    setPage(1)
    // eslint-disable-next-line
  }, [q])

  const openDetail = async (id) => {
    setDetailLoading(true)
    setDetail({ loading: true })
    try {
      setDetail(await http.get('/users/' + id))
    } catch (e) {
      message.error(apiError(e))
      setDetail(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const doBan = async (id, banned) => {
    try {
      await http.post(`/users/${id}/ban`, { banned })
      message.success(banned ? '已封号' : '已解封')
      openDetail(id)
      load()
    } catch (e) {
      message.error(apiError(e))
    }
  }

  const cols = [
    { title: 'ID', dataIndex: 'id', ellipsis: true, width: 150 },
    { title: '昵称', dataIndex: 'name' },
    { title: '平台', dataIndex: 'platform', width: 90, render: (p) => <Tag>{p}</Tag> },
    { title: '状态', dataIndex: 'banned', width: 76, render: (b) => (b ? <Tag color="red">封号</Tag> : <Tag color="green">正常</Tag>) },
    { title: '积分余额', dataIndex: 'balance', width: 110, render: (v) => <b>{v.toLocaleString()}</b> },
    { title: '连签', dataIndex: 'streak', width: 70 },
    { title: '邀请码', dataIndex: 'invite_code', width: 110 },
    { title: '返佣累计', dataIndex: 'referral_earned', width: 100 },
    { title: '注册时间', dataIndex: 'created_at', width: 160, render: (t) => new Date(t).toLocaleString() },
    { title: '', width: 70, render: (_, r) => <a onClick={() => openDetail(r.id)}>详情</a> },
  ]

  const ledgerCols = [
    { title: '时间', dataIndex: 'created_at', render: (t) => new Date(t).toLocaleString() },
    { title: '来源', dataIndex: 'source', render: (s) => SRC[s] || s },
    { title: '积分', dataIndex: 'amount', render: (v) => <span style={{ color: v > 0 ? '#52c41a' : '#e5484d' }}>{v > 0 ? '+' : ''}{v}</span> },
  ]
  const wdCols = [
    { title: '时间', dataIndex: 'created_at', render: (t) => new Date(t).toLocaleString() },
    { title: '金额', dataIndex: 'amount_ton', render: (v) => <b>{v} TON</b> },
    { title: '扣积分', dataIndex: 'coins' },
    { title: '地址', dataIndex: 'address', ellipsis: true },
    { title: '状态', dataIndex: 'status', render: (s) => <Tag color={WD_STATUS[s]?.c}>{WD_STATUS[s]?.t || s}</Tag> },
    { title: '交易哈希', dataIndex: 'tx_hash', ellipsis: true, render: (h) => h || '-' },
  ]

  const u = detail?.user
  const s = detail?.summary

  return (
    <Card title="用户列表" extra={<Input.Search placeholder="搜索 ID/昵称/邀请码" allowClear style={{ width: 260 }} onSearch={setQ} />}>
      <Table
        rowKey="id"
        loading={loading}
        columns={cols}
        dataSource={data}
        size="small"
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 个用户`,
          onChange: (p, ps) => {
            setPage(p)
            setPageSize(ps)
            load(p, ps, q)
          },
        }}
      />

      <Drawer
        title="用户详情"
        width={720}
        open={!!detail}
        onClose={() => setDetail(null)}
        extra={
          u ? (
            <Space>
              <Button onClick={() => setAdjustOpen(true)}>调整积分</Button>
              {u.banned ? (
                <Popconfirm title="解除封号？" onConfirm={() => doBan(u.id, false)}>
                  <Button>解封</Button>
                </Popconfirm>
              ) : (
                <Popconfirm title="封禁该用户？（将无法登录/赚币/提现）" onConfirm={() => doBan(u.id, true)}>
                  <Button danger>封号</Button>
                </Popconfirm>
              )}
            </Space>
          ) : null
        }
      >
        {detailLoading || !u ? (
          <Spin />
        ) : (
          <>
            {u.banned && (
              <Tag color="red" style={{ marginBottom: 12 }}>
                已封号{u.ban_reason ? '：' + u.ban_reason : ''}
              </Tag>
            )}
            <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="ID" span={2}>{u.id}</Descriptions.Item>
              <Descriptions.Item label="昵称">{u.name}</Descriptions.Item>
              <Descriptions.Item label="平台">{u.platform}</Descriptions.Item>
              <Descriptions.Item label="积分余额"><b>{u.balance.toLocaleString()}</b></Descriptions.Item>
              <Descriptions.Item label="累计获取积分"><b style={{ color: '#52c41a' }}>{s.earnedTotal.toLocaleString()}</b></Descriptions.Item>
              <Descriptions.Item label="邀请码">{u.invite_code}</Descriptions.Item>
              <Descriptions.Item label="下级人数">{s.referrals}</Descriptions.Item>
              <Descriptions.Item label="已提现">{s.withdrawnTon} TON（{s.withdrawnCount} 笔）</Descriptions.Item>
              <Descriptions.Item label="连签天数">{u.streak}</Descriptions.Item>
            </Descriptions>
            <Tabs
              items={[
                {
                  key: 'ledger',
                  label: `积分记录（${detail.ledger.length}）`,
                  children: <Table rowKey={(r, i) => i} size="small" columns={ledgerCols} dataSource={detail.ledger} pagination={{ pageSize: 10 }} />,
                },
                {
                  key: 'wd',
                  label: `提现记录（${detail.withdrawals.length}）`,
                  children: <Table rowKey="id" size="small" columns={wdCols} dataSource={detail.withdrawals} pagination={{ pageSize: 10 }} />,
                },
              ]}
            />
          </>
        )}
      </Drawer>

      <ModalForm
        title={'调整积分：' + (u?.name || u?.id || '')}
        open={adjustOpen}
        onOpenChange={setAdjustOpen}
        modalProps={{ destroyOnClose: true }}
        onFinish={async (v) => {
          try {
            const r = await http.post(`/users/${u.id}/adjust`, { amount: v.amount, reason: v.reason })
            message.success(`已调整，当前余额 ${r.balance}`)
            setAdjustOpen(false)
            openDetail(u.id)
            load()
            return true
          } catch (e) {
            message.error(apiError(e))
            return false
          }
        }}
      >
        <p style={{ color: '#888' }}>正数增加、负数扣减（余额下限 0）。会记入该用户积分流水。</p>
        <ProFormDigit name="amount" label="调整数量（+/-）" rules={[{ required: true }]} fieldProps={{ precision: 0 }} />
        <ProFormTextArea name="reason" label="原因（记入流水）" />
      </ModalForm>
    </Card>
  )
}
