import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";
import "./Products.css"; // CSS file for flexbox layout

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    const getProducts = async () => {
      setLoading(true);
      try {
        const resp = await fetch("https://fakestoreapi.com/products/");
        const products = await resp.json();
        if (isMounted) {
          setData(products);
          setFilter(products);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    getProducts();
    return () => { isMounted = false; };
  }, []);

  const handleAdd = (p) => {
    dispatch(addCart(p));
    toast.success("Added to cart");
  };

  const categories = [
    { label: "All", key: "all" },
    { label: "Men's", key: "men's clothing" },
    { label: "Women's", key: "women's clothing" },
    { label: "Jewelery", key: "jewelery" },
    { label: "Electronics", key: "electronics" }
  ];

  const filterProduct = (key) =>
    setFilter(key === "all" ? data : data.filter(d => d.category === key));

  return (
    <div className="products-container">
      <h2 className="products-title">Latest Products</h2>

      <div className="products-filters">
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => filterProduct(c.key)}
            className="filter-button"
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="products-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="product-skeleton"
            />
          ))}
        </div>
      ) : (
        <div className="products-grid">
          {filter.map(p => (
            <div key={p.id} className="product-item">
              <ProductCard
                imageUrl={p.image}
                name={p.title}
                price={p.price}
                variants={[]}
                inStock={true}
                onAddToCart={() => handleAdd(p)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
