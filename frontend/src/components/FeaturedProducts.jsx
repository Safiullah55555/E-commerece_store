import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';
import React, { useEffect} from 'react'
import { useCartStore } from '../stores/useCartStore';
import { Link } from 'react-router-dom';

const FeaturedProducts = ({ featuredProducts }) => {
    const { addToCart } = useCartStore();

    useEffect(() => {
                const splide = new Splide('.splide', {
            type: 'loop',
            perPage: 1,
            autoplay: true,
            interval: 3000,
            pagination: false,
            arrows: true,
        });

        // Add progress bar functionality
        const bar = splide.root.querySelector('.my-slider-progress-bar');
        splide.on('mounted move', () => {
            const end = splide.Components.Controller.getEnd() + 1;
            const rate = Math.min((splide.index + 1) / end, 1);
            bar.style.width = `${100 * rate}%`;
        });

        splide.mount();

        return () => splide.destroy(); // Cleanup on unmount        
    }, []);
    
    const filteredFeaturedProducts = featuredProducts?.filter((product) => product.isFeatured);

    return (
        <div className="py-1 cursor-pointer">
            <div className="container mx-auto px-4">
                <div className="splide">
                    <div className="splide__track">
                        <ul className="splide__list">
                            {filteredFeaturedProducts?.map((product) => (
                                <li key={product._id} className="splide__slide">
                                    <div className="relative bg-gray-700 bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-[500px]">

                                        <Link to={`/product/${product._id}`}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover cursor-pointer"
                                            />
                                        </Link>

                                        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-50 p-4">
                                            <p className="text-black text-lg font-medium mb-2"
                                                onClick={() => addToCart(product)}
                                            >
                                                ${product.price.toFixed(2)}
                                                <br /> buy now
                                            </p>
                                            
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Progress Bar */}
                    <div className="my-slider-progress">
                        <div className="my-slider-progress-bar"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeaturedProducts