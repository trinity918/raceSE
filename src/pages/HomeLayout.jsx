import { Outlet } from 'react-router-dom';
import { Navbar } from '../components';
// Either import Header correctly or remove it

const HomeLayout = () => {
  return (
    <>
      {/* <Header /> - Remove this line if you're not using Header */}
      <Navbar />
      <Outlet />
    </>
  );
};

export default HomeLayout;