import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

const IncomeCategories = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [message, setMessage] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await API.get('/categories?level=1');
            setCategories(data);
        } catch (error) {
            console.error('Fetch Categories Error:', error);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            await API.post('/categories', { categoryName, level: 1 });
            setMessage({ type: 'success', text: '✅ Category added successfully.' });
            setCategoryName('');
            fetchCategories();
        } catch (error) {
            setMessage({ type: 'error', text: `❌ ${error.response?.data?.message || 'Failed to add category'}` });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this category?')) {
            try {
                await API.delete(`/categories/${id}`);
                setMessage({ type: 'success', text: '✅ Category deleted successfully.' });
                fetchCategories();
            } catch (error) {
                setMessage({ type: 'error', text: `❌ ${error.response?.data?.message || 'Failed to delete category'}` });
            }
        }
    };

    const handleEditClick = (cat) => {
        setEditingCategory(cat);
        setEditName(cat.categoryName);
        setEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/categories/${editingCategory._id}`, { categoryName: editName });
            setEditModalOpen(false);
            setMessage({ type: 'success', text: '✅ Category updated successfully.' });
            fetchCategories();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update category');
        }
    };

    return (
        <div>
            <Header />
            <div className="main-container">
                <Sidebar />
                <div className="content">
                    <h1>
                        <i className="fas fa-tags"></i> Income Categories
                    </h1>
                    <hr style={{ marginBottom: '25px' }} />

                    {message && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                        {/* Form Card */}
                        <div style={{ flex: '1', minWidth: '300px', background: '#fff', border: '1px solid #1E88E5', borderRadius: '4px', padding: '20px' }}>
                            <h2 style={{ margin: '-20px -20px 20px -20px', background: '#1E88E5', color: 'white', padding: '12px 20px', fontSize: '18px' }}>
                                <i className="fas fa-plus"></i> Add Income Category
                            </h2>
                            <form onSubmit={handleAddCategory}>
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="Enter Category Name"
                                    style={{ width: '100%', padding: '8px 10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    required
                                />
                                <button
                                    type="submit"
                                    style={{ width: '100%', padding: '12px', background: '#43a047', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}
                                >
                                    <i className="fas fa-save"></i> Save Category
                                </button>
                            </form>
                        </div>

                        {/* List Card */}
                        <div style={{ flex: '2', minWidth: '350px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}>
                            <div style={{ background: '#1E88E5', color: 'white', padding: '12px 20px', fontWeight: 'bold', fontSize: '16px' }}>
                                <i className="fas fa-list"></i> Income Categories List
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f5f5f5' }}>
                                        <th style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'left' }}>Category Name</th>
                                        <th style={{ padding: '10px', borderBottom: '1px solid #ccc', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <tr key={cat._id}>
                                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{cat.categoryName}</td>
                                                <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => handleEditClick(cat)}
                                                        style={{ border: 'none', background: 'none', cursor: 'pointer', marginRight: '8px', color: '#1E88E5' }}
                                                    >
                                                        <i className="fas fa-pen"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat._id)}
                                                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'red' }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" style={{ textAlign: 'center', padding: '20px' }}>
                                                No income categories found.
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
                                <div className="modal-header">Edit Income Category</div>
                                <form onSubmit={handleEditSubmit}>
                                    <label>Category Name</label>
                                    <input
                                        type="text"
                                        style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
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

export default IncomeCategories;
