import { motion } from "framer-motion";
import { Trash, Star, EditIcon } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import EditProductModal from "./EditProductModal";
import Search from "./Search";
import { useState } from "react";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products, searchResults } = useProductStore();
	const [editingProduct, setEditingProduct] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Use searchResults if available, otherwise use products
	const displayProducts = searchResults !== null ? searchResults : products;

	const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };
	return (
		<motion.div
			className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<div className="p-4">
				<Search />
			</div>

			<div className="overflow-x-auto">
				{displayProducts.length === 0 ? (
					<div className="text-center text-white py-10 text-lg font-semibold">
						Product not found
					</div>
				) : (
					<table className="min-w-full divide-y divide-gray-700 ">
						<thead className="bg-gray-700">
							<tr>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
								>
									Product
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
								>
									Price
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
								>
									Category
								</th>

								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
								>
									Featured
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
								>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-700">
							{displayProducts.map((product) => (
								<tr key={product._id} className="hover:bg-[#e2e6e7]">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="flex-shrink-0 h-15 w-15">
												<img
													className="h-10 w-10 rounded-full object-cover"
													src={product.image}
													alt={product.name}
												/>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-black">{product.name}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-black">${product.price.toFixed(2)}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-black">{product.category}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<button
											onClick={() => toggleFeaturedProduct(product._id)}
											className={`p-1 rounded-full ${product.isFeatured ? "bg-yellow-300 text-black" : "bg-white text-black"
												} hover:bg-yellow-500 transition-colors duration-200`}
										>
											<Star className="h-5 w-5" />
										</button>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium" >
										<button
											onClick={() => deleteProduct(product._id)}
											className="text-red-500 hover:text-red-400 mr-4"
										>
											<Trash className="h-5 w-5" />
										</button>
										
										{/*your functionality here */}
										<button
											onClick={() => handleEdit(product)}
											className="text-blue-500 hover:text-blue-400 mr-2"
										>
											<EditIcon className="h-5 w-5" />
										</button>

									</td>
								</tr>
							))}
						</tbody>
					</table>

				)}
                      <EditProductModal product={editingProduct} isOpen={isModalOpen} onClose={closeModal} />
			</div>
		</motion.div>
	);
};

export default ProductsList;
