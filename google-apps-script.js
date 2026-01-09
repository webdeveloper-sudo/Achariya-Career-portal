// Google Apps Script - Deploy this as Web App
// Instructions at end of file

const SHEET_ID = '1gne1jbxhJi_Dk-VNDMQjm06Red71QxhUUGZdzQbKDDo';
const DRIVE_FOLDER_ID = '1M5wZWn-f6ooKUA4TMUt5NIc6UTctjnsv';
const HR_EMAIL = 'savinashshankar@gmail.com';

function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);

        // 1. Upload resume to Google Drive
        const resumeUrl = uploadResumeToDrive(data.resumeBase64, data.resumeFileName, data.resumeFileType);

        // 2. Append to Google Sheet
        appendToSheet(data, resumeUrl);

        // 3. Send email notification
        sendEmailNotification(data, resumeUrl);

        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            referenceId: data.referenceId
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        Logger.log('Error: ' + error.toString());
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

function uploadResumeToDrive(base64Data, fileName, mimeType) {
    try {
        const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
        const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
        const file = folder.createFile(blob);

        // Make file accessible
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        return file.getUrl();
    } catch (error) {
        Logger.log('Drive upload error: ' + error.toString());
        return 'Upload failed';
    }
}

function appendToSheet(data, resumeUrl) {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheets()[0]; // First sheet

    const row = [
        data.timestamp,
        data.category,
        data.roleTitle,
        data.fullName,
        data.age,
        data.dob,
        data.email,
        data.phone,
        data.previousCompany,
        data.previousDOJ,
        data.lastWorkingDate,
        data.noticePeriodDays,
        data.lastWorkingDay || 'N/A',
        data.currentCTC,
        data.expectedCTC,
        resumeUrl,
        'Pending',
        data.referenceId
    ];

    sheet.appendRow(row);
}

function sendEmailNotification(data, resumeUrl) {
    const subject = `New Application Received | ${data.category} | ${data.roleTitle} | ${data.fullName}`;

    const body = `
Hello Team,

A new application has been submitted through the Achariya Careers Portal.

Application Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Category: ${data.category}
Role Applied For: ${data.roleTitle}
Location: ${data.location}

Candidate Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.fullName}
Age: ${data.age}
Date of Birth: ${data.dob}
Email ID: ${data.email}
Phone Number: ${data.phone}

Professional Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Previous Company: ${data.previousCompany}
Date of Joining (Previous Company): ${data.previousDOJ}
Last Working Date: ${data.lastWorkingDate}
Notice Period (Days): ${data.noticePeriodDays}
Last Working Day (if applicable): ${data.lastWorkingDay || 'N/A'}

Compensation Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current CTC: ₹${data.currentCTC} Lakhs
Expected CTC: ₹${data.expectedCTC} Lakhs

Resume:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Resume File Name: ${data.resumeFileName}
Resume Download Link: ${resumeUrl}

System Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Application Reference ID: ${data.referenceId}
Submitted On: ${data.timestamp}

The application has also been recorded in the consolidated HR tracking sheet:
https://docs.google.com/spreadsheets/d/${SHEET_ID}

Please review and take the next steps as per the internal hiring process.

Regards,
Achariya Careers System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated notification. Please do not reply to this email.
  `;

    MailApp.sendEmail({
        to: HR_EMAIL,
        subject: subject,
        body: body
    });
}

// DEPLOYMENT INSTRUCTIONS:
// 1. Open Google Sheets: https://docs.google.com/spreadsheets/d/1gne1jbxhJi_Dk-VNDMQjm06Red71QxhUUGZdzQbKDDo/edit
// 2. Go to Extensions > Apps Script
// 3. Delete any existing code and paste this entire script
// 4. Click "Deploy" > "New deployment"
// 5. Choose "Web app" type
// 6. Set "Execute as" to "Me"
// 7. Set "Who has access" to "Anyone"
// 8. Click "Deploy"
// 9. Copy the Web App URL
// 10. Paste URL in: careers-portal/src/services/applicationService.ts
//     Replace: YOUR_APPS_SCRIPT_WEB_APP_URL_HERE
