"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Users } from "lucide-react"
import { toast } from "sonner"
import {
  AVAILABLE_TIMES,
  MAX_PARTY_SIZE,
  saveReservation,
  getAvailableSlots,
} from "@/lib/reservations"

export default function ReservasPage() {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    customerPhone: "(11) 99999-9999",
    date: tomorrow,
    time: "19:00",
    partySize: "4",
    specialRequests: "Mesa perto da janela, é aniversário da minha namorada",
  })

  const [availableSlots, setAvailableSlots] = useState<string[]>(AVAILABLE_TIMES)
  const [submitting, setSubmitting] = useState(false)

  // Atualizar slots disponíveis quando a data muda
  useEffect(() => {
    const updateSlots = async () => {
      if (formData.date) {
        const slots = await getAvailableSlots(formData.date)
        setAvailableSlots(slots)
      }
    }
    updateSlots()
  }, [formData.date])

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, date, time: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    if (!formData.customerName || !formData.customerEmail || !formData.date || !formData.time) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      setSubmitting(false)
      return
    }

    try {
      const reservationData = {
        name: formData.customerName,
        phone: formData.customerPhone || formData.customerEmail,
        date: formData.date,
        people: Number.parseInt(formData.partySize),
        time: formData.time,
        note: formData.specialRequests 
          ? `${formData.time} - ${formData.customerEmail} - ${formData.specialRequests}`
          : `${formData.time} - ${formData.customerEmail}`,
      }

      await saveReservation(reservationData)
      toast.success("Reserva solicitada com sucesso! Aguarde confirmação do restaurante.")
      
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        date: "",
        time: "",
        partySize: "2",
        specialRequests: "",
      })
    } catch (error) {
      toast.error("Erro ao criar reserva")
    } finally {
      setSubmitting(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 font-oswald text-4xl font-bold">Reserve sua Mesa</h1>
          <p className="text-muted-foreground">Agende uma mesa no Brasa e Lenha sem sair de casa</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Dados da Reserva</CardTitle>
              <CardDescription>Preencha seus dados e escolha a data e hora desejada</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Informações Pessoais</h3>
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Detalhes da Reserva</h3>
                  <div>
                    <Label htmlFor="date">Data *</Label>
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      max={maxDate}
                      value={formData.date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Horário *</Label>
                    <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                      <SelectTrigger id="time" className="mt-1">
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.length > 0 ? (
                          availableSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="unavailable" disabled>
                            Sem horários disponíveis
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="partySize">Número de Pessoas *</Label>
                    <Select
                      value={formData.partySize}
                      onValueChange={(value) => setFormData({ ...formData, partySize: value })}
                    >
                      <SelectTrigger id="partySize" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: MAX_PARTY_SIZE }, (_, i) => i + 1).map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size} {size === 1 ? "pessoa" : "pessoas"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <Label htmlFor="requests">Observações Especiais</Label>
                  <Textarea
                    id="requests"
                    placeholder="Ex: Aniversário, mesa perto da janela, dieta especial..."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Enviando..." : "Confirmar Reserva"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">Disponibilidade</p>
                      <p className="text-xs text-muted-foreground">Até 30 dias à frente</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">Horários</p>
                      <p className="text-xs text-muted-foreground">Almoço e jantar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">Capacidade</p>
                      <p className="text-xs text-muted-foreground">Até 8 pessoas</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-primary/10 p-3">
                  <p className="text-xs font-semibold text-primary">Confirmação</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Você receberá uma confirmação por email assim que o restaurante aceitar sua reserva.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
