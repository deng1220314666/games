import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom'
import { ProLayout } from '@ant-design/pro-components'
import { Dropdown } from 'antd'
import {
  DashboardOutlined,
  ScheduleOutlined,
  AppstoreOutlined,
  WalletOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { auth } from '../api.js'
import Overview from './Overview.jsx'
import Tasks from './Tasks.jsx'
import Games from './Games.jsx'
import Withdrawals from './Withdrawals.jsx'

const menu = {
  path: '/',
  routes: [
    { path: '/', name: '概览', icon: <DashboardOutlined /> },
    { path: '/tasks', name: '签到 & 任务', icon: <ScheduleOutlined /> },
    { path: '/games', name: '游戏列表', icon: <AppstoreOutlined /> },
    { path: '/withdrawals', name: '提现审核', icon: <WalletOutlined /> },
  ],
}

export default function Shell() {
  const nav = useNavigate()
  const loc = useLocation()

  const logout = () => {
    auth.clear()
    nav('/login', { replace: true })
  }

  return (
    <ProLayout
      title="TTEarn 后台"
      logo={false}
      layout="mix"
      fixedHeader
      fixSiderbar
      location={{ pathname: loc.pathname }}
      route={menu}
      menuItemRender={(item, dom) => <Link to={item.path}>{dom}</Link>}
      avatarProps={{
        title: 'admin',
        size: 'small',
        render: (_, dom) => (
          <Dropdown
            menu={{
              items: [{ key: 'logout', icon: <LogoutOutlined />, label: '退出登录' }],
              onClick: logout,
            }}
          >
            {dom}
          </Dropdown>
        ),
      }}
    >
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/games" element={<Games />} />
        <Route path="/withdrawals" element={<Withdrawals />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProLayout>
  )
}
