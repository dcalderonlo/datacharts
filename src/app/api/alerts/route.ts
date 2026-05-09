import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/infrastructure/db/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const alerts = await prisma.priceAlert.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ data: alerts })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { symbol, targetPrice, condition } = await request.json()
  if (!symbol || !targetPrice || !condition) {
    return NextResponse.json({ error: 'symbol, targetPrice and condition are required' }, { status: 400 })
  }
  if (!['above', 'below'].includes(condition)) {
    return NextResponse.json({ error: 'condition must be above or below' }, { status: 400 })
  }
  const alert = await prisma.priceAlert.create({
    data: {
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      targetPrice: Number(targetPrice),
      condition,
    },
  })
  return NextResponse.json({ data: alert }, { status: 201 })
}
