import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
        products: [],
        searchResults: null,
        // allProducts:[],
        featuredProducts: [],
        loading: false,

        setProducts: (products) => set({ products }),


        createProduct: async (productData) => {
                set({ loading: true, })
                try {
                        const res = await axios.post("/products", productData)
                        set((prevState) => ({
                                products: [...prevState.products, res.data],
                                loading: false,
                        }))
                } catch (error) {
                        //  if (error.response && error.response.data && error.response.data.error) {
                        //         toast.error(error.response.data.error);
                        //     } else {
                        //         toast.error("An unexpected error occurred");
                        //     }
                        toast.error(error.response.data.error);
                        set({ loading: false })
                }
        },

        fetchAllProducts: async () => {
                set({ loading: true });
                try {
                        const response = await axios.get("/products");
                        set({ products: response.data.products, loading: false });
                } catch (error) {
                        set({ error: "Failed to fetch products", loading: false });
                        toast.error(error.response.data.error || "Failed to fetch products");
                }
        },
        fetchProductsByCategory: async (category) => {
                set({ loading: true });
                try {
                        const response = await axios.get(`/products/category/${category}`);
                        set({ products: response.data.products, loading: false });
                } catch (error) {
                        set({ error: "Failed to fetch products", loading: false });
                        toast.error(error.response.data.error || "Failed to fetch products");
                }
        },
        deleteProduct: async (productId) => {
                set({ loading: true })
                try {
                        await axios.delete(`/products/${productId}`);
                        set((prevProducts) => ({
                                products: prevProducts.products.filter((product) => product._id !== productId),
                                loading: false,
                        }))

                } catch (error) {
                        set({ loading: false });
                        toast.error(error.response.data.error || "Failed to delete product");
                }

        },

        toggleFeaturedProduct: async (productId) => {
                set({ loading: true })
                try {
                        const response = await axios.patch(`/products/${productId}`);
                        //update is featured
                        set((prevProducts) => ({
                                products: prevProducts.products.map((product) =>
                                        product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
                                ),
                                loading: false,
                        }));

                } catch (error) {
                        set({ loading: true })
                        toast.error(error.response.data.error || "Failed to load product");
                }
        },
        updateProduct: async (id, updatedData) => {
                set({ loading: true });
                try {
                        const response = await axios.patch(`/products/${id}/update`, updatedData);
                        set((state) => {
                                const updatedProducts = state.products.map((product) =>
                                        product._id === id ? response.data : product // Use backend response!
                                );
                                return { products: updatedProducts, loading: false };
                        });
                        toast.success("Product updated successfully");
                } catch (error) {
                        set({ loading: false });
                        toast.error(error.response?.data?.error || "Failed to update product");
                }
        },
        fetchFeaturedProducts: async () => {
                set({ loading: true });
                try {
                        const response = await axios.get("/products/featured");
                        set({ featuredProducts: response.data, loading: false });
                } catch (error) {
                        set({ error: "Failed to fetch products", loading: false });
                        console.log("Error fetching featured products:", error);
                }
        },
        searchProducts: async (query) => {
                set({ loading: true });
                try {
                        const response = await axios.get(`/products/search?q=${encodeURIComponent(query)}`);
                        set({ searchResults: response.data.products, loading: false });
                } catch (error) {
                        set({ searchResults: [], loading: false });
                        toast.error(error.response?.data?.error || "Failed to search products");
                }
        },
        clearSearchResults: () => set({ searchResults: null }),



}))




