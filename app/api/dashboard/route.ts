import { NextResponse } from 'next/server';
 import db from '../../../lib/db';
 import { RowDataPacket } from 'mysql2';

 export async function GET() {
   try {
    const [[{ total }]] = await db.execute<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM patient`);
    const [[{ up }]] = await db.execute<RowDataPacket[]>(`
           SELECT COUNT(*) AS up FROM patient 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
     `);

    const down = 5; // قيمة ثابتة مؤقتًا
     const percentage = ((up - down) / (total || 1)) * 100;

    return NextResponse.json({
       total,
       up,
       down,
       percentage: percentage.toFixed(2),
     });
   } catch (error) {
     console.error("Error fetching patient stats:", error);
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
   }
 }
