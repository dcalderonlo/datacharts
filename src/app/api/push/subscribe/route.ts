import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/infrastructure/db/prisma'
import webpush from 'web-push'

export const dynamic = 'force-dynamic'

// Lazy init — avoids calling setVapidDetails at module load time (breaks Next build without env vars)
function initWebPush() {
  const subject = process.env.VAPID_SUBJECT ?? 'mailto:admin@datacharts.app'
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  if (!publicKey || !privateKey) {
    throw new Error('VAPID keys are not configured')
  }
  webpush.setVapidDetails(subject, publicKey, privateKey)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { endpoint, keys } = await request.json()
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: 'Invalid subscription payload' }, { status: 400 })
  }

  try {
    initWebPush()
  } catch {
    return NextResponse.json({ error: 'Push notifications not configured' }, { status: 503 })
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: { userId: session.user.id, endpoint, p256dh: keys.p256dh, auth: keys.auth },
    update: { p256dh: keys.p256dh, auth: keys.auth },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { endpoint } = await request.json()
  await prisma.pushSubscription.deleteMany({
    where: { userId: session.user.id, endpoint },
  })
  return NextResponse.json({ success: true })
}
