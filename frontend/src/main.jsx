import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom';
import { BrowserRouter,Navigate,Route,Routes } from 'react-router-dom'

import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { useUserStore } from './stores/useUserStore.js';
import { useCartStore } from './stores/useCartStore.js';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import AdminPage from './pages/AdminPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import CartPage from './pages/CartPage.jsx';
import PurchaseSuccessPage from './pages/PurchaseSuccessPage.jsx';
import PurchaseCancelPage from './pages/PurchaseCancelPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';


const Main = ()=>{
  
    const {user,checkAuth,checkingAuth}=useUserStore();
    const {getCartItems}=useCartStore();

    useEffect(()=>{
      checkAuth()
    }, [checkAuth]);
  
    useEffect(()=>{
     if(!user)return
      getCartItems()
    },[getCartItems,user]);

    if(checkingAuth) return <LoadingSpinner/>

    return(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}>
        <Route index element={<HomePage/>}  />
        <Route path='signup' element={!user ?<SignUpPage/> : <Navigate to="/"/>} />
        <Route path='login' element={!user ?<LoginPage/> : <Navigate to="/"/>} />
        <Route path='secret-dashboard' element={user?.role === "admin" ?<AdminPage/> : <Navigate to="/login"/>} />
        <Route path='category/:category' element={<CategoryPage/>} />
        <Route path='cart' element={user ? <CartPage/> : <Navigate to={"/login"}/>} />
        <Route path='purchase-success' element={user ? <PurchaseSuccessPage/> : <Navigate to={"/login"}/>} />
        <Route path='purchase-cancel' element={user ? <PurchaseCancelPage/> : <Navigate to={"/login"}/>} />
        <Route path='product/:productId' element={<ProductDetailPage />} />
      </Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>
    )
}

createRoot(document.getElementById('root')).render( <Main/>)

