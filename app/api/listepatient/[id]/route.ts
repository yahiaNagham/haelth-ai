import { NextRequest, NextResponse } from 'next/server'
import {prisma} from '../../../../lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const patient = await prisma.patient.findUnique({
    where: { id: Number(params.id) }
  })
  return NextResponse.json(patient)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json()
  const updated = await prisma.patient.update({
    where: { id: Number(params.id) },
    data
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.patient.delete({
    where: { id: Number(params.id) }
  })
  return NextResponse.json({ message: "Deleted" })
}
