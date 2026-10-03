import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const expectedSecret = process.env.REVALIDATE_SECRET?.trim();
  const receivedSecret = request.headers.get("x-revalidate-secret")?.trim();

  if (!expectedSecret || receivedSecret !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("promotions");
  revalidatePath("/akcii");

  return Response.json({ revalidated: true });
}
