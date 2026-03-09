import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { meals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mealId = parseInt(id);
    if (isNaN(mealId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await db.delete(meals).where(eq(meals.id, mealId));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/meals/[id]]", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
