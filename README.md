# Achariya Careers Portal - Developer Handoff

## 📦 Project Overview

This is a **standalone Careers Portal** built with React + TypeScript + Vite. It allows:
- Job posting management via Admin Panel
- Public job listings by category (School/College/Corporate)
- Application submission with resume upload
- Google Sheets integration for tracking
- Email notifications to HR

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Account (for Sheets/Drive integration)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Local dev URL:** http://localhost:5173

---

## 📁 Project Structure

```
careers-portal/
├── src/
│   ├── pages/
│   │   ├── CareersHome.tsx        # Landing page with 3 categories
│   │   ├── CategoryOpenings.tsx   # Job listings page
│   │   ├── AdminPanel.tsx         # Admin job management
│   │   └── ThankYou.tsx           # Application confirmation
│   ├── components/
│   │   ├── OpeningCard.tsx        # Expandable job card
│   │   └── ApplyModal.tsx         # Application form modal
│   ├── data/
│   │   └── openings.ts            # Job data (mock + localStorage)
│   ├── services/
│   │   └── applicationService.ts  # Application submission logic
│   ├── App.tsx                    # Main router
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles (Tailwind)
├── public/
│   ├── logo.png                   # Achariya logo
│   └── favicon.ico                # Site favicon
├── google-apps-script.js          # Backend script for Sheets/Drive
├── package.json
├── tailwind.config.js             # Tailwind configuration
├── vite.config.ts                 # Vite configuration
├── netlify.toml                   # Netlify deployment config
└── README.md                      # This file
```

---

## 🔧 Configuration Changes

### 1. Google Apps Script URL

**File:** `src/services/applicationService.ts`  
**Line:** 21

```typescript
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
```

**How to get your URL:**
1. Open Google Sheet for applications
2. Extensions → Apps Script
3. Paste code from `google-apps-script.js`
4. Deploy → New deployment → Web app
5. Set "Who has access" to **"Anyone"**
6. Copy the Web App URL
7. Replace in `applicationService.ts`

### 2. Google Sheet ID

**File:** `google-apps-script.js`  
**Line:** 8

```javascript
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
```

**How to get Sheet ID:**
- From Sheet URL: `https://docs.google.com/spreadsheets/d/[THIS_PART_IS_THE_ID]/edit`

### 3. Google Drive Folder ID

**File:** `google-apps-script.js`  
**Line:** 9

```javascript
const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID_HERE';
```

**How to get Folder ID:**
- From Drive folder URL: `https://drive.google.com/drive/folders/[THIS_PART_IS_THE_ID]`

### 4. HR Email

**File:** `google-apps-script.js`  
**Line:** 10

```javascript
const HR_EMAIL = 'your-hr-email@company.com';
```

### 5. Admin Password

**File:** `src/pages/AdminPanel.tsx`  
**Line:** 5

```typescript
const ADMIN_PASSWORD = 'achariya2025'; // Change this!
```

---

## 📊 Google Sheet Setup

### Required Columns (Row 1)

```
Timestamp | Category | Role | Name | Age | DOB | Email | Phone | 
Previous Company | DOJ | Last Working Date | Notice Period Days | 
Last Working Day | Current CTC | Expected CTC | Resume | Status | Reference ID
```

**18 columns total**

---

## 🎨 Branding Customization

### Colors

**File:** `tailwind.config.js`

```javascript
colors: {
  teal: {
    50: '#f0fdfa',
    // ... change these values
  }
}
```

### Logo

Replace files in `public/`:
- `logo.png` (recommended: 512x512px PNG)
- `favicon.ico`

### Site Title

**File:** `index.html`  
**Line:** 7

```html
<title>Achariya Careers</title>
```

---

## 📱 Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with 3 categories |
| `/school` | School job listings |
| `/college` | College job listings |
| `/corporate` | Corporate job listings |
| `/admin` | Admin panel (password protected) |
| `/thank-you` | Application confirmation |

---

## 🛠 Development Guide

### Adding New Job Categories

1. Update type in `src/data/openings.ts`:
   ```typescript
   category: 'School' | 'College' | 'Corporate' | 'NewCategory';
   ```

2. Add card in `src/pages/CareersHome.tsx`

3. Add route in `src/App.tsx`

### Modifying Application Form

**File:** `src/components/ApplyModal.tsx`

- Add fields in `formData` state (line 25)
- Add form inputs (line 107+)
- Update payload in `applicationService.ts` (line 35)
- Update Google Apps Script to handle new fields

### Changing Email Template

**File:** `google-apps-script.js`  
**Function:** `sendEmailNotification` (line 75)

---

## 🚀 Deployment

### Netlify (Recommended)

1. Push code to GitHub/GitLab
2. Connect to Netlify
3. Build settings:
   ```
   Base directory: (leave empty for standalone, or ./careers-portal if in monorepo)
   Build command: npm install && npm run build
   Publish directory: dist
   ```
4. Deploy!

### Manual Deployment

```bash
npm run build
# Upload 'dist' folder to your hosting
```

---

## 🐛 Troubleshooting

### Build Errors

**Error:** `Parameter 'opening' implicitly has an 'any' type`  
**Fix:** Already fixed in latest version with proper TypeScript annotations

**Error:** `401 Unauthorized` on application submit  
**Fix:** Redeploy Apps Script with "Who has access" = "Anyone"

### Application Not Saving

**Check:**
1. Apps Script URL is correct in `applicationService.ts`
2. Apps Script is deployed and accessible
3. Browser console for errors (F12)
4. Apps Script execution log for errors

### Resume Upload Failing

**Check:**
1. Drive folder ID is correct
2. Drive folder permissions allow file creation
3. File size < 1MB
4. File type is PDF/Word

---

## 📝 Admin Panel

**URL:** `/admin`  
**Default Password:** `achariya2025`

**Features:**
- View all 18 pre-loaded jobs
- Edit existing jobs
- Add new jobs
- Delete jobs
- Changes sync instantly to main site via localStorage

---

## 🔒 Security Notes

**For Production:**
1. Change admin password
2. Implement proper authentication (not just localStorage)
3. Add rate limiting to prevent spam submissions
4. Validate all inputs server-side
5. Use environment variables for sensitive data

---

## 📦 Dependencies

```json
{
  "react": "^19.0.0",
  "react-router-dom": "^7.1.1",
  "lucide-react": "^0.469.0",
  "tailwindcss": "^4.0.0"
}
```

---

## 📞 Support

For questions or issues, contact the development team.

**Built with ❤️ for Achariya**
