import { NextResponse } from "next/server";
import { getTaxeDataByVille } from "../../lib/taxe-data"; // ou "@/lib/taxe-data" si alias

export async function GET(req) {
  try {
    console.log("[API] /api/versement-tableau appelée !");
    const url = new URL(req.url);
    const ville = url.searchParams.get("ville") || "";
    console.log("[API] Param ville =", ville);

    const data = await getTaxeDataByVille(ville);

    console.log("[API] Nombre de lignes retournées :", data.length);
    return NextResponse.json(data);
  } catch (e) {
    console.error("[API] Erreur route /versement-tableau :", e);
    return NextResponse.json({ error: e.message || "Erreur serveur" }, { status: 500 });
  }
}

