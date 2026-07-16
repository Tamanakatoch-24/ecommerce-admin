import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900">ShopEasy</h1>
          <nav className="flex gap-4 text-sm">
            <Link href="/login" className="text-zinc-600 hover:text-zinc-900">
              Log in
            </Link>
            <Link href="/signup" className="text-zinc-600 hover:text-zinc-900">
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="mb-6 text-2xl font-semibold text-zinc-900">
          All Products
        </h2>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:shadow-md"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="text-xs text-zinc-500">{product.category.name}</p>
                <h3 className="mt-1 text-sm font-medium text-zinc-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}