import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { http, auth, apiError } from '../api.js'

export default function Login() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (v) => {
    setLoading(true)
    try {
      const res = await http.post('/auth/login', v)
      auth.set(res.token)
      nav('/', { replace: true })
    } catch (e) {
      message.error(apiError(e) === 'bad_credentials' ? '账号或密码错误' : apiError(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 360 }}>
        <Typography.Title level={4} style={{ textAlign: 'center' }}>
          TTEarn 后台管理
        </Typography.Title>
        <Form onFinish={onFinish} initialValues={{ username: 'admin' }} size="large">
          <Form.Item name="username" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  )
}
