import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { X, Upload, Loader, AlertTriangle } from "lucide-react";
import type { JobOpening } from "../services/jobService";
import { submitApplication } from "../services/applicationService";
import FeedbackModal from "./FeedbackModal";

interface Props {
  opening: JobOpening;
  onClose: () => void;
}

export default function ApplyModal({ opening, onClose }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

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

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: "",
    phone: "",
    previousCompany: "",
    previousDOJ: "",
    lastWorkingDate: "",
    noticePeriodDays: "",
    lastWorkingDay: "",
    currentCTC: "",
    expectedCTC: "",
    experience: "",
    preferredLocation: "",
    consent: false,
  });

  // Safe location array
  // @ts-ignore
  const openingLocations: string[] = Array.isArray(opening.location)
    ? opening.location
    : [opening.location];

  useEffect(() => {
    // If only one location, select it by default
    if (openingLocations.length === 1) {
      setFormData((prev) => ({
        ...prev,
        preferredLocation: openingLocations[0],
      }));
    }
  }, [opening.id]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        showModal(
          "error",
          "Invalid File Type",
          "Please upload only PDF or Word documents"
        );
        return;
      }
      // Validate file size (1MB = 1048576 bytes)
      if (file.size > 1048576) {
        showModal("error", "File Too Large", "File size must be less than 1MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const validateName = (name: string) => /^[a-zA-Z\s]*$/.test(name);
  const validatePhone = (phone: string) => /^\d{0,10}$/.test(phone);
  const validateNumber = (val: string) => /^\d*$/.test(val);
  const validateExperience = (val: string) => /^\d*\.?\d*$/.test(val);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!resumeFile) {
      showModal("error", "Internal Validation", "Please upload your resume");
      return;
    }

    if (formData.phone.length !== 10) {
      showModal(
        "error",
        "Validation Error",
        "Phone number must be exactly 10 digits"
      );
      return;
    }

    if (!formData.preferredLocation) {
      showModal(
        "error",
        "Validation Error",
        "Please select a preferred location"
      );
      return;
    }

    if (!formData.consent) {
      showModal(
        "error",
        "Consent Required",
        "Please confirm that the details are correct"
      );
      return;
    }

    setLoading(true);

    try {
      const referenceId = await submitApplication({
        ...formData,
        category: opening.category,
        roleTitle: opening.roleTitle,
        location: openingLocations.join(", "),
        resume: resumeFile,
      });

      navigate("/thank-you", {
        state: {
          referenceId,
          candidateName: formData.fullName,
          category: opening.category,
          role: opening.roleTitle,
        },
      });
    } catch (error) {
      console.error("Submission error:", error);

      navigate("/submission-failure", {
        state: {
          error:
            error instanceof Error
              ? error.message
              : "Application submission failed",
        },
      });
    }
  };

  return (
    <>
      {modalConfig.isOpen && (
        <FeedbackModal
          isOpen={modalConfig.isOpen}
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          onClose={closeModal}
          onConfirm={modalConfig.onConfirm}
        />
      )}

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col relative">
          <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6 rounded-t-lg">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              Apply for Position
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {opening.roleTitle} • {opening.category} •{" "}
              {openingLocations.join(", ")}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  className="input-field"
                  value={formData.fullName}
                  onChange={(e) => {
                    if (validateName(e.target.value)) {
                      setFormData({ ...formData, fullName: e.target.value });
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="youremail@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  className="input-field"
                  placeholder="10-digit mobile"
                  value={formData.phone}
                  onChange={(e) => {
                    if (validatePhone(e.target.value)) {
                      setFormData({ ...formData, phone: e.target.value });
                    }
                  }}
                />
              </div>
            </div>

            {/* Employment History */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Employment History
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Experience (In Years){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.experience}
                    placeholder="e.g. 2"
                    onChange={(e) => {
                      if (validateExperience(e.target.value)) {
                        setFormData({
                          ...formData,
                          experience: e.target.value,
                        });
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Previous Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your Most Recent Company"
                    required
                    className="input-field"
                    value={formData.previousCompany}
                    onChange={(e) => {
                      if (validateName(e.target.value)) {
                        setFormData({
                          ...formData,
                          previousCompany: e.target.value,
                        });
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Joining (Previous Company){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={formData.previousDOJ}
                    onChange={(e) =>
                      setFormData({ ...formData, previousDOJ: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Working Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={formData.lastWorkingDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lastWorkingDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notice Period (Days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15"
                    min="0"
                    className="input-field"
                    value={formData.noticePeriodDays}
                    onChange={(e) => {
                      if (validateNumber(e.target.value)) {
                        setFormData({
                          ...formData,
                          noticePeriodDays: e.target.value,
                        });
                      }
                    }}
                  />
                </div>
                {/* {parseInt(formData.noticePeriodDays || "0") > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Working Day
                    </label>
                    <input
                      type="date"
                      className="input-field"
                      value={formData.lastWorkingDay}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastWorkingDay: e.target.value,
                        })
                      }
                    />
                  </div>
                )} */}
              </div>
            </div>

            {/* Compensation & Preference */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Compensation & Preference
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current CTC (in ₹ Lakhs){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="e.g. 2.5"
                    min="0"
                    className="input-field"
                    value={formData.currentCTC}
                    onChange={(e) =>
                      setFormData({ ...formData, currentCTC: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected CTC (in ₹ Lakhs){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="e.g. 2.5"
                    min="0"
                    className="input-field"
                    value={formData.expectedCTC}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedCTC: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.preferredLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredLocation: e.target.value,
                      })
                    }
                    disabled={openingLocations.length === 1}
                  >
                    <option value="">Select Location</option>
                    {openingLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-bold text-gray-900 mb-4">Resume Upload</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Resume (PDF or Word, max 1MB){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="btn-secondary cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {resumeFile && (
                    <span className="text-sm text-green-600 flex items-center">
                      ✓ {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)}{" "}
                      KB)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="border-t border-gray-200 pt-6">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1"
                  checked={formData.consent}
                  onChange={(e) =>
                    setFormData({ ...formData, consent: e.target.checked })
                  }
                />
                <span className="text-sm text-gray-700">
                  I confirm that the above details are correct and I agree to be
                  contacted by Achariya HR team regarding this application.
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
            {loading && (
              <div className="flex gap-2 p-3 max-w-[80%] ms-auto justify-end border-b border-yellow-500 bg-yellow-50 pt-2">
                <AlertTriangle size={20} className="text-yellow-500"/>
                <p className="text-end text-sm text-gray-800 capitalize">
                Please Don't Refresh Or Leave the tab while submitting Your
                Application !
              </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
