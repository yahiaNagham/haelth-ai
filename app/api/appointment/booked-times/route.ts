import { NextApiRequest, NextApiResponse } from "next";
import {prisma} from "../../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { date } = req.query;

  if (!date || typeof date !== "string") {
    return res.status(400).json({ message: "Invalid date" });
  }

  const appointments = await prisma.appointment.findMany({
    where: { date },
    select: { time: true },
  });

  const booked = appointments.map((a) => a.time);
  res.status(200).json({ booked });
}
