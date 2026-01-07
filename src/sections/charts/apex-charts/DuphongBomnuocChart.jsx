import React, { useMemo, useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Card, Spin, Empty, Select } from 'antd';
import dayjs from 'dayjs';
import { useTonghopbomnuocStore } from '/src/stores/bomnuoc/TonghopbomnuocStore';

const DuphongBomnuocChart = () => {
  const { dataTonghopbomnuoc, loading, fetchTonghopbomnuoc } = useTonghopbomnuocStore();

  useEffect(() => {
    fetchTonghopbomnuoc();
  }, []);
  // ✅ LUÔN ÉP DATA VỀ ARRAY
  const listData = useMemo(
    () => (Array.isArray(dataTonghopbomnuoc) ? dataTonghopbomnuoc : dataTonghopbomnuoc?.items || []),
    [dataTonghopbomnuoc]
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
      xaxis: {
        categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
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

export default DuphongBomnuocChart;
