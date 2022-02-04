import { Router } from 'react-router-dom';
import { history } from '../utils/history';
import Header from '../components/Header';
import Routes from './routes';

function App() {  
  return (
    <div className="relative font-poppins w-full h-full min-h-screen bg-[#DEE2E8] dark:bg-[#000000] transition-all duration-1000">
      <Router history={history}>
        <Header />
        <Routes />
      </Router>
    </div>
  );
}

export default App;
