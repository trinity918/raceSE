import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className='hero min-h-screen bg-base-200'>
      <div className='hero-content text-center'>
        <div className='max-w-md'>
          <h1 className='text-6xl font-bold text-primary'>CodeRuBoiz</h1>
          <p className='py-6 text-lg leading-loose'>
            CoeRuBoiz
          </p>
          <Link to='/register' className='btn btn-secondary'>
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
