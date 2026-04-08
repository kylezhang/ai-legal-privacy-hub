import { NextResponse } from 'next/server';
import { POLICY_RESOURCES } from '@/lib/policies';

export async function GET() {
  return NextResponse.json(POLICY_RESOURCES);
}
