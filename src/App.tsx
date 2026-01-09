import { BrowserRouter, Routes, Route } from "react-router-dom";
import CareersHome from "./pages/CareersHome";
import CategoryOpenings from "./pages/CategoryOpenings";
import JobPostFullDetails from "./components/JobPostFullDetails";
import ThankYou from "./pages/ThankYou";
import AdminPanel from "./pages/AdminPanel";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CareersHome />} />
        <Route
          path="/school"
          element={<CategoryOpenings category="School" />}
        />
        <Route
          path="/college"
          element={<CategoryOpenings category="College" />}
        />
        <Route
          path="/corporate"
          element={<CategoryOpenings category="Corporate" />}
        />
        <Route
          path="/:category/:applicationId"
          element={<JobPostFullDetails />}
        />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
