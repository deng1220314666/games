import { useEffect, useState } from 'react'
import { Card, Form, InputNumber, Button, Table, message, Tag } from 'antd'
import { ModalForm, ProFormText, ProFormDigit, ProFormSwitch } from '@ant-design/pro-components'
import { http, apiError } from '../api.js'

export default function Tasks() {
  const [form] = Form.useForm()
  const [tasks, setTasks] = useState([])
  const [editing, setEditing] = useState(null)

  const load = async () => {
    const s = await http.get('/settings')
    form.setFieldsValue(s)
    setTasks(await http.get('/tasks'))
  }
  useEffect(() => {
    load().catch((e) => message.error(apiError(e)))
  }, [])

  const saveSettings = async (v) => {
    await http.put('/settings', v)
    message.success('参数已保存')
  }

  const cols = [
    { title: 'ID', dataIndex: 'id' },
    { title: '类型', dataIndex: 'type', render: (t) => <Tag>{t}</Tag> },
    { title: '标题', dataIndex: 'title' },
    { title: '奖励积分', dataIndex: 'reward' },
    { title: '图标', dataIndex: 'icon', render: (i) => (i?.startsWith('http') ? <img src={i} width={22} /> : <span style={{ fontSize: 18 }}>{i}</span>) },
    { title: '每日上限', dataIndex: 'total', render: (v) => v ?? '-' },
    { title: '启用', dataIndex: 'enabled', render: (v) => (v ? <Tag color="green">是</Tag> : <Tag>否</Tag>) },
    { title: '排序', dataIndex: 'sort' },
    { title: '操作', render: (_, r) => <a onClick={() => setEditing(r)}>编辑</a> },
  ]

  return (
    <>
      <Card title="经济参数" style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={saveSettings} style={{ rowGap: 12 }}>
          <Form.Item name="coinPerTon" label="积分兑1TON"><InputNumber style={{ width: 130 }} /></Form.Item>
          <Form.Item name="minWithdrawTon" label="最低提现TON"><InputNumber step={0.1} /></Form.Item>
          <Form.Item name="withdrawFeeTon" label="手续费TON"><InputNumber step={0.01} /></Form.Item>
          <Form.Item name="checkInStreakBonus" label="连签每日额外"><InputNumber /></Form.Item>
          <Form.Item name="inviteRebate" label="邀请返佣(0-1)"><InputNumber step={0.01} /></Form.Item>
          <Form.Item name="maxEarnPerCall" label="单次发币上限"><InputNumber /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit">保存参数</Button></Form.Item>
        </Form>
      </Card>

      <Card title="任务 / 签到（奖励数量 & 图标）">
        <Table rowKey="id" columns={cols} dataSource={tasks} pagination={false} />
      </Card>

      <ModalForm
        title={'编辑任务：' + (editing?.id || '')}
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        initialValues={editing || {}}
        modalProps={{ destroyOnClose: true }}
        onFinish={async (v) => {
          try {
            await http.put('/tasks/' + editing.id, { ...editing, ...v })
            message.success('已保存')
            setEditing(null)
            load()
            return true
          } catch (e) {
            message.error(apiError(e))
            return false
          }
        }}
      >
        <ProFormText name="title" label="标题" rules={[{ required: true }]} />
        <ProFormDigit name="reward" label="奖励积分" />
        <ProFormText name="icon" label="图标（emoji 或图片URL）" />
        <ProFormDigit name="total" label="每日上限（次数/封顶，可空）" />
        <ProFormDigit name="sort" label="排序" />
        <ProFormSwitch name="enabled" label="启用" />
      </ModalForm>
    </>
  )
}
