import { div } from "framer-motion/client";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore.js";
import { useCartStore } from "../stores/useCartStore.js";
import { useEffect } from "react";

const Navbar = () => {
        const {user,logout} = useUserStore()
        const isAdmin = user?.role === "admin"
        const {cart,getCartItems} = useCartStore()

//------------------------------>
        useEffect(() => {
                getCartItems(); //----->UPDATED/Add useEffect to delete everything from cart after purchase success, Fetch the updated cart state
              }, [getCartItems]);
              
             //bg-gray-900.
        return (
                <header className="fixed top-0 left-0 w-full bg-[#232f3f] bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">

                        <div className="container mx-auto px-4 py-3">
                                <div className="flex flex-wrap justify-between items-center">
                                <Link to='/' className='text-2xl font-bold text-white items-center space-x-2 flex'>
                                EcoFashion
                                </Link>

                                <nav className="flex flex-wrap items-center gap-4">
                                        <Link to={"/"} className="text-white hover:text-[#fed813] transition duration-300 ease-in-out">Home</Link>
                                        {user && (
                                                <Link to={"/cart"} className="relative group text-white hover:text-[#febd69] transition duration-300 ease-in-out">
                                                        <ShoppingCart className='inline-block mr-1 group-hover:text-[#febd69]' size={20} />
                                                        <span className="hidden sm:inline">Cart</span>

                                                        {cart.length > 0 && <span className='absolute -top-2 -left-2 bg-[#fed813] text-black rounded-full px-2 py-0.5 
									text-xs group-hover:bg-[#febd69] transition duration-300 ease-in-out'>

                                                                {cart.length}
                                                        </span>}
                                                </Link>
                                        )}
                                        {isAdmin && (
                                                <Link className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center" to={"/secret-dashboard"}>
                                                        <Lock className='inline-block mr-1' size={18} />
                                                        <span className="hidden sm:inline">Dashboard</span>
                                                </Link>
                                        )}
                                        {user ? (
                                                <button className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out' 
                                                onClick={logout}>
                                                       <LogOut size={18} />
                                                       <span className='hidden sm:inline ml-2'>Log Out</span> 
                                                </button>
                                        ) : (
                                                <>
                                                <Link to={"/signup"} className="bg-[#fed813] hover:bg-[#febd69] text-black py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
                                                <UserPlus className="mr-2" size={18}/>
                                                SignUp
                                                </Link>
                                                <Link to={"/login"} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
                                                <LogIn className="mr-2" size={18}/>
                                                Login 
                                                </Link>
                                                </>
                                        )}
                                </nav>
                                </div>
                        </div>
                </header>
        )
}

export default Navbar


