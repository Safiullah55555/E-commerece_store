import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];


const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",
		additionalImages: [],
	});

	const { createProduct, loading } = useProductStore()

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			await createProduct(newProduct)
			setNewProduct({ name: "", description: "", price: "", category: "", image: "" })

		} catch (error) {
			console.log("error creating product", error)
		}

	}
	const handleImageChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			const reader = new FileReader()

			reader.onloadend = () => {
				setNewProduct({ ...newProduct, image: reader.result })
			}
			reader.readAsDataURL(file) //base64 decode/formate.
		}
	}

	const handleAdditionalImagesChange = (e) => {
		const files = Array.from(e.target.files).slice(0, 5); // limit to 5 files
		const readers = files.map((file) => {
			return new Promise((resolve) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result);
				reader.readAsDataURL(file);
			});
		});

		Promise.all(readers).then((images) => {
			setNewProduct((prev) => {
				const combinedImages =  [...(prev.additionalImages || []), ...images];
				// Limit to 5 images max
				return {
					...prev,
					additionalImages: combinedImages.slice(0, 5),
				};
			});
		});
	};
	const handleRemoveAdditionalImage = (indexToRemove) => {
		setNewProduct((prev) => ({
			...prev,
			additionalImages: prev.additionalImages.filter((_, index) => index !== indexToRemove),
		}));
	};


	return (
		<motion.div
			className='bg-white shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-black'>Create New Product</h2>

			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-black'>
						Product Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-[#fed813] focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='description' className='block text-sm font-medium text-black'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fed813] 
						 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='price' className='block text-sm font-medium text-black'>
						Price
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='0.01'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fed813]
						 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='category' className='block text-sm font-medium text-black'>
						Category
					</label>
					<select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-[#fed813] focus:border-emerald-500'
						required
					>
						<option value=''>Select a category</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>

				<div className='mt-1 flex items-center'>
					<input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
					<label
						htmlFor='image'
						className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
					>
						<Upload className='h-5 w-5 inline-block mr-2' />
						Upload Main Image
					</label>
					{newProduct.image && (
						<img
							src={newProduct.image}
							alt="Uploaded preview"
							className="ml-3 h-20 w-20 object-cover rounded-md border border-gray-600"
						/>
					)}
					{/* {newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>} */}
				</div>

				{/* additionalImages */}

				<div className="mt-4">
					<input
						type="file"
						id="additionalImages"
						multiple
						accept="image/*"
						onChange={handleAdditionalImagesChange}
						className="sr-only"
					/>
					<label
						htmlFor="additionalImages"
						className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
					>
						<Upload className="h-5 w-5 inline-block mr-2" />
						Upload Additional Images (up to 5)
					</label>
					<div className="flex gap-2 mt-2">
						{(newProduct.additionalImages || []).map((img, index) => (
							<div key={index} className="relative h-20 w-20 rounded-md border border-gray-600 overflow-hidden">
								<img
									src={img}
									alt={`Additional ${index + 1}`}
									className="h-full w-full object-cover cursor-pointer"
									onClick={() => handleAdditionalImageClick(img)}
								/>
								<button
									type="button"
									onClick={() => handleRemoveAdditionalImage(index)}
									className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-bl-md px-1 text-xs hover:bg-opacity-75"
								>
									×
								</button>
							</div>
						))}
					</div>


				</div>



				<button
					type='submit'
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-black bg-[#fed813] hover:bg-[#febd69]
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
					disabled={loading}
				>
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
							Loading...
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Create Product
						</>
					)}
				</button>


			</form>

		</motion.div>
	)
}

export default CreateProductForm