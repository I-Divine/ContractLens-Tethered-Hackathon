import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Home from './Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen app-shell">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<SignIn />} /> {/* Default to sign in */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
