import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const { meta } = await getPost(slug);
    return { title: `${meta.title} · Café Azzurro` };
  } catch {
    return { title: "Café Azzurro" };
  }
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data;
  try {
    data = await getPost(slug);
  } catch {
    notFound();
  }
  const { meta, html } = data!;
  return (
    <main className="container article">
      <p className="post-date">{meta.date}</p>
      <h1>{meta.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      <Link className="back" href="/noticias">
        ← Volver a noticias
      </Link>
    </main>
  );
}
