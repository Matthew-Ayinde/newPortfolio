import { NextRequest, NextResponse } from 'next/server';
import { getAllEmails } from '@/lib/emailStorage';
import fs from 'fs-extra';
import path from 'path';

// API to download the subscribers CSV
export async function GET(request: NextRequest) {
  try {
    const EMAIL_FILE_PATH = path.join(process.cwd(), 'data', 'subscribers.csv');
    
    // Check if file exists
    if (!(await fs.pathExists(EMAIL_FILE_PATH))) {
      return NextResponse.json(
        { error: 'No subscribers yet' },
        { status: 404 }
      );
    }
    
    // Read the CSV file
    const fileContent = await fs.readFile(EMAIL_FILE_PATH, 'utf-8');
    
    // Return as downloadable CSV
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="subscribers.csv"',
      },
    });
  } catch (error) {
    console.error('Error downloading subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to download subscribers' },
      { status: 500 }
    );
  }
}

// API to get subscriber stats
export async function POST(request: NextRequest) {
  try {
    const emails = await getAllEmails();
    
    return NextResponse.json({
      total: emails.length,
      emails: emails,
    });
  } catch (error) {
    console.error('Error getting subscriber stats:', error);
    return NextResponse.json(
      { error: 'Failed to get subscriber stats' },
      { status: 500 }
    );
  }
}
