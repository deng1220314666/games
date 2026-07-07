import { useEffect, useMemo, useState } from 'react'
import { Card, Table, Input, Button, Popconfirm, Image, message, Tag, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ModalForm, ProFormText, ProFormDigit, ProFormSwitch } from '@ant-design/pro-components'
import { http, apiError } from '../api.js'

export default function Games() {
  const [data, setData] = useState([])
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null)
  const [addOpen, setAddOpen] = useState(false)

  const load = async () => setData(await http.get('/games'))
  useEffect(() => {
    load().catch((e) => message.error(apiError(e)))
  }, [])

  const list = useMemo(() => {
    const s = q.toLowerCase()
    return s ? data.filter((g) => g.id.toLowerCase().includes(s) || (g.name || '').toLowerCase().includes(s)) : data
  }, [data, q])

  const del = async (id) => {
    await http.delete('/games/' + id)
    message.success('已删除')
    load()
  }

  const cols = [
    { title: '封面', dataIndex: 'cover', width: 64, render: (c) => <Image src={c} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 6 }} fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" /> },
    { title: 'ID', dataIndex: 'id', width: 180, ellipsis: true },
    { title: '名称', dataIndex: 'name' },
    { title: '分类', dataIndex: 'category', width: 120 },
    { title: '排序', dataIndex: 'sort', width: 70 },
    { title: '启用', dataIndex: 'enabled', width: 70, render: (v) => (v ? <Tag color="green">是</Tag> : <Tag>否</Tag>) },
    {
      title: '操作',
      width: 130,
      render: (_, r) => (
        <Space>
          <a onClick={() => setEditing(r)}>编辑</a>
          <Popconfirm title={'删除 ' + r.id + '?'} onConfirm={() => del(r.id)}>
            <a style={{ color: '#e5484d' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const gameFormFields = (
    <>
      <ProFormText name="id" label="ID" rules={[{ required: true }]} disabled={!!editing} />
      <ProFormText name="name" label="名称" rules={[{ required: true }]} />
      <ProFormText name="cover" label="封面 URL" />
      <ProFormText name="url" label="游戏 URL" />
      <ProFormText name="category" label="分类" />
      <ProFormDigit name="sort" label="排序" />
      <ProFormSwitch name="enabled" label="启用" initialValue={true} />
    </>
  )

  return (
    <Card
      title={`游戏列表（${data.length}）`}
      extra={
        <Space>
          <Input.Search placeholder="搜索 名称/ID" allowClear onChange={(e) => setQ(e.target.value)} style={{ width: 220 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddOpen(true)}>
            新增游戏
          </Button>
        </Space>
      }
    >
      <Table rowKey="id" columns={cols} dataSource={list} pagination={{ pageSize: 20, showSizeChanger: true }} size="small" />

      {/* 新增 */}
      <ModalForm title="新增游戏" open={addOpen} onOpenChange={setAddOpen} modalProps={{ destroyOnClose: true }}
        onFinish={async (v) => {
          try {
            await http.post('/games', v)
            message.success('已添加')
            setAddOpen(false)
            load()
            return true
          } catch (e) {
            message.error(apiError(e))
            return false
          }
        }}>
        {gameFormFields}
      </ModalForm>

      {/* 编辑 */}
      <ModalForm title={'编辑游戏：' + (editing?.id || '')} open={!!editing} onOpenChange={(o) => !o && setEditing(null)}
        initialValues={editing || {}} modalProps={{ destroyOnClose: true }}
        onFinish={async (v) => {
          try {
            await http.put('/games/' + editing.id, { ...editing, ...v })
            message.success('已保存')
            setEditing(null)
            load()
            return true
          } catch (e) {
            message.error(apiError(e))
            return false
          }
        }}>
        {gameFormFields}
      </ModalForm>
    </Card>
  )
}
