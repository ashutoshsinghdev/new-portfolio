import './App.css'
import Navbar from '../src/components/navBar'
import Hero from './sections/hero'
import About from './sections/about'
import Skills from './sections/skills'
import Projects from './sections/projects'
import Contact from './sections/contact'

function App() {

  return (
    <>
  <Navbar />
  <Hero />
  <About />
  <Skills />
  <Projects />
  <Contact/>
    </>
  )
}

export default App
