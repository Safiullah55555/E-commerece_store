import { motion } from "framer-motion";
import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import AnalyticsTab from "../components/AnalyticsTab";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
        { id: "create", label: "Create Product", icon: PlusCircle },
        { id: "products", label: "Products", icon: ShoppingBasket },
        { id: "analytics", label: "Analytics", icon: BarChart },
];
const AdminPage = () => {
        const [activeTab, setActiveTab] = useState("create");

        const { fetchAllProducts } = useProductStore()       
         useEffect(()=>{
                          fetchAllProducts()
                  }, [fetchAllProducts])
                  
        return (
                <div className="min-h-screen relative overflow-hidden">

                <motion.h1
                        className='text-4xl font-bold mb-8 text-gray-600 text-center mt-3'
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                >
                        Admin Dashboard
                </motion.h1>
                <div className="flex flex-col lg:flex-row">
                        <div className="w-full lg:w-1/5 bg-[#e2e6e7] border-2 border-black text-white p-4 lg:h-screen overflow-y-auto">
                                <div className='flex lg:flex-col space-y-4'>
                                        {tabs.map((tab) => (
                                                <button
                                                        key={tab.id}
                                                        onClick={() => setActiveTab(tab.id)}
                                                        className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 mb-2 ${activeTab === tab.id
                                                                        ? "bg-[#fed813] text-black font-bold"
                                                                        : "bg-white text-black hover:bg-[#febd69] "
                                                                }`}
                                                >
                                                        <tab.icon className='mr-2 h-5 w-5' />
                                                        {tab.label}
                                                </button>
                                        ))}
                                </div>
                        </div>

                        <div className="flex-1 p-4 lg:p-8">
                                {activeTab === "create" && <CreateProductForm />}
                                {activeTab === "products" && <ProductsList />}
                                {activeTab === "analytics" && <AnalyticsTab />}
                        </div>
                </div>
        </div>
        )
}

export default AdminPage