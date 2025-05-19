import React, { useState, useEffect, useRef } from "react";
import { useProductStore } from "../stores/useProductStore";

const EditProductModal = ({ product, isOpen, onClose }) => {
  const updateProduct = useProductStore((state) => state.updateProduct);
  const [newMainImageFile, setNewMainImageFile] = useState(null);
  const [newAdditionalImageFiles, setNewAdditionalImageFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    additionalImages: [],
  });


  const mainImageInputRef = useRef(null);
  const additionalImagesInputRef = useRef(null);

  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        image: product.image || "",
        category: product.category || "",
        additionalImages: product.additionalImages || [],
      });
      setNewMainImageFile(null);
      setNewAdditionalImageFiles([]);
    }
  }, [product]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewMainImageFile(file);
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewAdditionalImageFiles((prev) => [...prev, ...files]);
  };

  const removeAdditionalImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  console.log("Upload preset:", uploadPreset); // Should print 'ecommerce_unsigned'

const uploadImageToCloudinary = async (file) => {
    

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
   
    return data.secure_url;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  let mainImageUrl = formData.image;
  // Upload new main image if selected
  if (newMainImageFile) {
    mainImageUrl = await uploadImageToCloudinary(newMainImageFile);
  }

  // Start with existing additional images (after any removals)
  let additionalImageUrls = [...formData.additionalImages];

  // Upload new additional images if any
  if (newAdditionalImageFiles.length > 0) {
    const uploadedUrls = await Promise.all(
      newAdditionalImageFiles.map(file => uploadImageToCloudinary(file))
    );
    additionalImageUrls = [...additionalImageUrls, ...uploadedUrls];
  }

  // Filter out null/empty values
  additionalImageUrls = additionalImageUrls.filter(Boolean);

  const updatedData = {
    ...formData,
    image: mainImageUrl,
    additionalImages: additionalImageUrls,
  };

  await updateProduct(product._id, updatedData);
  onClose();
  setNewMainImageFile(null);
  setNewAdditionalImageFiles([]);
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 text-black rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 text-black rounded px-2 py-1"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 text-black rounded px-2 py-1"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Main Image</label>
            <div className="relative inline-block">
              {(newMainImageFile || (formData.image && formData.image !== "")) && (
                <img
                  src={
                    newMainImageFile
                      ? URL.createObjectURL(newMainImageFile)
                      : formData.image
                  }
                  alt="Main"
                  className="mt-2 h-20 w-20 object-cover rounded"
                />
              )}
              <button
                type="button"
                onClick={() => mainImageInputRef.current.click()}
                className="absolute top-0 right-0 bg-gray-700 bg-opacity-75 text-white rounded-full p-1 hover:bg-opacity-100"
                title="Change main image"
              >
                &#9998;
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              ref={mainImageInputRef}
              className="hidden"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Additional Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAdditionalImagesChange}
              ref={additionalImagesInputRef}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => additionalImagesInputRef.current.click()}
              className="mb-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Additional Images
            </button>
            <div className="flex flex-wrap gap-2 mt-2">
{formData.additionalImages.map((url, idx) => (
  <div key={idx} className="relative">
    {url && url !== "" ? (
      <img
        src={url}
        alt={`Additional ${idx}`}
        className="h-20 w-20 object-cover rounded"
      />
    ) : null}
    <button
      type="button"
      onClick={() => removeAdditionalImage(idx)}
      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
      title="Remove image"
    >
      &times;
    </button>
  </div>
))}
              {newAdditionalImageFiles.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`New Additional ${idx}`}
                  className="h-20 w-20 object-cover rounded"
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 text-black rounded px-2 py-1"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
