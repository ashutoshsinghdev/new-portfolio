import './navBar.css';

function Navbar() {
  const handleClick = (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    // Remove 'active' from whatever element currently has it
    link.parentElement.querySelector('.active')?.classList.remove('active');

    // Add 'active' to the clicked anchor tag
    link.classList.add('active');
  };

  return (
    <nav className="navbar">
      <div className="nav-links" onClick={handleClick}>
        <a href="#home" >Home</a>
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}

//all done

export default Navbar;