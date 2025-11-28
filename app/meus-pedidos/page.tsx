"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { formatPrice } from "@/lib/format";
import { getReservations, type Reservation } from "@/lib/reservations";
import { Package, Calendar, Search, Phone } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  totalCents: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: Array<{
    id: number;
    productName: string;
    quantity: number;
    productPriceCents: number;
  }>;
}

export default function MeusPedidosPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!phone.trim()) {
      toast.error("Digite um número de telefone");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Buscar pedidos
      const ordersResponse = await fetch(`/api/orders/user?phone=${encodeURIComponent(phone)}`);
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      }

      // Buscar reservas do localStorage
      const allReservations = getReservations();
      const userReservations = allReservations.filter(
        (r) => r.customerPhone === phone
      );
      setReservations(userReservations);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao buscar pedidos e reservas");
    } finally {
      setLoading(false);
    }
  };

  const getReservationStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/50";
      case "confirmed":
        return "bg-green-500/20 text-green-600 border-green-500/50";
      case "cancelled":
        return "bg-red-500/20 text-red-600 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500/50";
    }
  };

  const getReservationStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Aguardando";
      case "confirmed":
        return "Confirmada";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-oswald text-4xl font-bold">Meus Pedidos</h1>
            <p className="text-muted-foreground">
              Consulte seus pedidos e reservas pelo número de telefone
            </p>
          </div>

          {/* Busca por telefone */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="phone">Número de Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} disabled={loading}>
                    <Phone className="mr-2 h-4 w-4" />
                    Buscar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading && (
            <div className="text-center text-muted-foreground">
              Buscando pedidos e reservas...
            </div>
          )}

          {!loading && searched && (
            <Tabs defaultValue="pedidos" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pedidos">
                  <Package className="mr-2 h-4 w-4" />
                  Pedidos ({orders.length})
                </TabsTrigger>
                <TabsTrigger value="reservas">
                  <Calendar className="mr-2 h-4 w-4" />
                  Reservas ({reservations.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pedidos" className="space-y-4">
                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <Package className="mx-auto mb-2 h-12 w-12 opacity-50" />
                      <p>Nenhum pedido encontrado para este telefone</p>
                    </CardContent>
                  </Card>
                ) : (
                  orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              Pedido #{order.id}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <OrderStatusBadge status={order.status} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-semibold">Itens:</p>
                            <ul className="mt-1 space-y-1">
                              {order.items.map((item) => (
                                <li
                                  key={item.id}
                                  className="text-sm text-muted-foreground"
                                >
                                  {item.quantity}x {item.productName}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex items-center justify-between border-t pt-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Pagamento: {order.paymentMethod === "pix" ? "PIX" : order.paymentMethod === "card" ? "Cartão" : "Dinheiro"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Status do pagamento: {order.paymentStatus === "paid" ? "Pago" : "Pendente"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">
                                {formatPrice(order.totalCents)}
                              </p>
                            </div>
                          </div>
                          <Link href={`/pedido/${order.id}`}>
                            <Button variant="outline" className="w-full">
                              Ver Detalhes
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="reservas" className="space-y-4">
                {reservations.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <Calendar className="mx-auto mb-2 h-12 w-12 opacity-50" />
                      <p>Nenhuma reserva encontrada para este telefone</p>
                    </CardContent>
                  </Card>
                ) : (
                  reservations.map((reservation) => (
                    <Card key={reservation.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              Reserva para {reservation.partySize} pessoa{reservation.partySize > 1 ? "s" : ""}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {new Date(reservation.date).toLocaleDateString("pt-BR")} às {reservation.time}
                            </p>
                          </div>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getReservationStatusColor(reservation.status)}`}
                          >
                            {getReservationStatusLabel(reservation.status)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-semibold">Nome:</span> {reservation.customerName}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold">Telefone:</span> {reservation.customerPhone}
                          </p>
                          {reservation.specialRequests && (
                            <p className="text-sm">
                              <span className="font-semibold">Observações:</span> {reservation.specialRequests}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Criada em: {formatDate(reservation.createdAt)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </>
  );
}

