import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProfitLoss = () => {
    const { user } = useAuth();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    const [centerTodayText, setCenterTodayText] = useState('');
    const [centerMonthText, setCenterMonthText] = useState('');
    const [centerOverallText, setCenterOverallText] = useState('');

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const { data } = await API.get('/reports/profit-loss');
            setReport(data);
            setCenterTodayText(`Income\n₹ ${data.today.income.toLocaleString()}`);
            setCenterMonthText(`Income\n₹ ${data.monthly.income.toLocaleString()}`);
            setCenterOverallText(`Income\n₹ ${data.overall.income.toLocaleString()}`);
            setLoading(false);
        } catch (error) {
            console.error('Fetch Profit Loss Error:', error);
            setLoading(false);
        }
    };

    const currencySymbol = user?.currency || '₹';

    const createDoughnutConfig = (income, expense) => ({
        labels: ['Income', 'Expense'],
        datasets: [
            {
                data: [income, expense],
                backgroundColor: ['#1565C0', '#0288D1'],
                hoverOffset: 20,
                borderWidth: 2,
                borderColor: '#fff'
            }
        ]
    });

    const createDoughnutOptions = (defaultIncome, setCenterText) => ({
        responsive: true,
        cutout: '70%',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.label}: ₹${ctx.formattedValue}`
                }
            }
        },
        onHover: (evt, activeEls) => {
            if (activeEls.length > 0) {
                const index = activeEls[0].index;
                const label = index === 0 ? 'Income' : 'Expense';
                const val = index === 0 ? defaultIncome[0] : defaultIncome[1];
                setCenterText(`${label}\n₹ ${val.toLocaleString()}`);
            } else {
                setCenterText(`Income\n₹ ${defaultIncome[0].toLocaleString()}`);
            }
        }
    });

    return (
        <div>
            <Header />
            <div className="main-container">
                <Sidebar />
                <div className="content">
                    <h1>
                        <i className="fas fa-balance-scale"></i> Profit & Loss
                    </h1>
                    <hr style={{ marginBottom: '25px' }} />

                    {loading || !report ? (
                        <p>Loading report data...</p>
                    ) : (
                        <>
                            {/* Summary Cards */}
                            <div className="report-row">
                                <div className="report-box">
                                    <h4>
                                        <i className="fas fa-calendar-day"></i> Daily Report
                                    </h4>
                                    <div className="stat">Total Income : {currencySymbol} {report.today.income.toLocaleString()}</div>
                                    <div className="stat expense">Total Expense : {currencySymbol} {report.today.expense.toLocaleString()}</div>
                                    <div className="stat diff">Income - Expense : {currencySymbol} {report.today.diff.toLocaleString()}</div>
                                </div>

                                <div className="report-box">
                                    <h4>
                                        <i className="fas fa-calendar-alt"></i> Monthly Report
                                    </h4>
                                    <div className="stat">Total Income : {currencySymbol} {report.monthly.income.toLocaleString()}</div>
                                    <div className="stat expense">Total Expense : {currencySymbol} {report.monthly.expense.toLocaleString()}</div>
                                    <div className="stat diff">Income - Expense : {currencySymbol} {report.monthly.diff.toLocaleString()}</div>
                                </div>

                                <div className="report-box">
                                    <h4>
                                        <i className="fas fa-chart-bar"></i> Overall Report
                                    </h4>
                                    <div className="stat">Total Income : {currencySymbol} {report.overall.income.toLocaleString()}</div>
                                    <div className="stat expense">Total Expense : {currencySymbol} {report.overall.expense.toLocaleString()}</div>
                                    <div className="stat diff">Income - Expense : {currencySymbol} {report.overall.diff.toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="charts-container">
                                <div className="chart-box">
                                    <h4>
                                        <i className="fas fa-calendar-day"></i> Daily Report
                                    </h4>
                                    <div style={{ position: 'relative' }}>
                                        <Doughnut
                                            data={createDoughnutConfig(report.today.income, report.today.expense)}
                                            options={createDoughnutOptions([report.today.income, report.today.expense], setCenterTodayText)}
                                        />
                                        <div className="chart-center-text">
                                            {centerTodayText.split('\n').map((line, i) => (
                                                <React.Fragment key={i}>
                                                    {line}
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="chart-box">
                                    <h4>
                                        <i className="fas fa-calendar-alt"></i> Monthly Report
                                    </h4>
                                    <div style={{ position: 'relative' }}>
                                        <Doughnut
                                            data={createDoughnutConfig(report.monthly.income, report.monthly.expense)}
                                            options={createDoughnutOptions([report.monthly.income, report.monthly.expense], setCenterMonthText)}
                                        />
                                        <div className="chart-center-text">
                                            {centerMonthText.split('\n').map((line, i) => (
                                                <React.Fragment key={i}>
                                                    {line}
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="chart-box">
                                    <h4>
                                        <i className="fas fa-chart-pie"></i> Overall Report
                                    </h4>
                                    <div style={{ position: 'relative' }}>
                                        <Doughnut
                                            data={createDoughnutConfig(report.overall.income, report.overall.expense)}
                                            options={createDoughnutOptions([report.overall.income, report.overall.expense], setCenterOverallText)}
                                        />
                                        <div className="chart-center-text">
                                            {centerOverallText.split('\n').map((line, i) => (
                                                <React.Fragment key={i}>
                                                    {line}
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfitLoss;
