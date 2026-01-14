import React, { useMemo, useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Card, Spin, Empty, Select, Row } from 'antd';
import dayjs from 'dayjs';
import { useCapnhatgiacotStore } from '/src/stores/giacot/capnhatgiacotStore';
import { useDanhmucgiacotStore } from '/src/stores/giacot/danhmucgiacotStore';
import { useDonviStore } from '/src/stores/donvi/donviStore';
const GiacotChart = () => {
  const [filterDonVi, setFilterDonVi] = useState(null); // null nghĩa là chọn "Tất cả"
  const { dataCapnhatgiacot, fetchCapnhatgiacot } = useCapnhatgiacotStore();
  const { dataDanhmucgiacot, fetchDanhmucgiacot } = useDanhmucgiacotStore();
  const { dataDonvi, fetchDonvi } = useDonviStore();
  useEffect(() => {
    fetchCapnhatgiacot();
    fetchDanhmucgiacot();
    fetchDonvi();
  }, []);

  const donViOptions = useMemo(() => {
    return (
      dataDonvi?.map((dv) => ({
        label: dv.tenPhong,
        value: Number(dv.id) // 🔥 CỰC KỲ QUAN TRỌNG
      })) || []
    );
  }, [dataDonvi]);
  // ================= XỬ LÝ DỮ LIỆU BIỂU ĐỒ (SUM) =================
  const chartData = useMemo(() => {
    // 1. Lọc dữ liệu theo đơn vị nếu có chọn filter
    const filteredSource = filterDonVi
      ? dataCapnhatgiacot.filter((item) => Number(item.donViId) === Number(filterDonVi))
      : dataCapnhatgiacot;

    // 2. Tính SUM theo loaiThietBiId
    const sumData = filteredSource.reduce((acc, item) => {
      const typeId = item.loaiThietBiId;
      const quantity = Number(item.soLuongDangQuanLy) || 0;
      acc[typeId] = (acc[typeId] || 0) + quantity;
      return acc;
    }, {});

    // 3. Chuẩn bị Categories (Tên loại thiết bị) và Data
    const categories = Object.keys(sumData).map((id) => {
      const category = dataDanhmucgiacot.find((d) => String(d.loaiThietBiId) === String(id));
      return category ? category.tenLoai : `Loại ${id}`;
    });

    const seriesData = Object.values(sumData);

    // Lấy tên đơn vị đang lọc để hiển thị tiêu đề (nếu có)
    const selectedDonViName = dataDonvi.find((d) => Number(d.id) === Number(filterDonVi))?.tenPhong || 'Tất cả đơn vị';

    return {
      series: [{ name: 'Tổng số lượng', data: seriesData }],
      options: {
        chart: { type: 'bar', height: 350 },
        plotOptions: {
          bar: { borderRadius: 4, distributed: true, dataLabels: { position: 'top' } }
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => val.toLocaleString(),
          offsetY: -20,
          style: { colors: ['#333'] }
        },
        xaxis: { categories: categories },
        title: {
          text: `TỔNG HỢP THIẾT BỊ - ${selectedDonViName.toUpperCase()}`,
          align: 'center',
          style: { fontSize: '16px', color: '#1890ff' }
        },
        tooltip: { y: { formatter: (val) => `${val} thiết bị` } }
      }
    };
  }, [dataCapnhatgiacot, dataDanhmucgiacot, filterDonVi, dataDonvi]);
  return (
    <div style={{ marginBottom: 24, padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      {/* Bộ lọc đơn vị cho biểu đồ */}
      <Row align="middle" gutter={16} style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 'bold', marginLeft: 10 }}>Lọc theo đơn vị: </span>
        <Select
          style={{ width: 250 }}
          placeholder="Chọn đơn vị để xem báo cáo"
          allowClear
          onChange={(value) => setFilterDonVi(value)}
          options={[{ label: '--- Tất cả đơn vị ---', value: null }, ...donViOptions]}
        />
      </Row>

      {/* Hiển thị biểu đồ */}
      {chartData.series[0].data.length > 0 ? (
        <Chart options={chartData.options} series={chartData.series} type="bar" height={300} />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>Không có dữ liệu thiết bị cho đơn vị này</div>
      )}
    </div>
  );
};

export default GiacotChart;
