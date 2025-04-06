import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // 从 URL 参数中获取股票代码
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        { error: '请提供股票代码参数 symbol' },
        { status: 400 }
      );
    }

    // 获取 token
    const token = process.env.TUSHARE_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: '未配置 TUSHARE_TOKEN 环境变量' },
        { status: 500 }
      );
    }

    // 调用 Tushare API
    const response = await fetch('http://api.tushare.pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_name: 'stock_company',
        token: token,
        params: {
          ts_code: symbol
        },
        fields: 'ts_code,chairman,manager,secretary,reg_capital,setup_date,province,city,introduction,website,email,office,employees,main_business,business_scope'
      })
    });

    if (!response.ok) {
      throw new Error(`Tushare API 请求失败: ${response.status}`);
    }

    const result = await response.json();

    if (!result.data || !result.data.items || result.data.items.length === 0) {
      return NextResponse.json(
        { error: '未找到该股票的公司信息' },
        { status: 404 }
      );
    }

    // 将数组数据转换为对象
    const companyData = {};
    result.data.fields.forEach((field, index) => {
      companyData[field] = result.data.items[0][index];
    });

    // 返回查询结果
    return NextResponse.json(companyData);

  } catch (error) {
    console.error('获取股票公司信息失败:', error);
    return NextResponse.json(
      { error: '获取股票公司信息失败' },
      { status: 500 }
    );
  }
}