import { Link } from 'react-router-dom';

const Navbar = () => {
  // Simple check for if user is logged in
  const isLoggedIn = localStorage.getItem('user');

  return (
    <nav className='bg-base-200'>
      <div className='navbar max-w-6xl mx-auto'>
        <div className='navbar-start'>
          <Link to='/' className='btn btn-ghost text-xl'>
            GPTGenius
          </Link>
        </div>
        <div className='navbar-end'>
          <div className='flex-none'>
            <ul className='menu menu-horizontal px-1'>
              {isLoggedIn ? (
                <li>
                  <Link to='/dashboard'>Dashboard</Link>
                </li>
              ) : (
                <li>
                  <Link to='/login'>Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;