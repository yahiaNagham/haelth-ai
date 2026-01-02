// app/api/messages/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';  // Assurez-vous que le chemin est correct

export async function GET(req: Request) {
  const url = new URL(req.url);  // Crée un objet URL pour accéder aux paramètres de la requête
  const email = url.searchParams.get("email");  // Récupère l'email des paramètres de l'URL

  // Si l'email n'est pas fourni, retourne une erreur
  if (!email) {
    return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 });
  }

  try {
    // Recherche des messages pour cet email, avec les réponses incluses
    const messages = await db.message.findMany({
      where: { email: email },  // Filtre par email
      include: { reply: true },  // Inclut les réponses (reply)
      orderBy: { createdAt: "desc" },  // Trie par date de création, du plus récent au plus ancien
    });

    console.log(messages);  // Affiche les messages dans la console pour déboguer

    // Retourne les messages avec leurs réponses
    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);  // Affiche l'erreur dans la console
    return NextResponse.json({ error: "فشل في جلب الرسائل" }, { status: 500 });
  }
}
