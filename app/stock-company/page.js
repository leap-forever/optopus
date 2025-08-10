'use client';

import { useState } from 'react';
import { Table, Input, Button, Alert } from 'antd';

export default function StockCompanyPage() {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companyData, setCompanyData] = useState(null);

  // fetch(request, env){
  //   console.log("worker env is",env)
  // }

  const columns = [
    { title: '股票代码', dataIndex: 'ts_code', key: 'ts_code' },
    { title: '董事长', dataIndex: 'chairman', key: 'chairman' },
    { title: '总经理', dataIndex: 'manager', key: 'manager' },
    { title: '董秘', dataIndex: 'secretary', key: 'secretary' },
    { title: '注册资本', dataIndex: 'reg_capital', key: 'reg_capital' },
    { title: '成立日期', dataIndex: 'setup_date', key: 'setup_date' },
    { title: '所在地', dataIndex: 'location', key: 'location',
      render: (_, record) => `${record.province || ''} ${record.city || ''}`.trim() },
    { title: '公司介绍', dataIndex: 'introduction', key: 'introduction',
      ellipsis: { showTitle: true },
      render: (text) => text || '-' },
    { title: '公司网站', dataIndex: 'website', key: 'website',
      render: (text) => text ? <a href={text} target="_blank" rel="noopener noreferrer">{text}</a> : '-' },
    { title: '电子邮件', dataIndex: 'email', key: 'email' },
    { title: '办公地址', dataIndex: 'office', key: 'office',
      ellipsis: { showTitle: true } },
    { title: '员工人数', dataIndex: 'employees', key: 'employees' },
    { title: '主要业务', dataIndex: 'main_business', key: 'main_business',
      ellipsis: { showTitle: true } },
    { title: '经营范围', dataIndex: 'business_scope', key: 'business_scope',
      ellipsis: { showTitle: true } }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCompanyData(null);

    try {
      const response = await fetch(`/api/stock-company?symbol=${symbol}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '获取数据失败');
      }

      setCompanyData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">股票公司信息查询</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <Input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="请输入股票代码（例如：000001.SZ）"
            style={{ width: '300px' }}
            required
          />
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            查询
          </Button>
        </div>
      </form>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          className="mb-6"
        />
      )}

      {companyData && (
        <Table
          dataSource={[companyData]}
          columns={columns}
          pagination={false}
          rowKey="ts_code"
          bordered
          size="middle"
        />
      )}
    </div>
  );
}