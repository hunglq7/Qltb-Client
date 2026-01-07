import React, { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { Card, Spin, Empty, Select } from 'antd';
import { useTonghopbomnuocStore } from '/src/stores/bomnuoc/TonghopbomnuocStore';
import ApexCharts from 'apexcharts';
import { useRef } from 'react';
import dayjs from 'dayjs';
const ChartWrapper = React.memo(({ children }) => children);
const BackupChart = () => {
  const { dataTonghopbomnuoc, loading, fetchTonghopbomnuoc } = useTonghopbomnuocStore();
  const barChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const monthChartRef = useRef(null);
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchTonghopbomnuoc();
    }
    return () => {
      isMounted = false;
    };
  }, [fetchTonghopbomnuoc]);

  useEffect(() => {
    return () => {
      try {
        ApexCharts.exec('bar-du-phong', 'destroy');
        ApexCharts.exec('thong-ke-theo-thang', 'destroy');
      } catch (e) {
        // ignore
        console.log('Lỗi ApexChart');
      }
    };
  }, []);

  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const listData = Array.isArray(dataTonghopbomnuoc) ? dataTonghopbomnuoc : dataTonghopbomnuoc?.items || [];

  //=====================Biểu đồ theo trường DuPhong=======================
  const { labels, series } = useMemo(() => {
    if (!dataTonghopbomnuoc || dataTonghopbomnuoc.length === 0) {
      return { labels: [], series: [] };
    }

    const counts = dataTonghopbomnuoc.reduce((acc, item) => {
      // Logic chuyển đổi trạng thái duPhong
      let statusText = '';
      if (item.duPhong === true || item.duPhong === 'true') {
        statusText = 'Đang dùng';
      } else if (item.duPhong === false || item.duPhong === 'false') {
        statusText = 'Dự phòng';
      } else {
        statusText = 'Không xác định';
      }

      acc[statusText] = (acc[statusText] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(counts),
      series: Object.values(counts)
    };
  }, [dataTonghopbomnuoc]);

  const columnOptions = useMemo(
    () => ({
      chart: {
        id: 'bar-du-phong',
        toolbar: { show: true }
      },
      xaxis: {
        categories: labels
      },
      title: { text: 'Thống kê tổng số thiết bị đang dùng và dự phòng', align: 'center' },
      colors: ['#1de9b6', '#04a9f5'], // Màu xanh cho Đang dùng, màu vàng cho Dự phòng
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
      labels: labels,
      title: { text: 'Tỷ lệ % thiết bị đang dùng và dự phòng', align: 'center' },
      colors: ['#1de9b6', '#04a9f5'],
      legend: { position: 'bottom' },
      plotOptions: {
        pie: {
          donut: { size: '65%' }
        }
      }
    }),
    [labels]
  );
  //===================Biểu đồ theo ngayLap=======================
  /* ============ LẤY DANH SÁCH NĂM ============ */
  const years = useMemo(() => {
    if (!listData.length) return [currentYear];

    const yearSet = new Set(listData.filter((x) => x.ngayLap).map((x) => dayjs(x.ngayLap).year()));

    return Array.from(yearSet).sort((a, b) => b - a);
  }, [listData, currentYear]);

  useEffect(() => {
    if (years.length && !years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  /* ============ DỮ LIỆU THEO THÁNG ============ */
  const monthlyData = useMemo(() => {
    const result = Array(12).fill(0);

    listData.forEach((item) => {
      if (!item.ngayLap) return;

      const date = dayjs(item.ngayLap);
      if (!date.isValid()) return;

      if (date.year() === selectedYear) {
        result[date.month()] += item.soLuong || 1;
      }
    });

    return result;
  }, [listData, selectedYear]);

  /* ============ OPTIONS BIỂU ĐỒ ============ */
  /* ========= OPTIONS ========= */
  const chartOptions = useMemo(
    () => ({
      chart: {
        id: 'thong-ke-theo-thang',
        toolbar: { show: true }
      },
      title: {
        text: `Thống kê theo tháng - Năm ${selectedYear}`,
        align: 'center'
      },
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

  if (loading)
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  if (!labels.length || !series.length) {
    return <Empty description="Không có dữ liệu" />;
  }

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', flexWrap: 'wrap' }}>
      <Card style={{ flex: 1, minWidth: '400px' }}>
        <ChartWrapper>
          <Chart
            ref={barChartRef}
            key="bar-du-phong"
            options={columnOptions}
            series={[{ name: 'Số lượng', data: series }]}
            type="bar"
            height={350}
          />
        </ChartWrapper>
      </Card>

      <Card style={{ flex: 1, minWidth: '400px' }}>
        <ChartWrapper>
          <Chart ref={donutChartRef} key="donut-du-phong" options={donutOptions} series={series} type="donut" height={350} />
        </ChartWrapper>
      </Card>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>📊 Thống kê thiết bị theo tháng/Năm</span>
            <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 120 }}>
              {years.map((y) => (
                <Select.Option key={y} value={y}>
                  {y}
                </Select.Option>
              ))}
            </Select>
          </div>
        }
        style={{ flex: 1, minWidth: '400px' }}
      >
        {monthlyData.some((x) => x > 0) ? (
          <Chart
            ref={monthChartRef}
            key={`chart-${selectedYear}`}
            options={chartOptions}
            series={[{ name: 'Số lượng', data: monthlyData }]}
            type="bar"
            height={350}
          />
        ) : (
          <Empty description="Không có dữ liệu theo năm đã chọn" />
        )}
      </Card>
    </div>
  );
};

export default BackupChart;
