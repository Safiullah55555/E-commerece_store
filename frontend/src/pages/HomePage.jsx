import { useEffect } from "react";
import FeaturedProducts from "../components/FeaturedProducts";
import { useProductStore } from "../stores/useProductStore";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import CategorySideBar from "../components/CategorySideBar";
import { Link } from "react-router-dom";

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
]

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading, fetchAllProducts, allProducts } = useProductStore();
  const [groupedProducts, setGroupedProducts] = useState({});
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)

  useEffect(() => {
    fetchFeaturedProducts()
    fetchAllProducts()
  }, [fetchFeaturedProducts, fetchAllProducts])

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  useEffect(() => {
    const grouped = products.reduce((acc, product) => {
      const category = product.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(product);
      return acc;
    }, {});

    // Shuffle products in each category
    Object.keys(grouped).forEach(category => {
      grouped[category] = shuffleArray(grouped[category]);
    });

    setGroupedProducts(grouped);
  }, [products])

  

  return (
    <div className='relative min-h-screen text-white overflow-hidden flex'>
      <button
        className="fixed top-4 left-4 z-20 bg-green-700 text-white px-4 py-2 pt-19 rounded-md hover:bg-green-400 font-bold"
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
      >

        {isSidebarVisible ? "Hide Categories" : "Show Categories"}

      </button>
      {isSidebarVisible && (
        <CategorySideBar categories={categories}
          className={`transition-transform duration-500 ease-in-out ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"
            }`}
          onClose={() => setIsSidebarVisible(false)} />
      )}

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>

        {/* featuredProducts */}
        {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}

        <h1 className='text-center text-5xl sm:text-6xl font-bold text-black mb-4'>
          Welcome to EcoFashion
        </h1>
        <p className='text-center text-xl text-black mb-12'>
          Discover the latest trends in eco-friendly fashion
        </p>

        {/* all Products , this must be there not in any component */}
        <div className="lg:grid-cols-2 xl:grid-cols-2 bg-[#e2e6e7]">
          {Object.keys(groupedProducts).map((categoryName) => (
            <div key={categoryName} className="mt-8">
              <h2 className="text-3xl font-semibold mb-4 pl-2 text-black font-bold">{categoryName.toUpperCase()}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                {
                  groupedProducts[categoryName].slice(0, 8).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                }
              </div>

              <div className="flex justify-end mt-2 pr-2">
                <Link
                  to={`/category/${encodeURIComponent(categoryName)}`}
                  className="text-blue-600 hover:underline"
                >
                  See More
                </Link>
              </div><br />
                <hr className="text-black pb-5 font-bold "/>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage