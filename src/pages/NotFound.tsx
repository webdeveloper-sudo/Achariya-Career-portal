import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 text-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full border border-gray-100 transform transition-all hover:scale-[1.01]">
        <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>

        <Link
          to="/"
          className="inline-flex items-center btn-primary px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="mt-8 text-gray-400 text-sm">
        © {new Date().getFullYear()} Achariya Group. All rights reserved.
      </div>
    </div>
  );
}
