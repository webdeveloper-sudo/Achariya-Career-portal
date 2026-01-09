import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

export default function ThankYou() {
    const location = useLocation();
    const referenceId = location.state?.referenceId || 'REF-DEMO-0000';
    const candidateName = location.state?.candidateName || 'Candidate';
    const category = location.state?.category || 'General';
    const role = location.state?.role || 'Position';

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
            <div className="card max-w-2xl w-full text-center " style={{boxShadow: '6px 6px 6px 6px rgba(0, 0, 0, 0.1)'}}>
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Application Submitted Successfully!
                </h1>

                <p className="text-lg text-gray-600 mb-6">
                    Thank you, <strong>{candidateName}</strong>. Your application has been received.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-bold text-gray-900 mb-4">Application Summary</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Reference ID:</span>
                            <span className="font-mono font-bold text-teal-600">{referenceId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium text-gray-900">{category}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Position:</span>
                            <span className="font-medium text-gray-900">{role}</span>
                        </div>
                    </div>
                </div>

                {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-900">
                        <FileText className="w-5 h-5 inline mr-2" />
                        You will receive a confirmation email shortly with your application details.
                    </p>
                </div> */}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/" className="btn-primary">
                        <Home className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <Link to="/" className="btn-secondary">
                        Apply to Another Role
                    </Link>
                </div>

                <p className="text-xs text-gray-500 mt-6">
                    Our HR team will review your application and contact you within 5-7 business days.
                </p>
            </div>
        </div>
    );
}
