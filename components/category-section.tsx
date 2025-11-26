import { ProductCard } from "./product-card";
import type { Product } from "@/lib/db";

interface CategorySectionProps {
	title: string;
	products: Product[];
}

export function CategorySection({ title, products }: CategorySectionProps) {
	if (products.length === 0) return null;

	return (
		<section className="space-y-6">
			<div className="border-l-4 border-primary pl-4">
				<h2 className="font-oswald text-3xl font-bold tracking-wide">
					{title}
				</h2>
			</div>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						id={product.id}
						name={product.name}
						description={product.description}
						price={product.priceInCents}
						image={product.imageUrl}
					/>
				))}
			</div>
		</section>
	);
}
