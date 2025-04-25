import React from 'react'
import ProductCard from './ProductCard'
import LoadingSpinner from './LoadingSpinner';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from '../lib/axios';

const PeopleAlsoBought = () => {

  const [recommendations, setRecommendations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				const res = await axios.get("/products/recommendations");
				setRecommendations(res.data);
			} catch (error) {
				toast.error(error.response.data.message || "An error occurred while fetching recommendations");
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecommendations();
	}, []);

	if (isLoading) return <LoadingSpinner />;

  return (
    <div className='mt-3'>
      <h3 className='text-2xl font-semibold text-black'>
        People also bought
      </h3>
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {recommendations.map((product)=>(
          <ProductCard key={product._id} product={product}/>
        ))}

      </div>
    </div>
  )
}

export default PeopleAlsoBought
