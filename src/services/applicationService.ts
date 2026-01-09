interface ApplicationData {
  fullName: string;
  age?: string;
  dob: string;
  email: string;
  phone: string;
  previousCompany: string;
  previousDOJ: string;
  lastWorkingDate: string;
  noticePeriodDays: string;
  lastWorkingDay: string;
  currentCTC: string;
  expectedCTC: string;
  experience: string;
  preferredLocation: string;
  category: string;
  roleTitle: string;
  location: string;
  resume: File;
}

// Updated Web App URL
const APPS_SCRIPT_URL = import.meta.env.VITE_APPSCRIPT_URL;
console.log(APPS_SCRIPT_URL);

export async function submitApplication(
  data: ApplicationData
): Promise<string> {
  // Generate reference ID
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const referenceId = `REF-${dateStr}-${random}`;

  try {
    // Convert resume file to base64
    const resumeBase64 = await fileToBase64(data.resume);

    // Prepare payload - matching exact structure needed by Apps Script
    const payload = {
      referenceId,
      timestamp: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }), // Format for Sheets
      category: data.category || "",
      roleTitle: data.roleTitle || "",
      location: data.location || "",
      fullName: data.fullName || "",
      dob: data.dob || "",
      email: data.email || "",
      phone: data.phone || "",
      previousCompany: data.previousCompany || "",
      previousDOJ: data.previousDOJ || "",
      lastWorkingDate: data.lastWorkingDate || "",
      noticePeriodDays: data.noticePeriodDays || "",
      lastWorkingDay: data.lastWorkingDay || "",
      currentCTC: data.currentCTC || "",
      expectedCTC: data.expectedCTC || "",
      experience: data.experience || "",
      preferredLocation: data.preferredLocation || "",
      resumeFileName: data.resume.name,
      resumeFileType: data.resume.type,
      resumeBase64: resumeBase64,
    };

    // Send to Google Apps Script
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(payload),
    });

    console.log("Application submitted successfully");

    // Store in localStorage for fail-safe
    try {
      const applications = JSON.parse(
        localStorage.getItem("applications") || "[]"
      );
      // Store without base64 to save space
      const { resumeBase64, ...storagePayload } = payload;
      applications.push({
        ...storagePayload,
        savedAt: new Date().toISOString(),
      });
      localStorage.setItem("applications", JSON.stringify(applications));
    } catch (e) {
      console.warn("Failed to save to localStorage backup", e);
    }

    return referenceId;
  } catch (error) {
    console.error("Submission error:", error);
    throw error;
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:application/pdf;base64, prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}
