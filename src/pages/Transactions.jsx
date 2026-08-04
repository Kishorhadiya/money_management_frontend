import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

const Transactions = () => {
    const todayStr = new Date().toISOString().substring(0, 10);

    const [incomeCategories, setIncomeCategories] = useState([]);
    const [expenseCategories, setExpenseCategories] = useState([]);

    const [incomeForm, setIncomeForm] = useState({
        title: '',
        amount: '',
        categoryId: '',
        date: todayStr,
        description: ''
    });

    const [expenseForm, setExpenseForm] = useState({
        title: '',
        amount: '',
        categoryId: '',
        date: todayStr,
        description: ''
    });

    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const resIncome = await API.get('/categories?level=1');
            setIncomeCategories(resIncome.data);

            const resExpense = await API.get('/categories?level=2');
            setExpenseCategories(resExpense.data);
        } catch (error) {
            console.error('Fetch Categories Error:', error);
        }
    };

    const handleIncomeSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (Number(incomeForm.amount) < 0) {
            setMessage({ type: 'error', text: '❌ Amount must be a positive number.' });
            return;
        }

        try {
            await API.post('/incomes', {
                title: incomeForm.title,
                amount: Number(incomeForm.amount),
                categoryId: incomeForm.categoryId,
                date: incomeForm.date,
                description: incomeForm.description
            });

            setMessage({ type: 'success', text: '✅ Income added successfully.' });
            setIncomeForm({
                title: '',
                amount: '',
                categoryId: '',
                date: todayStr,
                description: ''
            });
        } catch (error) {
            setMessage({ type: 'error', text: `❌ ${error.response?.data?.message || 'Failed to add income.'}` });
        }
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (Number(expenseForm.amount) < 0) {
            setMessage({ type: 'error', text: '❌ Amount must be a positive number.' });
            return;
        }

        try {
            await API.post('/expenses', {
                title: expenseForm.title,
                amount: Number(expenseForm.amount),
                categoryId: expenseForm.categoryId,
                date: expenseForm.date,
                description: expenseForm.description
            });

            setMessage({ type: 'success', text: '✅ Expense added successfully.' });
            setExpenseForm({
                title: '',
                amount: '',
                categoryId: '',
                date: todayStr,
                description: ''
            });
        } catch (error) {
            setMessage({ type: 'error', text: `❌ ${error.response?.data?.message || 'Failed to add expense.'}` });
        }
    };

    return (
        <div>
            <Header />
            <div className="main-container">
                <Sidebar />
                <div className="content">
                    <h1>💸 Transaction</h1>
                    <hr style={{ marginBottom: '25px' }} />

                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="form-grid">
                        {/* Expense Form */}
                        <form className="form-box expense" onSubmit={handleExpenseSubmit}>
                            <h2>
                                <i className="fas fa-minus"></i> Expenses
                            </h2>

                            <div className="form-row">
                                <div>
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        value={expenseForm.title}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Amount</label>
                                    <input
                                        type="number"
                                        value={expenseForm.amount}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label>Category</label>
                                <select
                                    value={expenseForm.categoryId}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, categoryId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Category --</option>
                                    {expenseCategories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <label>Date</label>
                            <input
                                type="date"
                                value={expenseForm.date}
                                onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                                required
                            />

                            <label>Description</label>
                            <textarea
                                value={expenseForm.description}
                                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                            ></textarea>

                            <button type="submit" className="submit-btn btn-expense">
                                <i className="fas fa-save"></i> Save Expense
                            </button>
                        </form>

                        {/* Income Form */}
                        <form className="form-box income" onSubmit={handleIncomeSubmit}>
                            <h2>
                                <i className="fas fa-plus"></i> Incomes
                            </h2>

                            <div className="form-row">
                                <div>
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        value={incomeForm.title}
                                        onChange={(e) => setIncomeForm({ ...incomeForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Amount</label>
                                    <input
                                        type="number"
                                        value={incomeForm.amount}
                                        onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label>Category</label>
                                <select
                                    value={incomeForm.categoryId}
                                    onChange={(e) => setIncomeForm({ ...incomeForm, categoryId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select Category --</option>
                                    {incomeCategories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <label>Date</label>
                            <input
                                type="date"
                                value={incomeForm.date}
                                onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
                                required
                            />

                            <label>Description</label>
                            <textarea
                                value={incomeForm.description}
                                onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
                            ></textarea>

                            <button type="submit" className="submit-btn btn-income">
                                <i className="fas fa-save"></i> Save Income
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
