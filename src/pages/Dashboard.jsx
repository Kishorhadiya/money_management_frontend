import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const [centerTodayText, setCenterTodayText] = useState('');
    const [centerMonthText, setCenterMonthText] = useState('');
    const [centerOverallText, setCenterOverallText] = useState('');

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const { data } = await API.get('/dashboard/summary');
            setSummary(data);
            setCenterTodayText(`Income\n₹ ${data.totals.incomeToday.toLocaleString()}`);
            setCenterMonthText(`Income\n₹ ${data.totals.incomeMonth.toLocaleString()}`);
            setCenterOverallText(`Income\n₹ ${data.totals.totalIncome.toLocaleString()}`);
            setLoading(false);
        } catch (error) {
            console.error('Fetch Summary Error:', error);
            setLoading(false);
        }
    };

    const currencySymbol = user?.currency || '₹';

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    };

    const createDoughnutConfig = (income, expense, setCenterText) => ({
        labels: ['Income', 'Expense'],
        datasets: [
            {
                data: [income, expense],
                backgroundColor: ['#1565C0', '#0288D1'],
                borderWidth: 2,
                borderColor: '#fff',
                hoverOffset: 10
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
                        <i className="fas fa-home"></i> Dashboard
                    </h1>
                    <hr style={{ marginBottom: '25px' }} />

                    {loading || !summary ? (
                        <p>Loading dashboard summary...</p>
                    ) : (
                        <>
                            {/* Overview Cards */}
                            <div className="overview-boxes">
                                <div className="box income-month">
                                    <span className="icon">
                                        <i className="fas fa-calendar-alt"></i>
                                    </span>
                                    <div className="amount">{currencySymbol} {summary.totals.incomeMonth.toLocaleString()}</div>
                                    <div className="label">Monthly Income</div>
                                </div>

                                <div className="box expense-month">
                                    <span className="icon">
                                        <i className="fas fa-calendar-alt"></i>
                                    </span>
                                    <div className="amount">{currencySymbol} {summary.totals.expenseMonth.toLocaleString()}</div>
                                    <div className="label">Monthly Expense</div>
                                </div>

                                <div className="box balance">
                                    <span className="icon">
                                        <i className="fas fa-exchange-alt"></i>
                                    </span>
                                    <div className="amount">{currencySymbol} {summary.totals.currentBalance.toLocaleString()}</div>
                                    <div className="label">Current Balance</div>
                                </div>
                            </div>

                            {/* Latest Transactions */}
                            <div className="latest-transactions">
                                <div className="latest-income">
                                    <h2>
                                        <i className="fas fa-pen-nib"></i> Latest 10 Income
                                    </h2>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Date</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {summary.latestIncomes.length > 0 ? (
                                                summary.latestIncomes.map((item) => (
                                                    <tr key={item._id}>
                                                        <td>{item.title}</td>
                                                        <td>{formatDate(item.date)}</td>
                                                        <td>{currencySymbol} {item.amount.toLocaleString()}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3">No income transactions found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="latest-expense">
                                    <h2>
                                        <i className="fas fa-pen-nib"></i> Latest 10 Expense
                                    </h2>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Date</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {summary.latestExpenses.length > 0 ? (
                                                summary.latestExpenses.map((item) => (
                                                    <tr key={item._id}>
                                                        <td>{item.title}</td>
                                                        <td>{formatDate(item.date)}</td>
                                                        <td>{currencySymbol} {item.amount.toLocaleString()}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3">No expense transactions found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Budget Progress Section */}
                            <div className="progress-section" style={{ marginBottom: '30px' }}>
                                <div className="budget-progress">
                                    <h3>
                                        <i className="fas fa-chart-bar"></i> Budget Progress On{' '}
                                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </h3>

                                    {summary.budgetProgress.length > 0 ? (
                                        summary.budgetProgress.map((item) => (
                                            <div key={item._id} style={{ padding: '20px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div style={{ color: '#888', fontWeight: 'bold' }}>
                                                        Budget {currencySymbol} {item.budgetAmount.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div style={{ marginTop: '6px' }}>
                                                    <span
                                                        style={{
                                                            backgroundColor: '#9c27b0',
                                                            color: 'white',
                                                            padding: '4px 10px',
                                                            fontWeight: 'bold',
                                                            fontSize: '13px',
                                                            borderRadius: '3px'
                                                        }}
                                                    >
                                                        {item.categoryName}
                                                    </span>
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: '10px',
                                                        backgroundColor: '#F4A62A',
                                                        color: 'white',
                                                        padding: '12px',
                                                        fontWeight: 'bold',
                                                        borderRadius: '2px'
                                                    }}
                                                >
                                                    Spent: {currencySymbol} {item.spent.toLocaleString()} | Remaining Budget:{' '}
                                                    {currencySymbol} {item.remaining.toLocaleString()}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: '20px', color: '#666' }}>No budget records set for this month.</div>
                                    )}
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
                                            data={createDoughnutConfig(summary.totals.incomeToday, summary.totals.expenseToday, setCenterTodayText)}
                                            options={createDoughnutOptions([summary.totals.incomeToday, summary.totals.expenseToday], setCenterTodayText)}
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
                                            data={createDoughnutConfig(summary.totals.incomeMonth, summary.totals.expenseMonth, setCenterMonthText)}
                                            options={createDoughnutOptions([summary.totals.incomeMonth, summary.totals.expenseMonth], setCenterMonthText)}
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
                                            data={createDoughnutConfig(summary.totals.totalIncome, summary.totals.totalExpense, setCenterOverallText)}
                                            options={createDoughnutOptions([summary.totals.totalIncome, summary.totals.totalExpense], setCenterOverallText)}
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

export default Dashboard;
