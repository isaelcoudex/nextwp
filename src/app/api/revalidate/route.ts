import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const SECRET = process.env.REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  // Autenticação pelo token secreto (enviado pelo WordPress no header ou query)
  const token =
    req.headers.get("x-revalidate-secret") ??
    req.nextUrl.searchParams.get("secret");

  if (!SECRET || token !== SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // WordPress envia o body com informações sobre o post publicado
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    // body vazio está ok — revalida tudo mesmo assim
  }

  const slug = typeof body.slug === "string" ? body.slug : null;

  // Revalida a página específica do post se tiver slug
  if (slug) {
    revalidatePath(`/posts/${slug}`);
  }

  // Revalida as listagens principais (home, /posts, /category)
  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/category", "layout"); // revalida todas as sub-rotas de /category

  return NextResponse.json({
    revalidated: true,
    slug: slug ?? "all",
    timestamp: new Date().toISOString(),
  });
}

// Permite verificar se a rota está ativa via GET (sem revalidar)
export async function GET() {
  return NextResponse.json({ status: "Webhook de revalidação ativo" });
}
