import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import toast from "react-hot-toast";
import ModernProductCard from "./ModernProductCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";



const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const componentMounted = useRef(true);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
    toast.success("Added to cart");
  };

  const viewProduct = (productId) => {
    console.log(`Viewing product ${productId}`);
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://fakestoreapi.com/products/");
        if (componentMounted.current) {
          const products = await response.json();
          setData(products);
          setFilter(products);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        if (componentMounted.current) {
          setLoading(false);
        }
      }
    };

    getProducts();

    return () => {
      componentMounted.current = false;
    };
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        {[...Array(8)].map((_, index) => (
          <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div className="card h-100">
              <Skeleton height={250} />
              <div className="card-body">
                <Skeleton height={20} className="mb-2" />
                <Skeleton height={40} className="mb-2" />
                <Skeleton height={30} className="mb-3" />
                <Skeleton height={20} className="mb-4" />
                <Skeleton height={40} />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        {/* Filter Buttons */}
        <div className="col-12 mb-4">
          <div className="text-center">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <button
                className="btn btn-outline-dark btn-sm m-1"
                onClick={() => setFilter(data)}
              >
                All Products
              </button>
              <button
                className="btn btn-outline-dark btn-sm m-1"
                onClick={() => filterProduct("men's clothing")}
              >
                Men's Clothing
              </button>
              <button
                className="btn btn-outline-dark btn-sm m-1"
                onClick={() => filterProduct("women's clothing")}
              >
                Women's Clothing
              </button>
              <button
                className="btn btn-outline-dark btn-sm m-1"
                onClick={() => filterProduct("jewelery")}
              >
                Jewelry
              </button>
              <button
                className="btn btn-outline-dark btn-sm m-1"
                onClick={() => filterProduct("electronics")}
              >
                Electronics
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filter.map((product) => (
          <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
            <ModernProductCard
              product={product}
              onAddToCart={addProduct}
              onViewProduct={viewProduct}
            />
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="bg-light py-5">
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12 text-center mb-4">
            <h2 className="display-5 fw-bold text-dark mb-2">Latest Products</h2>
            <p className="text-muted">Discover our newest collection</p>
            <hr className="w-25 mx-auto" style={{ height: '3px', backgroundColor: '#212529' }} />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </div>
  );
};

export default Products;