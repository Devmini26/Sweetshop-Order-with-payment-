import React from "react";
import { useLocation } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import './ReportPage.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ReportPage() {
  const location = useLocation();
  const orders = location.state?.orders || [];

  const getMonthName = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('default', { month: 'long' });
  };

  const sweetItemFrequencyByMonth = orders.reduce((acc, order) => {
    const month = getMonthName(order.Date);
    if (!acc[month]) {
      acc[month] = {};
    }
    acc[month][order.Item] = (acc[month][order.Item] || 0) + order.Qty;
    return acc;
  }, {});

  const months = Object.keys(sweetItemFrequencyByMonth);
  const itemLabels = [...new Set(orders.map(order => order.Item))];

  const sweetItemChartData = {
    labels: itemLabels,
    datasets: months.map((month, index) => ({
      label: month,
      data: itemLabels.map(item => sweetItemFrequencyByMonth[month][item] || 0),
      backgroundColor: `rgba(255, 20, 147, 0.5)`,
      borderColor: `rgba(255, 20, 147, 1)`,
      borderWidth: 1
    }))
  };

  const orderStatusFrequency = orders.reduce((acc, order) => {
    acc[order.OrderStatus] = (acc[order.OrderStatus] || 0) + 1;
    return acc;
  }, {});

  const orderStatusChartData = {
    labels: Object.keys(orderStatusFrequency),
    datasets: [
      {
        label: "Order Status Count",
        data: Object.values(orderStatusFrequency),
        backgroundColor: "rgba(255, 105, 180, 0.5)",
        borderColor: "rgba(255, 105, 180, 1)",
        borderWidth: 1
      }
    ]
  };

  const paymentStatusFrequency = orders.reduce((acc, order) => {
    acc[order.PaymentStatus] = (acc[order.PaymentStatus] || 0) + 1;
    return acc;
  }, {});

  const paymentStatusChartData = {
    labels: Object.keys(paymentStatusFrequency),
    datasets: [
      {
        label: "Payment Status Count",
        data: Object.values(paymentStatusFrequency),
        backgroundColor: "rgba(255, 159, 64, 0.5)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="report-container">
      <div className="sweet-product-chart">
        <h2>Sweet Products Monthly Demand</h2>
        <Bar data={sweetItemChartData} className="chart large-chart" />
      </div>

      <div className="small-charts">
        <div className="chart-container">
          <h2>Order Status</h2>
          <Bar data={orderStatusChartData} className="chart small-chart" />
        </div>

        <div className="chart-container">
          <h2>Payment Status</h2>
          <Bar data={paymentStatusChartData} className="chart small-chart" />
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
