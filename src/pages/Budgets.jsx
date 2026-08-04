import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Budgets = () => {
    const { user } = useAuth();
    const [budgets, setBudgets] = useState([]);
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM

    const [formCategoryId, setFormCategoryId] = useState('');
    const [formAmount, setFormAmount] = useState('');
    const [formDate, setFormDate] = useState(new Date().toISOString().substring(0, 7) + '-01');

    const [message, setMessage] = useState(null);

    // Edit modal
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [editAmount, setEditAmount] = useState('');

    useEffect(() => {
        fetchBudgets(selectedMonth);
        fetchCategories();
    }, [selectedMonth]);

    const fetchBudgets = async (monthStr) => {
        try {
            const { data } = await API.get(`/budgets?month=${monthStr}`);
            setBudgets(data);
        } catch (error) {
            console.error('Fetch Budgets Error:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await API.get('/categories?level=2');
            setExpenseCategories(data);
        } catch (error) {
            console.error('Fetch Categories Error:', error);
        }
    };

    const handleAddBudget = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            await API.post('/budgets', {
                categoryId: formCategoryId,
                amount: Number(formAmount),
                date: formDate
            });
            setMessage({ type: 'success', text: '✅ Budget set successfully.' });
            setFormCategoryId('');
            setFormAmount('');
            fetchBudgets(selectedMonth);
        } catch (error) {
            setMessage({ type: 'error', text: `❌ ${error.response?.data?.message || 'Failed to set budget'}` });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this budget?')) {
            try {
                await API.delete(`/budgets/${id}`);
                setMessage({ type: 'success', text: '✅ Budget deleted successfully.' });
                fetchBudgets(selectedMonth);
            } catch (error) {
                setMessage({ type: 'error', text: `❌ ${error.response?.data?.message || 'Failed to delete budget'}` });
            }
        }
    };

    const handleEditClick = (item) => {
        setEditingBudget(item);
        setEditAmount(item.amount);
        setEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/budgets/${editingBudget._id}`, { amount: Number(editAmount) });
            setEditModalOpen(false);
            setMessage({ type: 'success', text: '✅ Budget updated successfully.' });
            fetchBudgets(selectedMonth);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update budget');
        }
    };

    const currencySymbol = user?.currency || '₹';

    return (
        <div>
            <Header />
            <div className="main-container">
                <Sidebar />
                <div className="content">
                    <h1>
                        <i className="fas fa-wallet"></i> Budget Planning
                    </h1>
                    <hr style={{ marginBottom: '25px' }} />

                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                        {/* Form Card */}
                        <div style={{ flex: '1', minWidth: '320px', background: '#fff', border: '1px solid #4CAF50', borderRadius: '4px', padding: '20px' }}>
                            <h2 style={{ margin: '-20px -20px 20px -20px', background: '#4CAF50', color: 'white', padding: '12px 20px', fontSize: '18px' }}>
                                <i className="fas fa-plus"></i> Set Category Budget
                            </h2>
                            <form onSubmit={handleAddBudget}>
                                <label>Category</label>
                                <select
                                    value={formCategoryId}
                                    onChange={(e) => setFormCategoryId(e.target.value)}
                                    style={{ width: '100%', padding: '8px 10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    required
                                >
                                    <option value="">-- Select Expense Category --</option>
                                    {expenseCategories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </select>

                                <label>Target Month & Year</label>
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => {
                                        setSelectedMonth(e.target.value);
                                        setFormDate(e.target.value + '-01');
                                    }}
                                    style={{ width: '100%', padding: '8px 10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    required
                                />

                                <label>Budget Amount ({currencySymbol})</label>
                                <input
                                    type="number"
                                    value={formAmount}
                                    onChange={(e) => setFormAmount(e.target.value)}
                                    placeholder="Enter Budget Amount"
                                    style={{ width: '100%', padding: '8px 10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    required
                                />

                                <button
                                    type="submit"
                                    style={{ width: '100%', padding: '12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}
                                >
                                    <i className="fas fa-save"></i> Save Budget
                                </button>
                            </form>
                        </div>

                        {/* List Card */}
                        <div style={{ flex: '2', minWidth: '380px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}>
                            <div style={{ background: '#4CAF50', color: 'white', padding: '12px 20px', fontWeight: 'bold', fontSize: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>
                                    <i className="fas fa-list"></i> Budgets for {selectedMonth}
                                </span>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f5f5f5' }}>
                                        <th style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'left' }}>Category</th>
                                        <th style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'left' }}>Budget</th>
                                        <th style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'left' }}>Spent</th>
                                        <th style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'left' }}>Remaining</th>
                                        <th style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {budgets.length > 0 ? (
                                        budgets.map((b) => (
                                            <tr key={b._id}>
                                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                                    {b.categoryId ? b.categoryId.categoryName : 'N/A'}
                                                </td>
                                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                                    {currencySymbol} {b.amount.toLocaleString()}
                                                </td>
                                                <td style={{ padding: '10px', borderBottom: '1px solid #eee', color: '#e53935', fontWeight: 'bold' }}>
                                                    {currencySymbol} {b.spent.toLocaleString()}
                                                </td>
                                                <td style={{ padding: '10px', borderBottom: '1px solid #eee', color: b.remaining < 0 ? 'red' : '#43a047', fontWeight: 'bold' }}>
                                                    {currencySymbol} {b.remaining.toLocaleString()}
                                                </td>
                                                <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => handleEditClick(b)}
                                                        style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '8px', color: '#1E88E5' }}
                                                    >
                                                        <i className="fas fa-pen"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(b._id)}
                                                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'red' }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                                No budget records set for this month.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Edit Modal */}
                    {editModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-card">
                                <div className="modal-header">Edit Budget Amount</div>
                                <form onSubmit={handleEditSubmit}>
                                    <label>Budget Amount ({currencySymbol})</label>
                                    <input
                                        type="number"
                                        style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
                                        value={editAmount}
                                        onChange={(e) => setEditAmount(e.target.value)}
                                        required
                                    />
                                    <div className="modal-actions">
                                        <button
                                            type="button"
                                            onClick={() => setEditModalOpen(false)}
                                            style={{ padding: '8px 16px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Budgets;
