"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart";

export function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Zustand cart store
  const { getTotalItems } = useCart();
  const cartCount = mounted ? getTotalItems() : 0;

  // Rehydrate cart on mount
  useEffect(() => {
    setMounted(true);
    useCart.persist.rehydrate();
  }, []);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <>
      {/* Barra fixa no topo */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo + nome + subtítulo em vermelho */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <Image
              src="/logo-brasa-lenha.png" // ajuste se o caminho da logo for outro
              alt="Brasa e Lenha"
              width={42}
              height={42}
              className="rounded"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-oswald text-2xl font-bold tracking-tight text-red-600">
                Brasa e Lenha
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Churrascaria Delivery
              </span>
            </div>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden items-center gap-3 md:flex">
            <Link href="/cardapio">
              <Button variant="outline" size="sm" className="font-semibold">
                cardápio
              </Button>
            </Link>

            <Link href="/reservas">
              <Button variant="outline" size="sm" className="font-semibold">
                Reserva
              </Button>
            </Link>

            {/* Carrinho: só ícone + badge */}
            <Link href="/carrinho">
              <Button
                variant="outline"
                size="icon"
                className="relative font-semibold"
                aria-label="Carrinho"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/meus-pedidos">
              <Button
                variant="outline"
                size="sm"
                className="font-semibold"
                aria-label="Meus Pedidos"
              >
                <History className="mr-2 h-4 w-4" />
                Meus Pedidos
              </Button>
            </Link>

            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="font-semibold text-red-600"
              >
                Admin
              </Button>
            </Link>
          </nav>

          {/* Botão hambúrguer (mobile) */}
          <button
            type="button"
            className="flex items-center justify-center rounded-md p-2 hover:bg-accent md:hidden"
            onClick={toggleMenu}
            aria-label="Abrir menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Overlay escuro (mobile) */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeMenu}
          aria-label="Fechar menu"
        />
      )}

      {/* Menu lateral mobile */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-64 flex-col border-l bg-background px-6 py-6 shadow-lg transition-transform duration-200 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-oswald text-xl font-bold text-with-100">
            Menu
          </span>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Fechar menu"
            className="rounded-md p-1 hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Barrinha divisória abaixo do título */}
        <Separator className="mb-4" />

        <nav className="flex flex-col gap-3">
          <Link href="/cardapio" onClick={closeMenu}>
            <Button
              variant="outline"
              className="w-full justify-start font-semibold"
            >
              cardápio
            </Button>
          </Link>

          <Link href="/reservas" onClick={closeMenu}>
            <Button
              variant="outline"
              className="w-full justify-start font-semibold"
            >
              Reserva
            </Button>
          </Link>

          <Link href="/carrinho" onClick={closeMenu}>
            <Button
              variant="outline"
              className="relative w-full justify-start gap-2 font-semibold"
              aria-label="Carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Carrinho</span>
              {cartCount > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          <Link href="/meus-pedidos" onClick={closeMenu}>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 font-semibold"
            >
              <History className="h-5 w-5" />
              Meus Pedidos
            </Button>
          </Link>

          <Link href="/admin" onClick={closeMenu}>
            <Button
              variant="ghost"
              className="w-full justify-start font-semibold text-red-600"
            >
              Admin
            </Button>
          </Link>
        </nav>
      </aside>
    </>
  );
}
