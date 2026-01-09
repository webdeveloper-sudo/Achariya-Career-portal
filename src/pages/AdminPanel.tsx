import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  LogOut,
  UserPlus,
  Search,
  Calendar,
  MapPin,
  Building,
  Filter,
  ArrowLeft,
} from "lucide-react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import { jobService, type JobOpening } from "../services/jobService";
import FeedbackModal from "../components/FeedbackModal";

type DateRange = "all" | "7days" | "30days" | "6months";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "info" | "confirmation";
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Auth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  // Jobs Data State
  const [openings, setOpenings] = useState<JobOpening[]>([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedLoc, setSelectedLoc] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<JobOpening>>({
    category: "Corporate",
    roleTitle: "",
    department: "",
    location: ["Puducherry"],
    center: "",
    experience: "",
    numberOfPositions: "",
    description: "",
    responsibilities: [""],
    qualifications: [""],
    skills: [""],
    eligibility: [""],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadOpenings();
    }
  }, [user]);

  const loadOpenings = async () => {
    try {
      const jobs = await jobService.getAllJobs();
      setOpenings(jobs);
    } catch (error) {
      console.error("Failed to load jobs", error);
    }
  };

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
      const jobLocations = Array.isArray(job.location)
        ? job.location.join(" ")
        : job.location;
      const searchableText = [
        job.roleTitle,
        job.department,
        jobLocations,
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

  const showModal = (
    type: "success" | "error" | "info" | "confirmation",
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    setModalConfig({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
    });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        showModal(
          "success",
          "Welcome!",
          "Account created! You are now logged in."
        );
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      showModal("error", "Authentication Failed", error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const generateApplicationId = () => {
    // AWCE followed by unique 6 digit numbers
    const random = Math.floor(100000 + Math.random() * 900000).toString();
    return `AWCE-${random}`;
  };

  const handleAdd = async () => {
    try {
      const timestamp = new Date().toISOString();
      const cleanLocations =
        formData.location?.filter((l) => l.trim().length > 0) || [];

      const newOpening: Omit<JobOpening, "id"> = {
        applicationId: generateApplicationId(),
        category: formData.category as any,
        roleTitle: formData.roleTitle || "",
        department: formData.department || "",
        location: cleanLocations.length > 0 ? cleanLocations : ["Puducherry"],
        center: formData.center || "",
        experience: formData.experience || "",
        numberOfPositions: formData.numberOfPositions || "",
        description: formData.description || "",
        responsibilities:
          formData.responsibilities?.filter((r) => r.trim()) || [],
        qualifications: formData.qualifications?.filter((q) => q.trim()) || [],
        skills: formData.skills?.filter((s) => s.trim()) || [],
        eligibility: formData.eligibility?.filter((e) => e.trim()) || [],
        datePosted: timestamp,
        lastUpdated: timestamp,
      };
      await jobService.addJob(newOpening);
      await loadOpenings();
      setShowAddForm(false);
      resetForm();
      showModal("success", "Success", "Job opening added successfully.");
    } catch (error) {
      console.error(error);
      showModal("error", "Error", "Failed to add job opening.");
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const cleanLocations =
        formData.location?.filter((l) => l.trim().length > 0) || [];

      const updatedData: Partial<JobOpening> = {
        category: formData.category as any,
        roleTitle: formData.roleTitle || "",
        department: formData.department || "",
        location: cleanLocations.length > 0 ? cleanLocations : ["Puducherry"],
        center: formData.center || "",
        experience: formData.experience || "",
        numberOfPositions: formData.numberOfPositions || "",
        description: formData.description || "",
        responsibilities:
          formData.responsibilities?.filter((r) => r.trim()) || [],
        qualifications: formData.qualifications?.filter((q) => q.trim()) || [],
        skills: formData.skills?.filter((s) => s.trim()) || [],
        eligibility: formData.eligibility?.filter((e) => e.trim()) || [],
        lastUpdated: new Date().toISOString(),
      };
      await jobService.updateJob(editingId, updatedData);
      await loadOpenings();
      setEditingId(null);
      resetForm();
      showModal("success", "Success", "Job opening updated successfully.");
    } catch (error) {
      console.error(error);
      showModal("error", "Error", "Failed to update job opening.");
    }
  };

  const handleDelete = async (id: string) => {
    showModal(
      "confirmation",
      "Delete Opening",
      "Are you sure you want to delete this job opening? This action cannot be undone.",
      async () => {
        try {
          await jobService.deleteJob(id);
          setOpenings((prev) => prev.filter((o) => o.id !== id));
          // Slight delay to allow modal to close/reopen or just show success
          setTimeout(() => {
            showModal("success", "Deleted", "Job opening has been deleted.");
          }, 300);
        } catch (error) {
          showModal("error", "Error", "Failed to delete job.");
        }
      }
    );
  };

  const startEdit = (opening: JobOpening) => {
    setEditingId(opening.id);
    setFormData({
      ...opening,
      location: Array.isArray(opening.location)
        ? opening.location
        : [opening.location || "Puducherry"],
      responsibilities: opening.responsibilities?.length
        ? opening.responsibilities
        : [""],
      qualifications: opening.qualifications?.length
        ? opening.qualifications
        : [""],
      skills: opening.skills?.length ? opening.skills : [""],
      eligibility: opening.eligibility?.length ? opening.eligibility : [""],
    });
  };

  const resetForm = () => {
    setFormData({
      category: "Corporate",
      roleTitle: "",
      department: "",
      location: ["Puducherry"],
      center: "",
      experience: "",
      numberOfPositions: "",
      description: "",
      responsibilities: [""],
      qualifications: [""],
      skills: [""],
      eligibility: [""],
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
        <FeedbackModal
          isOpen={modalConfig.isOpen}
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          onClose={closeModal}
          onConfirm={modalConfig.onConfirm}
        />
        <div className="card max-w-md w-full">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-teal-600 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Admin Panel
            </h1>
            <p className="text-sm text-gray-600">
              {isSignup ? "Create Admin Account" : "Login to Manage Jobs"}
            </p>
          </div>
          <form onSubmit={handleAuth}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={authLoading}
            >
              {authLoading
                ? "Processing..."
                : isSignup
                ? "Create Account"
                : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-teal-600 hover:text-teal-800 flex items-center justify-center mx-auto"
            >
              {isSignup ? (
                "Back to Login"
              ) : (
                <>
                  <UserPlus className="w-3 h-3 mr-1" /> Create One-Time Admin
                  Account
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => navigate("/")}
            className="btn-secondary w-full mt-3"
          >
            Back to Careers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <FeedbackModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
      />
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">
                Manage {openings.length} job openings
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Opening
              </button>
              <button
                onClick={handleLogout}
                className="btn-secondary flex gap-1 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto bg-white/70 px-4 sm:px-6 lg:px-8 py-8">
        {(showAddForm || editingId) && (
          <div className="p-6 mb-6 border border-gray-20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? "Edit Opening" : "Add New Opening"}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="bg-[#FF0000] p-2 text-white rounded-full"
              >
                <X size={20} className=" text-white-400 " />
              </button>
            </div>

            {/* Basic Info */}
            <h3 className="font-semibold text-gray-800 mb-3 border-b pb-1">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="input-field"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as any,
                    })
                  }
                >
                  <option value="School">School</option>
                  <option value="College">College</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Title
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.roleTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, roleTitle: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (One per line)
                </label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={formData.location?.join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: e.target.value.split("\n"),
                    })
                  }
                  placeholder="e.g. Puducherry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Center
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.center}
                  onChange={(e) =>
                    setFormData({ ...formData, center: e.target.value })
                  }
                  placeholder="e.g. Main Campus"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. of Positions
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.numberOfPositions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfPositions: e.target.value,
                    })
                  }
                  placeholder="e.g. 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Required
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  placeholder="e.g. 2-5 Years"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                className="input-field"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Arrays: Qualifications, Skills, Responsibilities, Eligibility */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualifications (one per line)
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={formData.qualifications?.join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      qualifications: e.target.value.split("\n"),
                    })
                  }
                  placeholder="e.g. B.Tech in CS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills (one per line)
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={formData.skills?.join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      skills: e.target.value.split("\n"),
                    })
                  }
                  placeholder="e.g. React.js\nNode.js"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Responsibilities (one per line)
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={formData.responsibilities?.join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      responsibilities: e.target.value.split("\n"),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eligibility & Other Requirements (one per line)
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={formData.eligibility?.join("\n")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eligibility: e.target.value.split("\n"),
                    })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={editingId ? handleUpdate : handleAdd}
                className="btn-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingId ? "Update" : "Add"} Opening
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="border border-gray-400 bg-gray-200 hover:bg-gray-400 flex py-2 px-4 items-center rounded-lg text-gray-900"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search & Filter Toolbar */}

        <Link to="/" className="flex pb-3 items-center gap-2 text-blue-600">
          <ArrowLeft size={18} /> Back To Home
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
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
                <X className="w-4 h-4 mr-1 bg-red" />
                Clear Filters
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 w-full gap-6">
          {filteredOpenings.map((opening) => (
            <div
              key={opening.id}
              className="border border-gray-200  rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-white/70"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className=" gap-2 mb-4 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {opening.roleTitle}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          opening.category === "School"
                            ? "bg-blue-100 text-blue-700"
                            : opening.category === "College"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-teal-100 text-teal-700"
                        }`}
                      >
                        {opening.category}
                      </span>
                      <span className="text-gray-500 text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        ID: {opening.applicationId || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                    <p>
                      <strong>Department:</strong> {opening.department}
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {Array.isArray(opening.location)
                        ? opening.location.join(", ")
                        : opening.location}
                    </p>
                    <p>
                      <strong>Center:</strong> {opening.center || "N/A"}
                    </p>
                    <p>
                      <strong>No.of.Positions:</strong>{" "}
                      {opening.numberOfPositions || "N/A"}
                    </p>
                    <p>
                      <strong>Experience:</strong> {opening.experience || "N/A"}
                    </p>
                    <p>
                      <strong>Posted:</strong>{" "}
                      {opening.datePosted
                        ? new Date(opening.datePosted).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Updated:</strong>{" "}
                      {opening.lastUpdated
                        ? new Date(opening.lastUpdated).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startEdit(opening)}
                    className="p-2 text-teal-600 hover:bg-teal-50 rounded"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(opening.id)}
                    className="p-2 text-white bg-red-600 hover:bg-red-700 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          {openings.length === 0 ? (
            <div className="bg-white/70 rounded-lg p-12 text-center border border-gray-200">
              <p className="text-gray-500 text-lg">
                No job openings yet. Click "Add Opening" to create one.
              </p>
            </div>
          ) : filteredOpenings.length === 0 ? (
            <div className="bg-white/70 rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
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
              <button
                onClick={clearFilters}
                className="btn-primary inline-flex items-center gap-2"
              >
                <X size={16} /> Clear Filters
              </button>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
