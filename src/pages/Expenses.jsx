import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    // Modal state for editing expense
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        amount: '',
        categoryId: '',
        date: '',
        description: ''
    });

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
    }, []);

    const fetchExpenses = async (searchTerm = search) => {
        try {
            const { data } = await API.get(`/expenses?search=${encodeURIComponent(searchTerm)}`);
            setExpenses(data);
            setLoading(false);
        } catch (error) {
            console.error('Fetch Expenses Error:', error);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await API.get('/categories?level=2');
            setCategories(data);
        } catch (error) {
            console.error('Fetch Categories Error:', error);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchExpenses(search);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this expense?')) {
            try {
                await API.delete(`/expenses/${id}`);
                fetchExpenses();
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete expense');
            }
        }
    };

    const handleEditClick = (item) => {
        setEditingExpense(item);
        const formattedDate = new Date(item.date).toISOString().substring(0, 10);
        setEditFormData({
            title: item.title,
            amount: item.amount,
            categoryId: item.categoryId ? item.categoryId._id : '',
            date: formattedDate,
            description: item.description || ''
        });
        setEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/expenses/${editingExpense._id}`, editFormData);
            setEditModalOpen(false);
            fetchExpenses();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update expense');
        }
    };

    const handleDownloadCSV = () => {
        window.open(`/api/expenses/export/csv?search=${encodeURIComponent(search)}`, '_blank');
    };

    const handleDownloadPDF = () => {
        window.open(`/api/expenses/export/pdf?search=${encodeURIComponent(search)}`, '_blank');
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    };

    return (
        <div>
            <Header />
            <div className="main-container">
                <Sidebar />
                <div className="content">
                    <h1>
                        <i className="fas fa-file-alt"></i> Expense Reports
                    </h1>
                    <hr style={{ marginBottom: '25px' }} />

                    {/* Action Buttons */}
                    <div style={{ marginBottom: '20px' }}>
                        <Link
                            to="/transactions"
                            style={{
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                padding: '10px 16px',
                                textDecoration: 'none',
                                marginRight: '10px',
                                borderRadius: '4px'
                            }}
                        >
                            <i className="fas fa-plus"></i> New Transaction
                        </Link>
                        <button
                            onClick={handleDownloadPDF}
                            style={{
                                backgroundColor: '#FF9800',
                                color: 'white',
                                padding: '10px 16px',
                                border: 'none',
                                marginRight: '10px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            <i className="fas fa-download"></i> Download PDF
                        </button>
                        <button
                            onClick={handleDownloadCSV}
                            style={{
                                backgroundColor: '#FF9800',
                                color: 'white',
                                padding: '10px 16px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            <i className="fas fa-file-csv"></i> Download CSV
                        </button>
                    </div>

                    {/* Table Header & Search */}
                    <div style={{ border: '1px solid #ccc' }}>
                        <div style={{ backgroundColor: '#1E88E5', padding: '12px', color: 'white', fontWeight: 'bold' }}>
                            <i className="fas fa-chart-bar"></i> History of Expenses
                        </div>

                        <form onSubmit={handleSearchSubmit} style={{ padding: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search..."
                                style={{ padding: '6px 10px', width: '200px', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                            <button
                                type="submit"
                                style={{
                                    height: '30px',
                                    padding: '4px 8px',
                                    backgroundColor: '#1E88E5',
                                    color: 'white',
                                    border: 'none',
                                    marginLeft: '6px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                <i className="fas fa-search"></i>
                            </button>
                        </form>

                        {/* Expense Table */}
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f5f5f5' }}>
                                    <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Title</th>
                                    <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Date</th>
                                    <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Category</th>
                                    <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Description</th>
                                    <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Amount</th>
                                    <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading expense records...</td>
                                    </tr>
                                ) : expenses.length > 0 ? (
                                    expenses.map((row) => (
                                        <tr key={row._id}>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center', verticalAlign: 'middle' }}>
                                                {row.title}
                                            </td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center', verticalAlign: 'middle' }}>
                                                {formatDate(row.date)}
                                            </td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center', verticalAlign: 'middle' }}>
                                                {row.categoryId ? row.categoryId.categoryName : 'N/A'}
                                            </td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center', verticalAlign: 'middle' }}>
                                                {row.description}
                                            </td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center', verticalAlign: 'middle' }}>
                                                ₹ {row.amount.toLocaleString()}
                                            </td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center', verticalAlign: 'middle' }}>
                                                <button
                                                    onClick={() => handleEditClick(row)}
                                                    style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '6px', color: '#1E88E5' }}
                                                >
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(row._id)}
                                                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'red' }}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                            No expense records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Edit Modal */}
                    {editModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-card">
                                <div className="modal-header">Edit Expense Record</div>
                                <form onSubmit={handleEditSubmit}>
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                        value={editFormData.title}
                                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                        required
                                    />

                                    <label>Amount</label>
                                    <input
                                        type="number"
                                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                        value={editFormData.amount}
                                        onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                                        required
                                    />

                                    <label>Category</label>
                                    <select
                                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                        value={editFormData.categoryId}
                                        onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })}
                                        required
                                    >
                                        <option value="">-- Select Category --</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.categoryName}
                                            </option>
                                        ))}
                                    </select>

                                    <label>Date</label>
                                    <input
                                        type="date"
                                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                                        value={editFormData.date}
                                        onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                                        required
                                    />

                                    <label>Description</label>
                                    <textarea
                                        style={{ width: '100%', padding: '8px', height: '60px', marginBottom: '15px' }}
                                        value={editFormData.description}
                                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    ></textarea>

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
                                            style={{ padding: '8px 16px', background: '#1E88E5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
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

export default Expenses;
