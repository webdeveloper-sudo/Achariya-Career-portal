import { useNavigate } from "react-router-dom";
import { MapPin, Building } from "lucide-react";
import type { JobOpening } from "../services/jobService";

interface Props {
  openings: JobOpening[];
}

export default function JobOpeningsSection({ openings }: Props) {
  const navigate = useNavigate();

  return (
    <section className="space-y-12 backdrop-blur-sm bg-white/60 p-6 rounded-2xl">
      {/* =====================
          JOB CARDS (GRID VIEW)
      ====================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {openings.map((job) => (
          <button
            key={job.id}
            onClick={() => {
              // Should exist given our new logic, but safe fallback to ID.
              // Ideally this should use applicationId if available, else standard ID
              const identifier = job.applicationId || job.id;
              navigate(`/${job.category}/${identifier}`);
            }}
            className="border border-gray-200 text-left transition-all p-6 rounded-xl flex flex-col h-full hover:border-gray-400 hover:shadow-md"
          >
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {job.roleTitle}
              </h3>

              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
               {
                job.department === '-'|| job.department === '' ? null : (
                  <span className="flex items-center">
                  <Building className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate">{job.department}</span>
                </span>
                ) 
               }
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate">
                    {Array.isArray(job.location)
                      ? job.location.join(", ")
                      : job.location}
                  </span>
                </span>
              </div>

              <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                {job.description}
              </p>
            </div>

            <span className="inline-block text-blue-600 font-semibold text-sm mt-auto">
              View Full Details →
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
