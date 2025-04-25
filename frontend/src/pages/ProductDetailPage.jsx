import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../lib/axios';
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
        const { productId } = useParams();
        const [product, setProduct] = useState(null);
        const [mainImage, setMainImage] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        const { user } = useUserStore()
        const { addToCart } = useCartStore()

        useEffect(() => {
                const fetchProduct = async () => {
                        try {
                                const response = await axios.get(`/products/${productId}`);
                                setProduct(response.data);
                        } catch (err) {
                                setError('Failed to load product details.');
                        } finally {
                                setLoading(false);
                        }
                };

                fetchProduct();
        }, [productId]);

        useEffect(() => {
                if (product) {
                        setMainImage(product.image);
                }
        }, [product]);

        const handleAdditionalImageClick = (img) => {
                setMainImage(img);
        };

        if (loading) return <div>Loading product details...</div>;
        if (error) return <div>{error}</div>;
        if (!product) return <div>Product not found.</div>;


        const handleAddToCart = () => {
                if (!user) {
                        toast.error("Please login to add to cart", { id: "login" })
                } else {
                        //add to cart.
                        addToCart(product)
                }
        }

        return (
                <div className="max-w-4xl mx-auto p-6">
                        <h1 className="text-3xl font-bold mb-4 text-black">{product.name}</h1>
                        <div className="flex flex-col md:flex-row gap-6">
                                {mainImage && (
                                        <img
                                                src={mainImage}
                                                alt={product.name}
                                                className="w-full md:w-1/2 rounded-lg object-cover"
                                        />
                                )}
                                <div className="md:w-1/2">
                                        <p className="text-xl font-black mb-2 text-black">${product.price}</p>
                                        <p className="text-gray-700">{product.description}</p>
                                </div>
                        </div>
<br />
                        <button
                                className='flex items-center justify-center rounded-lg bg-[#fed813] px-5 py-2.5 text-center text-sm font-medium
					 text-black hover:bg-[#febd69] focus:outline-none focus:ring-4 focus:ring-emerald-300'
                                onClick={handleAddToCart}
                        >
                                <ShoppingCart size={22} className='mr-2' />
                                Add to cart
                        </button>

                        {/* additionalImages */}
                        {product.additionalImages && product.additionalImages.length > 0 && (
                                <div className="mt-6">
                                        <h3 className="text-xl text-black font-semibold mb-2">Additional Images</h3>
                                        <div className="flex gap-4 overflow-x-auto">
                                                {product.additionalImages.map((img, index) => (
                                                        <img
                                                                key={index}
                                                                src={img}
                                                                alt={`Additional ${index + 1}`}
                                                                className="h-20 w-20 object-cover rounded-md border border-gray-600 cursor-pointer"
                                                                onClick={() => handleAdditionalImageClick(img)}
                                                        />
                                                ))}
                                        </div>
                                </div>
                        )}
                </div>
        );
};

export default ProductDetailPage;
