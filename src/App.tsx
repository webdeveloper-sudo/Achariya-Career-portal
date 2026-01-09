import { BrowserRouter, Routes, Route } from "react-router-dom";
import CareersHome from "./pages/CareersHome";
import CategoryOpenings from "./pages/CategoryOpenings";
import JobPostFullDetails from "./components/JobPostFullDetails";
import ThankYou from "./pages/ThankYou";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import SubmissionFailure from "./pages/SubmissionFailure";
import "./index.css";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="md:mb-20 lg:mb-[90px]">
        <Navbar />
      </div>
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
        <Route path="/submission-failure" element={<SubmissionFailure />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
