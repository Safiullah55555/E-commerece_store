import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'
import path from 'path'

// Load .env from the parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// https://vite.dev/config/
export default defineConfig({
  plugins: [
  react(),
  tailwindcss(),
],
server:{
  proxy:{
    "/api":{
      target: "http://localhost:5000",     
    }
  }
},
 define: {
    'import.meta.env.VITE_CLOUDINARY_CLOUD_NAME': JSON.stringify(process.env.VITE_CLOUDINARY_CLOUD_NAME),
    'import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET': JSON.stringify(process.env.VITE_CLOUDINARY_UPLOAD_PRESET),
    // Add more variables here if needed
  }
})

//
// import { defineConfig } from 'vite'
// export default defineConfig({
//   plugins: [
//   ],
// })
//