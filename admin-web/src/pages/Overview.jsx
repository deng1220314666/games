import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Spin } from 'antd'
import { UserOutlined, WalletOutlined, DollarOutlined, AppstoreOutlined } from '@ant-design/icons'
import { http } from '../api.js'

export default function Overview() {
  const [d, setD] = useState(null)
  useEffect(() => {
    http.get('/overview').then(setD).catch(() => {})
  }, [])
  if (!d) return <Spin style={{ margin: 40 }} />
  const items = [
    { t: '用户数', v: d.users, icon: <UserOutlined />, c: '#3390ec' },
    { t: '待审提现', v: d.pendingWithdrawals, icon: <WalletOutlined />, c: '#faad14' },
    { t: '积分总量', v: d.totalCoins, icon: <DollarOutlined />, c: '#52c41a' },
    { t: '游戏数', v: d.games, icon: <AppstoreOutlined />, c: '#722ed1' },
  ]
  return (
    <Row gutter={16}>
      {items.map((it) => (
        <Col xs={12} md={6} key={it.t} style={{ marginBottom: 16 }}>
          <Card>
            <Statistic title={it.t} value={it.v} prefix={<span style={{ color: it.c }}>{it.icon}</span>} />
          </Card>
        </Col>
      ))}
    </Row>
  )
}
