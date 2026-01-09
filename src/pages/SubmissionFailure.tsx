import { Link } from "react-router-dom";
import { XCircle, RefreshCw, Home } from "lucide-react";

export default function SubmissionFailure() {
  // const location = useLocation();
  // const state = location.state as { error?: string } | null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 text-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full border border-gray-100 border-t-4 border-t-red-500">
        <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Submission Failed
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          We encountered an error while processing your application. Please Try
          Again Later
        </p>

        {/* {state?.error && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-8 text-left">
            <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1">
              Error Details
            </p>
            <p className="text-sm text-red-700 font-mono break-words">
              {state.error}
            </p>
          </div>
        )} */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center btn-secondary px-6 py-2.5"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center btn-primary px-6 py-2.5 bg-gray-800 hover:bg-gray-900 border-transparent shadow-md"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
