import { Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import { Toaster } from "react-hot-toast"
import { useUserStore } from "./stores/useUserStore"


function App() {
  return (
    <div className="min-h-screen bg-[#e2e6e7] text-white">

      {/* Background gradient */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse at top, rgba(255, 223, 128, 0.4) 0%, rgba(255, 183, 77, 0.3) 45%, rgba(204, 153, 0, 0.2) 100%)]' />
				</div>
			</div>

      <div className="relative z-50 pt-20">
        <Navbar/>
        <Outlet />
      </div>
      <Toaster/>
    </div>
  )
}

export default App;


