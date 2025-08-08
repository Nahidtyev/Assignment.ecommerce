import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Footer, Navbar } from "../components";
import ProductCard from "../components/ProductCard"

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loadingMain, setLoadingMain] = useState(false);
  const [loadingSim, setLoadingSim] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;
    (async () => {
      setLoadingMain(true);
      setLoadingSim(true);

      const resp = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await resp.json();
      if (active) setProduct(data);

      const resp2 = await fetch(
        `https://fakestoreapi.com/products/category/${data.category}`
      );
      const sim = await resp2.json();
      if (active) setSimilar(sim.filter(x => x.id !== data.id));

      if (active) {
        setLoadingMain(false);
        setLoadingSim(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  const handleAdd = item => dispatch(addCart(item));

  const Loading = () => (
    <div className="max-w-screen-lg mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <Skeleton className="w-full h-80 rounded-lg" />
      <div className="space-y-4">
        <Skeleton height={30} width={150} />
        <Skeleton height={40} />
        <Skeleton height={30} width={100} />
        <Skeleton height={30} width={120} />
        <Skeleton count={4} />
        <div className="flex space-x-4">
          <Skeleton height={40} width={120} />
          <Skeleton height={40} width={120} />
        </div>
      </div>
    </div>
  );

  const ShowProduct = () => (
    <div className="max-w-screen-lg mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-80 object-contain rounded-lg"
      />
      <div className="space-y-4">
        <h4 className="uppercase text-sm text-gray-500">
          {product.category}
        </h4>
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <div className="flex items-center space-x-2">
          <span className="text-yellow-500">{product.rating?.rate}</span>
          <svg
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="…star path…" />
          </svg>
          <span className="text-gray-400">
            ({product.rating?.count})
          </span>
        </div>
        <p className="text-xl text-indigo-600 font-semibold">
          ${product.price}
        </p>
        <p className="text-gray-700">{product.description}</p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => handleAdd(product)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add to Cart
          </button>
          <Link
            to="/cart"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Go to Cart
          </Link>
        </div>
      </div>
    </div>
  );

  const ShowSimilar = () => (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-4">You may also like</h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {similar.map(item => (
          <div
            key={item.id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
          >
            <ProductCard
              imageUrl={item.image}
              name={item.title}
              price={item.price}
              variants={[]}
              inStock={true}
              onAddToCart={() => handleAdd(item)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      {loadingMain || !product ? <Loading /> : <ShowProduct />}
      {loadingSim ? <Loading /> : <ShowSimilar />}
      <Footer />
    </>
  );
};

export default Product;
