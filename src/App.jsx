import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './layout/Navbar'
import Footer from './layout/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Departments from './pages/Departments'
import DepartmentDetail from './pages/DepartmentDetail'
import Publications from './pages/Publications'
import Alumni from './pages/Alumni'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"                    element={<Home />} />
            <Route path="/about"               element={<About />} />
            <Route path="/departments"         element={<Departments />} />
            <Route path="/departments/:slug"   element={<DepartmentDetail />} />
            <Route path="/publications"        element={<Publications />} />
            <Route path="/alumni"              element={<Alumni />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
