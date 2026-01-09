# Configuration Guide for Developer

## Quick Configuration Checklist

### ✅ Step 1: Google Apps Script Setup

1. **Create Google Sheet** for tracking applications
   - Add 18 column headers (see main README)
   
2. **Create Google Drive Folder** for resume uploads
   - Note the folder ID from URL

3. **Deploy Apps Script:**
   ```
   - Open Sheet → Extensions → Apps Script
   - Paste code from google-apps-script.js
   - Deploy → New deployment → Web app
   - Execute as: Me
   - Who has access: Anyone ← CRITICAL!
   - Copy Web App URL
   ```

### ✅ Step 2: Update Configuration Files

**File 1: `src/services/applicationService.ts` (line 21)**
```typescript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_URL_HERE/exec';
```

**File 2: `google-apps-script.js` (lines 8-10)**
```javascript
const SHEET_ID = 'your-sheet-id-from-url';
const DRIVE_FOLDER_ID = 'your-drive-folder-id';
const HR_EMAIL = 'hr@yourcompany.com';
```

**File 3: `src/pages/AdminPanel.tsx` (line 5)**
```typescript
const ADMIN_PASSWORD = 'change-this-password';
```

### ✅ Step 3: Test Locally

```bash
npm install
npm run dev
# Visit http://localhost:5173
# Test application submission
# Check email and Sheet
```

### ✅ Step 4: Deploy

```bash
npm run build
# Deploy dist/ folder to your hosting
```

---

## Environment Variables (Optional Enhancement)

For production, consider using environment variables:

**Create `.env` file:**
```
VITE_APPS_SCRIPT_URL=your_url_here
VITE_ADMIN_PASSWORD=your_password_here
```

**Update code to use:**
```typescript
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
```

---

## Testing Checklist

- [ ] Landing page loads with 3 categories
- [ ] Each category shows correct job count
- [ ] Job cards expand/collapse
- [ ] Application form opens
- [ ] All form fields are accessible (scroll works)
- [ ] Resume upload works (PDF/Word, <1MB)
- [ ] Form validation works
- [ ] Application submits successfully
- [ ] Email received with applicant details
- [ ] New row added to Google Sheet
- [ ] Resume uploaded to Google Drive
- [ ] Thank you page shows reference ID
- [ ] Admin panel login works
- [ ] Admin can see 18 pre-loaded jobs
- [ ] Admin can edit existing jobs
- [ ] Admin can add new jobs
- [ ] Changes appear on main site immediately

---

## Common Configuration Errors

### ❌ 401 Unauthorized Error
**Cause:** Apps Script "Who has access" is not set to "Anyone"  
**Fix:** Redeploy Apps Script with correct permissions

### ❌ Resume Not Uploading
**Cause:** Drive folder ID incorrect or permissions issue  
**Fix:** Check folder ID and ensure folder allows file creation

### ❌ Email Not Sending
**Cause:** HR_EMAIL incorrect in Apps Script  
**Fix:** Update HR_EMAIL and redeploy Apps Script

### ❌ Admin Panel Empty
**Cause:** First-time load, localStorage empty  
**Fix:** This is expected! The admin panel auto-loads 18 mock jobs on first login

---

## Production Deployment Tips

1. **Use environment variables** for all configuration
2. **Enable HTTPS** on your hosting
3. **Set up monitoring** for application submissions
4. **Regular backups** of Google Sheet
5. **Test thoroughly** before going live
6. **Change default admin password** immediately
7. **Consider implementing proper authentication** for admin panel

---

**Ready to go! Follow the checklist above step by step.** 🚀
