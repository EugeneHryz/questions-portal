import './sass/custom.scss';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className='page-body'>
      <Outlet />
    </div>
  );
}

export default App;
