import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom'
import { ProLayout, ModalForm, ProFormText } from '@ant-design/pro-components'
import { Dropdown, message } from 'antd'
import {
  DashboardOutlined,
  ScheduleOutlined,
  AppstoreOutlined,
  WalletOutlined,
  TeamOutlined,
  FileSearchOutlined,
  KeyOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { auth, http, apiError } from '../api.js'
import Overview from './Overview.jsx'
import Users from './Users.jsx'
import Tasks from './Tasks.jsx'
import Games from './Games.jsx'
import Withdrawals from './Withdrawals.jsx'
import Audit from './Audit.jsx'

const menu = {
  path: '/',
  routes: [
    { path: '/', name: '概览', icon: <DashboardOutlined /> },
    { path: '/users', name: '用户列表', icon: <TeamOutlined /> },
    { path: '/tasks', name: '签到 & 任务', icon: <ScheduleOutlined /> },
    { path: '/games', name: '游戏列表', icon: <AppstoreOutlined /> },
    { path: '/withdrawals', name: '提现审核', icon: <WalletOutlined /> },
    { path: '/audit', name: '审计日志', icon: <FileSearchOutlined /> },
  ],
}

export default function Shell() {
  const nav = useNavigate()
  const loc = useLocation()
  const [pwOpen, setPwOpen] = useState(false)

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
              items: [
                { key: 'password', icon: <KeyOutlined />, label: '修改密码' },
                { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' },
              ],
              onClick: ({ key }) => (key === 'logout' ? logout() : setPwOpen(true)),
            }}
          >
            {dom}
          </Dropdown>
        ),
      }}
    >
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/users" element={<Users />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/games" element={<Games />} />
        <Route path="/withdrawals" element={<Withdrawals />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ModalForm
        title="修改密码"
        open={pwOpen}
        onOpenChange={setPwOpen}
        modalProps={{ destroyOnClose: true }}
        width={420}
        onFinish={async (v) => {
          if (v.newPassword !== v.confirm) {
            message.error('两次新密码不一致')
            return false
          }
          try {
            await http.post('/account/password', { oldPassword: v.oldPassword, newPassword: v.newPassword })
            message.success('密码已修改')
            setPwOpen(false)
            return true
          } catch (e) {
            message.error(apiError(e) === 'bad_old_password' ? '原密码错误' : apiError(e))
            return false
          }
        }}
      >
        <ProFormText.Password name="oldPassword" label="原密码" rules={[{ required: true }]} />
        <ProFormText.Password name="newPassword" label="新密码（≥6位）" rules={[{ required: true, min: 6 }]} />
        <ProFormText.Password name="confirm" label="确认新密码" rules={[{ required: true }]} />
      </ModalForm>
    </ProLayout>
  )
}
