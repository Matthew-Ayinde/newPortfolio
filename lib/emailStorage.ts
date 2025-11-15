import fs from 'fs-extra';
import path from 'path';

const EMAIL_FILE_PATH = path.join(process.cwd(), 'data', 'subscribers.csv');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  await fs.ensureDir(dataDir);
}

// Read existing emails from CSV
export async function getExistingEmails(): Promise<string[]> {
  try {
    await ensureDataDir();
    
    if (await fs.pathExists(EMAIL_FILE_PATH)) {
      const content = await fs.readFile(EMAIL_FILE_PATH, 'utf-8');
      const lines = content.trim().split('\n');
      
      // Skip header row and extract emails
      if (lines.length > 1) {
        return lines.slice(1).map((line: string) => {
          const [email] = line.split(',');
          return email.trim();
        });
      }
    }
    return [];
  } catch (error) {
    console.error('Error reading emails:', error);
    return [];
  }
}

// Save email to CSV (with duplicate check)
export async function saveEmailToCSV(email: string, source: 'popup' | 'contact'): Promise<boolean> {
  try {
    await ensureDataDir();
    
    // Get existing emails
    const existingEmails = await getExistingEmails();
    
    // Check for duplicate
    if (existingEmails.includes(email.toLowerCase())) {
      console.log(`Email already exists: ${email}`);
      return false; // Email already exists
    }
    
    const timestamp = new Date().toISOString();
    const newRow = `${email},${timestamp},${source}\n`;
    
    // If file doesn't exist, add header
    if (!(await fs.pathExists(EMAIL_FILE_PATH))) {
      const header = 'Email,Timestamp,Source\n';
      await fs.writeFile(EMAIL_FILE_PATH, header);
    }
    
    // Append new email
    await fs.appendFile(EMAIL_FILE_PATH, newRow);
    console.log(`✅ Email saved to CSV: ${email}`);
    return true;
  } catch (error) {
    console.error('Error saving email to CSV:', error);
    throw error;
  }
}

// Get all emails (useful for exporting)
export async function getAllEmails(): Promise<Array<{email: string, timestamp: string, source: string}>> {
  try {
    await ensureDataDir();
    
    if (await fs.pathExists(EMAIL_FILE_PATH)) {
      const content = await fs.readFile(EMAIL_FILE_PATH, 'utf-8');
      const lines = content.trim().split('\n');
      
      if (lines.length > 1) {
        return lines.slice(1).map((line: string) => {
          const [email, timestamp, source] = line.split(',');
          return {
            email: email.trim(),
            timestamp: timestamp.trim(),
            source: source.trim()
          };
        });
      }
    }
    return [];
  } catch (error) {
    console.error('Error getting all emails:', error);
    return [];
  }
}
