"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { CartItem } from "@/components/cart-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { ShoppingBag, CreditCard, DollarSign, QrCode, Store, Truck } from "lucide-react";
import { toast } from "sonner";

export default function CarrinhoPage() {
	const router = useRouter();
	const { items, getTotalPrice, clearCart } = useCart();
	const [loading, setLoading] = useState(false);
	const [mounted, setMounted] = useState(false);

	const [formData, setFormData] = useState({
		name: "Cliente Demo",
		phone: "(11) 99999-9999",
		address: "Rua Demo, 123 - Centro - São Paulo - SP",
		notes: "Pedido de demonstração",
		paymentMethod: "pix" as "pix" | "card" | "cash",
		deliveryType: "delivery" as "delivery" | "pickup",
	});

	useEffect(() => {
		setMounted(true);
		useCart.persist.rehydrate();
	}, []);

	const totalPrice = getTotalPrice();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name || !formData.phone) {
			toast.error("Preencha todos os campos obrigatórios");
			return;
		}

		if (formData.deliveryType === "delivery" && !formData.address) {
			toast.error("Endereço é obrigatório para delivery");
			return;
		}

		if (items.length === 0) {
			toast.error("Adicione itens ao carrinho");
			return;
		}

		setLoading(true);

		try {
			console.log("[v0] Creating order with data:", {
				customerName: formData.name,
				customerPhone: formData.phone,
				items: items.length,
				total: totalPrice,
			});

			const response = await fetch("/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					customerName: formData.name,
					customerPhone: formData.phone,
					customerAddress: formData.deliveryType === "pickup" 
						? (formData.address || "Retirada no Restaurante")
						: formData.address,
					deliveryType: formData.deliveryType,
					paymentMethod: formData.paymentMethod,
					notes: formData.notes,
					items: items.map((item) => ({
						productId: item.productId,
						name: item.name,
						price: item.price,
						quantity: item.quantity,
					})),
					totalCents: totalPrice,
					stripeSessionId:
						formData.paymentMethod === "card" ? `demo_${Date.now()}` : null,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				console.error("[v0] Order creation failed:", data);
				throw new Error(data.error || "Erro ao criar pedido");
			}

			console.log("[v0] Order created successfully:", data.orderId);
			clearCart();
			toast.success("Pedido realizado com sucesso!");
			router.push(`/pedido/${data.orderId}`);
		} catch (error) {
			console.error("[v0] Error creating order:", error);
			toast.error("Erro ao processar pedido. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	if (!mounted) {
		return (
			<>
				<Header />
				<main className="container mx-auto px-4 py-12">
					<div className="mx-auto max-w-md text-center">
						<p className="text-muted-foreground">Carregando carrinho...</p>
					</div>
				</main>
			</>
		);
	}

	if (items.length === 0) {
		return (
			<>
				<Header />
				<main className="container mx-auto px-4 py-12">
					<div className="mx-auto max-w-md text-center">
						<ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
						<h1 className="mb-2 font-oswald text-2xl font-bold">
							Carrinho Vazio
						</h1>
						<p className="mb-6 text-muted-foreground">
							Adicione itens ao carrinho para  seu pedido
						</p>
						<Button onClick={() => router.push("/cardapio")}>
							Ver Cardápio
						</Button>
					</div>
				</main>
			</>
		);
	}

	return (
		<>
			<Header />
			<main className="container mx-auto px-4 py-8">
				<h1 className="mb-8 font-oswald text-3xl font-bold md:text-4xl">
					Finalizar Pedido
				</h1>

				<form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
					<div className="space-y-6 lg:col-span-2">
						{/* Cart Items */}
						<Card>
							<CardHeader>
								<CardTitle>Itens do Pedido</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{items.map((item) => (
									<CartItem key={item.productId} item={item} />
								))}
							</CardContent>
						</Card>

						{/* Delivery Type */}
						<Card>
							<CardHeader>
								<CardTitle>Tipo de Pedido</CardTitle>
							</CardHeader>
							<CardContent>
								<RadioGroup
									value={formData.deliveryType}
									onValueChange={(value) =>
										setFormData({ ...formData, deliveryType: value as "delivery" | "pickup" })
									}
								>
									<div className="flex items-center space-x-3 rounded-lg border p-4">
										<RadioGroupItem value="delivery" id="delivery" />
										<Label
											htmlFor="delivery"
											className="flex flex-1 cursor-pointer items-center gap-3"
										>
											<Truck className="h-5 w-5" />
											<div>
												<div className="font-semibold">Delivery (Entrega)</div>
												<div className="text-sm text-muted-foreground">
													Entregamos no endereço informado
												</div>
											</div>
										</Label>
									</div>

									<div className="flex items-center space-x-3 rounded-lg border p-4">
										<RadioGroupItem value="pickup" id="pickup" />
										<Label
											htmlFor="pickup"
											className="flex flex-1 cursor-pointer items-center gap-3"
										>
											<Store className="h-5 w-5" />
											<div>
												<div className="font-semibold">Retirada no Restaurante</div>
												<div className="text-sm text-muted-foreground">
													Você retira o pedido no restaurante
												</div>
											</div>
										</Label>
									</div>
								</RadioGroup>
							</CardContent>
						</Card>

						{/* Customer Info */}
						<Card>
							<CardHeader>
								<CardTitle>{formData.deliveryType === "delivery" ? "Dados para Entrega" : "Dados para Retirada"}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Nome Completo *</Label>
									<Input
										id="name"
										value={formData.name}
										// placeholder="Digite seu nome"
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone">Telefone *</Label>
									<Input
										id="phone"
										type="tel"
										placeholder="(11) 98888-8888"
										value={formData.phone}
										onChange={(e) =>
											setFormData({ ...formData, phone: e.target.value })
										}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="address">
										{formData.deliveryType === "delivery" ? "Endereço Completo *" : "Endereço (Opcional)"}
									</Label>
									<Textarea
										id="address"
										placeholder={formData.deliveryType === "delivery" ? "Rua, número, complemento, bairro, cidade" : "Endereço para referência (opcional)"}
										value={formData.address}
										onChange={(e) =>
											setFormData({ ...formData, address: e.target.value })
										}
										required={formData.deliveryType === "delivery"}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="notes">Observações</Label>
									<Textarea
										id="notes"
										placeholder="Alguma observação sobre o pedido?"
										value={formData.notes}
										onChange={(e) =>
											setFormData({ ...formData, notes: e.target.value })
										}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Payment Method */}
						<Card>
							<CardHeader>
								<CardTitle>Forma de Pagamento (Demo)</CardTitle>
							</CardHeader>
							<CardContent>
								<RadioGroup
									value={formData.paymentMethod}
									onValueChange={(value) =>
										setFormData({ ...formData, paymentMethod: value as any })
									}
								>
									<div className="flex items-center space-x-3 rounded-lg border p-4">
										<RadioGroupItem value="pix" id="pix" />
										<Label
											htmlFor="pix"
											className="flex flex-1 cursor-pointer items-center gap-3"
										>
											<QrCode className="h-5 w-5" />
											<div>
												<div className="font-semibold">PIX</div>
												<div className="text-sm text-muted-foreground">
													Pagamento instantâneo
												</div>
											</div>
										</Label>
									</div>

									<div className="flex items-center space-x-3 rounded-lg border p-4">
										<RadioGroupItem value="card" id="card" />
										<Label
											htmlFor="card"
											className="flex flex-1 cursor-pointer items-center gap-3"
										>
											<CreditCard className="h-5 w-5" />
											<div>
												<div className="font-semibold">Cartão de Crédito</div>
												<div className="text-sm text-muted-foreground">
													Modo demonstração
												</div>
											</div>
										</Label>
									</div>

									<div className="flex items-center space-x-3 rounded-lg border p-4">
										<RadioGroupItem value="cash" id="cash" />
										<Label
											htmlFor="cash"
											className="flex flex-1 cursor-pointer items-center gap-3"
										>
											<DollarSign className="h-5 w-5" />
											<div>
												<div className="font-semibold">Dinheiro</div>
												<div className="text-sm text-muted-foreground">
													Pagar na entrega
												</div>
											</div>
										</Label>
									</div>
								</RadioGroup>
							</CardContent>
						</Card>
					</div>

					{/* Order Summary */}
					<div className="lg:col-span-1">
						<Card className="sticky top-20">
							<CardHeader>
								<CardTitle>Resumo do Pedido</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Subtotal</span>
										<span>{formatPrice(totalPrice)}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">
											Taxa de Entrega
										</span>
										<span className="text-green-600">Grátis</span>
									</div>
								</div>

								<div className="border-t pt-4">
									<div className="flex justify-between">
										<span className="font-oswald text-lg font-bold">Total</span>
										<span className="font-oswald text-2xl font-bold text-primary">
											{formatPrice(totalPrice)}
										</span>
									</div>
								</div>

								<Button
									type="submit"
									className="w-full"
									size="lg"
									disabled={loading}
								>
									{loading ? "Processando..." : "Finalizar Pedido"}
								</Button>

								<p className="text-center text-xs text-muted-foreground">
									Ao finalizar, você concorda com nossos termos de serviço
								</p>
							</CardContent>
						</Card>
					</div>
				</form>
			</main>
		</>
	);
}
