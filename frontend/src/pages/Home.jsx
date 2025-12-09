import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { getProducts, getUser, toggleLike } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]); const [likedProducts, setLikedProducts] = useState(new Set()); const { user_id } = useUser();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, userRes] = await Promise.all([ getProducts(), getUser(user_id) ]);
                setProducts(productsRes.data); setLikedProducts(new Set(userRes.data.likedProducts));
            } catch (error) { console.error("Failed to fetch data:", error); }
        };
        if (user_id) { fetchData(); }
    }, [user_id]);
    const handleLike = async (asin) => {
        try {
            await toggleLike(user_id, asin);
            setLikedProducts(prevLiked => { const newLiked = new Set(prevLiked); if (newLiked.has(asin)) { newLiked.delete(asin); } else { newLiked.add(asin); } return newLiked; });
        } catch (error) { console.error("Failed to update like status:", error); }
    };
    return (
        <div>
            <h1 className="page-title">All Smartphones</h1>
            <div className="product-grid"> {products.map(product => ( <ProductCard key={product.asin} product={product} isLiked={likedProducts.has(product.asin)} onLike={handleLike} /> ))} </div>
        </div>
    );
};
export default Home;