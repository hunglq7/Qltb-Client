import React, { useMemo, useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Card, Spin, Empty, Select } from 'antd';
import dayjs from 'dayjs';
import { useTonghopmayxucStore } from '../../../stores/mayxuc/tonghopmayxucStore';
const MayxucChart = () => {
  const { dataTonghopMayxuc, loading, fetchTonghopmayxuc } = useTonghopmayxucStore();
  useEffect(() => {
    fetchTonghopmayxuc();
  }, []);
  // ✅ LUÔN ÉP DATA VỀ ARRAY
  const listData = useMemo(
    () => (Array.isArray(dataTonghopMayxuc) ? dataTonghopMayxuc : dataTonghopMayxuc?.items || []),
    [dataTonghopMayxuc]
  );

  /* ================= BIỂU ĐỒ DỰ PHÒNG ================= */
  const { labels, series } = useMemo(() => {
    if (!listData.length) return { labels: [], series: [] };
    const counts = listData.reduce((acc, item) => {
      const key = item.duPhong === true || item.duPhong === 'true' ? 'Đang dùng' : 'Dự phòng';
      acc[key] = (acc[key] || 0) + (item.soLuong || 1);
      return acc;
    }, {});

    return {
      labels: Object.keys(counts),
      series: Object.values(counts)
    };
  }, [listData]);

  const barOptions = useMemo(
    () => ({
      chart: { type: 'bar', toolbar: { show: true } },
      title: { text: 'Tổng số thiết bị đang dùng / dự phòng', align: 'center' },
      colors: ['#1de9b6', '#04a9f5'], // Màu xanh cho Đang dùng, màu vàng cho Dự phòng
      xaxis: { categories: labels },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '45%',
          distributed: true // Giúp mỗi cột có một màu riêng từ mảng colors
        }
      },
      dataLabels: { enabled: true }
    }),
    [labels]
  );

  const donutOptions = useMemo(
    () => ({
      labels,
      title: { text: 'Tỷ lệ % thiết bị', align: 'center' },
      colors: ['#1de9b6', '#04a9f5'],
      legend: { position: 'bottom' }
    }),
    [labels]
  );

  /* ================= BIỂU ĐỒ THEO THÁNG ================= */
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const years = useMemo(() => {
    const set = new Set(listData.filter((x) => x.ngayLap).map((x) => dayjs(x.ngayLap).year()));
    return Array.from(set).sort((a, b) => b - a);
  }, [listData]);

  useEffect(() => {
    if (years.length && !years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  const monthlyData = useMemo(() => {
    const arr = Array(12).fill(0);

    listData.forEach((item) => {
      if (!item.ngayLap) return;
      const d = dayjs(item.ngayLap);
      if (d.year() === selectedYear) {
        arr[d.month()] += item.soLuong || 1;
      }
    });

    return arr;
  }, [listData, selectedYear]);

  const monthOptions = useMemo(
    () => ({
      chart: { type: 'bar' },
      title: {
        text: `Thống kê thiết bị theo tháng - ${selectedYear}`,
        align: 'center'
      },
      colors: ['#722ed1'],
      xaxis: {
        categories: [
          'Tháng 1',
          'Tháng 2',
          'Tháng 3',
          'Tháng 4',
          'Tháng 5',
          'Tháng 6',
          'Tháng 7',
          'Tháng 8',
          'Tháng 9',
          'Tháng 10',
          'Tháng 11',
          'Tháng 12'
        ]
      },
      dataLabels: { enabled: true }
    }),
    [selectedYear]
  );
  /* ================= RENDER ================= */
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!listData.length) {
    return <Empty description="Không có dữ liệu" />;
  }
  return (
    <div style={{ display: 'flex', gap: 20, padding: 20, flexWrap: 'wrap' }}>
      <Card style={{ flex: 1, minWidth: 400 }}>
        <Chart key="bar-duphong" options={barOptions} series={[{ name: 'Số lượng', data: series }]} type="bar" height={320} />
      </Card>

      <Card style={{ flex: 1, minWidth: 400 }}>
        <Chart key="donut-duphong" options={donutOptions} series={series} type="donut" height={320} />
      </Card>

      <Card
        style={{ flex: 1, minWidth: 400 }}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>📊 Thống kê theo tháng</span>
            <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 120 }}>
              {years.map((y) => (
                <Select.Option key={y} value={y}>
                  {y}
                </Select.Option>
              ))}
            </Select>
          </div>
        }
      >
        {monthlyData.some((x) => x > 0) ? (
          <Chart
            key={`month-${selectedYear}`}
            options={monthOptions}
            series={[{ name: 'Số lượng', data: monthlyData }]}
            type="bar"
            height={320}
          />
        ) : (
          <Empty description="Không có dữ liệu theo năm đã chọn" />
        )}
      </Card>
    </div>
  );
};

export default MayxucChart;
