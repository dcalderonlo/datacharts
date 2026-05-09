import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/infrastructure/db/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const watchlist = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
    orderBy: { addedAt: 'desc' },
  })
  return NextResponse.json({ data: watchlist })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { symbol } = await request.json()
  if (!symbol || typeof symbol !== 'string') {
    return NextResponse.json({ error: 'symbol is required' }, { status: 400 })
  }
  try {
    const item = await prisma.watchlist.create({
      data: { userId: session.user.id, symbol: symbol.toUpperCase() },
    })
    return NextResponse.json({ data: item }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Symbol already in watchlist' }, { status: 409 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const symbol = request.nextUrl.searchParams.get('symbol')
  if (!symbol) {
    return NextResponse.json({ error: 'symbol is required' }, { status: 400 })
  }
  await prisma.watchlist.deleteMany({
    where: { userId: session.user.id, symbol: symbol.toUpperCase() },
  })
  return NextResponse.json({ success: true })
}
