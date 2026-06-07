import { NextResponse } from 'next/server';
import { getLivePrices } from '@/lib/prices';

export async function GET() {
  const data = await getLivePrices();
  if (!data.prices || Object.keys(data.prices).length === 0) {
    return NextResponse.json({ error: 'Price fetch failed' }, { status: 502 });
  }
  return NextResponse.json(data);
}
