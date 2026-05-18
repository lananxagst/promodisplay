import React, { useState, useEffect, useCallback } from 'react';

export default function Carousel({ images }) {
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prev = () => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(next, 4000);
        return () => clearInterval(timer);
    }, [next, images.length]);

    useEffect(() => {
        setCurrent(0);
    }, [images.length]);

    if (images.length === 0) {
        return (
            <div className="carousel-empty">
                <div className="carousel-empty-icon">📷</div>
                <p>No promotions available at the moment</p>
            </div>
        );
    }

    return (
        <div className="carousel">
            <div className="carousel-track" style={{ position: 'absolute', width: '100%', height: '100%' }}>
                {images.map((img, index) => (
                    <div
                        key={img._id}
                        className={`carousel-slide ${index === current ? 'active' : ''}`}
                    >
                        <img
                            src={`${import.meta.env.VITE_API_URL || ''}${img.path}`}
                            alt={img.name}
                            className="carousel-img"
                        />
                    </div>
                ))}
            </div>

            {images.length > 1 && (
                <>
                    <button className="carousel-btn carousel-btn-prev" onClick={prev}>
                        &#8249;
                    </button>
                    <button className="carousel-btn carousel-btn-next" onClick={next}>
                        &#8250;
                    </button>

                    <div className="carousel-dots">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`carousel-dot ${index === current ? 'active' : ''}`}
                                onClick={() => setCurrent(index)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
