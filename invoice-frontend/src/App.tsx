import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import InvoiceList from './pages/InvoiceList';
import Summary from './pages/Summary';
import CustomerProfile from './pages/CustomerProfile';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<InvoiceList />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/customers/:id" element={<CustomerProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;