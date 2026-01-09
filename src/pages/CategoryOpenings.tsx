import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Loader,
  Filter,
  Calendar,
  MapPin,
  Building,
  X,
} from "lucide-react";
import { jobService, type JobOpening } from "../services/jobService";
import OpeningCard from "../components/OpeningCard";

interface Props {
  category: "School" | "College" | "Corporate" | "Others";
}

type DateRange = "all" | "7days" | "30days" | "6months";

export default function CategoryOpenings({ category }: Props) {
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedLoc, setSelectedLoc] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");

  useEffect(() => {
    const fetchOpenings = async () => {
      try {
        setLoading(true);
        const allJobs = await jobService.getAllJobs();
        setOpenings(allJobs.filter((job) => job.category === category));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpenings();
  }, [category]);

  // Derived Options for Selects
  const departments = useMemo(() => {
    return Array.from(new Set(openings.map((j) => j.department))).sort();
  }, [openings]);

  const locations = useMemo(() => {
    const allLocs = openings.flatMap((j) =>
      Array.isArray(j.location) ? j.location : [j.location]
    );
    return Array.from(new Set(allLocs)).sort();
  }, [openings]);

  // Comprehensive Filtering Logic
  const filteredOpenings = useMemo(() => {
    return openings.filter((job) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase();
      const searchableText = [
        job.roleTitle,
        job.department,
        job.location,
        job.applicationId,
        job.description,
        ...(job.skills || []),
        ...(job.qualifications || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || searchableText.includes(q);

      // 2. Department Filter
      const matchesDept =
        selectedDept === "all" || job.department === selectedDept;

      // 3. Location Filter
      const matchesLoc =
        selectedLoc === "all" ||
        (Array.isArray(job.location)
          ? job.location.includes(selectedLoc)
          : job.location === selectedLoc);

      // 4. Date Range Filter
      let matchesDate = true;
      if (dateRange !== "all" && job.datePosted) {
        const jobDate = new Date(job.datePosted).getTime();
        const now = Date.now();
        const daysDiff = (now - jobDate) / (1000 * 3600 * 24);

        switch (dateRange) {
          case "7days":
            matchesDate = daysDiff <= 7;
            break;
          case "30days":
            matchesDate = daysDiff <= 30;
            break;
          case "6months":
            matchesDate = daysDiff <= 180;
            break;
        }
      }

      return matchesSearch && matchesDept && matchesLoc && matchesDate;
    });
  }, [openings, searchQuery, selectedDept, selectedLoc, dateRange]);

  const categoryColors = {
    School: "blue-500",
    College: "purple-500",
    Corporate: "teal-500",
    Others: "gray-500",
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDept("all");
    setSelectedLoc("all");
    setDateRange("all");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedDept !== "all" ||
    selectedLoc !== "all" ||
    dateRange !== "all";

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto ">
        <Link
          to="/"
          className="inline-flex items-center ms-5 text-gray-600 hover:text-gray-600 py-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to All Categories
        </Link>
      </div>

      {/* Header */}
      <header
        className={`text-${categoryColors[category]}  max-w-7xl  px-4 mx-auto `}
      >
       <div className="bg-gray-200 p-3 rounded-xl">
         <div className="max-w-7xl mx-auto bg-gray-100  rounded-2xl shadow-lg px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <img
                src="/logo.png"
                alt="Achariya"
                className="h-14 w-14 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {category} Openings
              </h1>
              <p className="text-gray-600/90 text-lg mt-1 font-medium">
                {openings.length} positions available
              </p>
            </div>
          </div>
        </div>
       </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-6">
        {/* Search & Filter Toolbar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-6 mb-4">
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Left: Search Bar (Expanded) */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                Search Jobs
              </label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by role, skill, ID (e.g. AWCE-...), or keyword..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right: Filters */}
            <div className="flex flex-col sm:flex-row gap-4 xl:w-auto">
              {/* Department Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                  Department
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer shadow-sm text-gray-700"
                  >
                    <option value="all">All Departments</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={selectedLoc}
                    onChange={(e) => setSelectedLoc(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer shadow-sm text-gray-700"
                  >
                    <option value="all">All Locations</option>
                    {locations.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Sort/Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                  Posted Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as DateRange)}
                    className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer shadow-sm text-gray-700"
                  >
                    <option value="all">Anytime</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="6months">Last 6 Months</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Summary & Clear */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="text-sm text-gray-500">
                Found{" "}
                <span className="font-bold text-gray-900">
                  {filteredOpenings.length}
                </span>{" "}
                matches based on your filters.
              </div>
              <button
                onClick={clearFilters}
                className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Job Listings Grid */}
        <div className="space-y-6">
          {filteredOpenings.length > 0 ? (
            <OpeningCard openings={filteredOpenings} />
          ) : (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                We couldn't find any positions matching your specific criteria.
                Try adjusting your filters or search terms.
              </p>
              <div className="flex justify-center gap-2 flex-row">
                <Link
                  to={`/`}
                  className="btn-primary flex items-center gap-1 rounded btn py-3 px-6"
                >
                  <ArrowLeft size={16} /> Back
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
