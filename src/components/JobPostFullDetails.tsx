import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Building, ArrowLeft, Loader, Calendar } from "lucide-react";
import { jobService, type JobOpening } from "../services/jobService";
import ApplyModal from "./ApplyModal";

export default function JobPostFullDetails() {
  // We expect the route to be /:category/:applicationId
  const { applicationId } = useParams<{
    category: string;
    applicationId: string;
  }>();

  const [job, setJob] = useState<JobOpening | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      if (!applicationId) return;
      try {
        setLoading(true);
        // Assuming the URL param is the custom application ID (e.g. AWCE-123456)
        // If it's the firestore ID, we'd use getJobById.
        // Based on user request "navigate the route /seleectedcategory/applicationid",
        // we'll assume it's the custom string.
        let fetchedJob = await jobService.getJobByApplicationId(applicationId);

        // If not found, try fetching by Firestore ID (fallback for legacy/dev data)
        if (!fetchedJob) {
          fetchedJob = await jobService.getJobById(applicationId);
        }

        if (fetchedJob) {
          setJob(fetchedJob);
        } else {
          setError("Job not found.");
        }
      } catch (err) {
        console.error("Failed to load job details", err);
        setError("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-xl text-gray-500">{error || "Job not found"}</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to={`/${job.category.toLowerCase()}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to {job.category} Openings
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono bg-white text-gray-500 px-2 py-1 rounded border border-gray-200 shadow-sm">
                    ID: {job.applicationId || "N/A"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
                      job.category === "School"
                        ? "bg-blue-100 text-blue-700"
                        : job.category === "College"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {job.category}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                  {job.roleTitle}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                  <span className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                    <Building className="w-4 h-4 mr-2" />
                    {job.department}
                  </span>
                  <span className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {Array.isArray(job.location)
                      ? job.location.join(", ")
                      : job.location}
                  </span>
                  <span className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Posted:{" "}
                    {job.datePosted
                      ? new Date(job.datePosted).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowApplyModal(true)}
                className="btn-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-lg px-8 py-3 whitespace-nowrap"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-8 space-y-8">
            {/* Key Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Experience
                </span>
                <span className="text-gray-900 font-medium">
                  {job.experience || "Not Specified"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Openings
                </span>
                <span className="text-gray-900 font-medium">
                  {job.numberOfPositions || "Not Specified"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Center
                </span>
                <span className="text-gray-900 font-medium">
                  {job.center || "Not Specified"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Last Updated
                </span>
                <span className="text-gray-900 font-medium">
                  {job.lastUpdated
                    ? new Date(job.lastUpdated).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            <section className="prose prose-blue max-w-none">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                Job Description
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {job.description}
              </p>
            </section>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Key Responsibilities
                </h3>
                <ul className="grid grid-cols-1 gap-2">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-3 text-blue-500 bg-blue-100 rounded-full p-1 mt-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </span>
                      <span className="text-gray-700">{r}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.skills && job.skills.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {job.qualifications && job.qualifications.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Qualifications
                </h3>
                <ul className="grid grid-cols-1 gap-2">
                  {job.qualifications.map((q, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-3 text-teal-500 bg-teal-100 rounded-full p-1 mt-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </span>
                      <span className="text-gray-700">{q}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.eligibility && job.eligibility.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Eligibility Criteria
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {job.eligibility.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">Interested in this role?</p>
            <button
              onClick={() => setShowApplyModal(true)}
              className="btn-primary text-lg px-12 py-3 shadow-md hover:shadow-lg"
            >
              Apply Application
            </button>
          </div>
        </div>
      </div>

      {showApplyModal && job && (
        <ApplyModal opening={job} onClose={() => setShowApplyModal(false)} />
      )}
    </div>
  );
}
