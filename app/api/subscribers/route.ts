import { NextRequest, NextResponse } from 'next/server';
import { getAllEmailsFromDatabase } from '@/lib/emailDatabase';

// API to get subscriber stats
export async function GET(request: NextRequest) {
  try {
    const emails = await getAllEmailsFromDatabase();
    
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
