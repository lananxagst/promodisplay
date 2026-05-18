import React, { useState, useEffect } from 'react';
import api from '../api';
import Carousel from '../components/Carousel';

export default function CustomerPage() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActiveImages = async () => {
            try {
                const res = await api.get('/api/images/active');
                setImages(res.data);
            } catch (err) {
                setError('Failed to load promotions');
            } finally {
                setLoading(false);
            }
        };

        fetchActiveImages();
    }, []);

    return (
        <div className="customer-page">
            <header className="customer-header">
                <h1 className="promotion-title">PROMOTION</h1>
            </header>

            <main className="customer-main">
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading promotions...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <Carousel images={images} />
                )}
            </main>
        </div>
    );
}
