import React, { useState, useEffect, useRef } from 'react';
import api from '../api';

export default function AdminPage() {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchImages = async () => {
        try {
            const res = await api.get('/api/images');
            setImages(res.data);
        } catch {
            showNotification('Failed to fetch images', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async (files) => {
        const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
        if (imageFiles.length === 0) {
            showNotification('Please select image files only', 'error');
            return;
        }

        setUploading(true);

        for (const file of imageFiles) {
            try {
                const formData = new FormData();
                formData.append('image', file);
                const res = await api.post('/api/images', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setImages((prev) => [res.data, ...prev]);
            } catch {
                showNotification(`Failed to upload ${file.name}`, 'error');
            }
        }

        setUploading(false);
        showNotification(`${imageFiles.length} image(s) uploaded successfully!`);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleToggle = async (id) => {
        try {
            const res = await api.patch(`/api/images/${id}/toggle`);
            setImages((prev) =>
                prev.map((img) => (img._id === id ? res.data : img))
            );
            showNotification(
                res.data.isActive ? 'Image activated' : 'Image deactivated',
                res.data.isActive ? 'success' : 'warning'
            );
        } catch {
            showNotification('Failed to update image status', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        try {
            await api.delete(`/api/images/${id}`);
            setImages((prev) => prev.filter((img) => img._id !== id));
            showNotification('Image deleted');
        } catch {
            showNotification('Failed to delete image', 'error');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleUpload(e.dataTransfer.files);
    };

    return (
        <div className="admin-page">
            {notification && (
                <div className={`notification notification-${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <header className="admin-header">
                <h1 className="admin-title">ADMIN PANEL</h1>
                <p className="admin-subtitle">Manage your promotional images</p>
            </header>

            <main className="admin-main">
                <section className="upload-section">
                    <h2 className="section-title">
                        <span className="section-icon">⬆</span>
                        Upload Images
                    </h2>

                    <div
                        className={`upload-area ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={(e) => handleUpload(e.target.files)}
                        />
                        {uploading ? (
                            <div className="upload-uploading">
                                <div className="spinner"></div>
                                <p>Uploading...</p>
                            </div>
                        ) : (
                            <>
                                <div className="upload-icon">☁</div>
                                <p className="upload-text">Click or drag & drop images here</p>
                                <p className="upload-hint">PNG, JPG, GIF up to 10MB each</p>
                            </>
                        )}
                    </div>
                </section>

                <section className="images-section">
                    <h2 className="section-title">
                        <span className="section-icon">🖼</span>
                        Promotion Images
                        <span className="image-count">
                            {images.filter((i) => i.isActive).length} active / {images.length} total
                        </span>
                    </h2>

                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading images...</p>
                        </div>
                    ) : images.length === 0 ? (
                        <div className="no-images">
                            <p>No images uploaded yet. Upload your first promotion image above.</p>
                        </div>
                    ) : (
                        <div className="image-grid">
                            {images.map((img) => (
                                <div
                                    key={img._id}
                                    className={`image-card ${img.isActive ? 'active' : 'inactive'}`}
                                >
                                    <div className="image-card-thumb">
                                        <img src={`${import.meta.env.VITE_API_URL || ''}${img.path}`} alt={img.name} />
                                        <div className={`status-badge ${img.isActive ? 'badge-active' : 'badge-inactive'}`}>
                                            {img.isActive ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>

                                    <div className="image-card-info">
                                        <p className="image-name" title={img.name}>{img.name}</p>
                                        <p className="image-date">
                                            {new Date(img.uploadDate).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div className="image-card-actions">
                                        <div className="toggle-row">
                                            <span className="toggle-label">
                                                {img.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            <button
                                                className={`toggle-switch ${img.isActive ? 'on' : 'off'}`}
                                                onClick={() => handleToggle(img._id)}
                                                title={img.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                <span className="toggle-thumb" />
                                            </button>
                                        </div>

                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(img._id)}
                                            title="Delete image"
                                        >
                                            🗑 Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
