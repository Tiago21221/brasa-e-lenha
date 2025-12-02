import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function AdminMenu() {
  return (
    <div className="flex gap-2">
      {/* Outros botões */}
      <Link href="/admin/produtos">
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Meus Produtos
        </Button>
      </Link>
    </div>
  )
}
