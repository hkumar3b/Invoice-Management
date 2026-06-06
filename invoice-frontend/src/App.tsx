import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InvoiceList from './pages/InvoiceList';
import Summary from './pages/Summary';
import CustomerProfile from './pages/CustomerProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InvoiceList />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/customers/:id" element={<CustomerProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;