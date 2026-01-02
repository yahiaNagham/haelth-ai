import { NextResponse } from 'next/server'
import {prisma} from '../../../lib/db'

export async function GET() {
  const patients = await prisma.patient.findMany()
  return NextResponse.json(patients)
}
