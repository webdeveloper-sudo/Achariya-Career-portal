import { useNavigate } from "react-router-dom";
import { MapPin, Building, BriefcaseBusiness } from "lucide-react";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {job.roleTitle}
                </h3>

                {job.department === "-" || job.department === "" ? null : (
                  <span className="flex items-center text-[12px]  text-gray-600">
                    <Building className="w-3 h-3 mr-1 shrink-0" />
                    <span className="truncate">{job.department}</span>
                  </span>
                )}
              </div>
              {/* {!job.center ||
              job.center.length === 0 ||
              (job.center.length === 1 &&
                (job.center[0] === "-" || job.center[0] === "")) ? null : (
                <p className="text-gray-600 text-[12px] text-gray-600 mb-3">
                  {job.center.join(", ")}
                </p>
              )} */}

              <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate">
                    {Array.isArray(job.location)
                      ? job.location.join(", ")
                      : job.location}
                  </span>
                </span>
                {job.experience === "-" || job.experience === "" ? null : (
                  <span className="flex items-center border-l border-gray-400 ps-3">
                    <BriefcaseBusiness className="w-4 h-4 mr-1 shrink-0" />
                    <span className="truncate">{job.experience}</span>
                  </span>
                )}
              </div>

              {/* <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                {job.description}
              </p> */}
            </div>

            <span className="inline-block text-blue-600 font-semibold text-sm mt-auto">
              Apply Now →
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
