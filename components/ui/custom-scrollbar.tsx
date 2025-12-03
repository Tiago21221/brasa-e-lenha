import * as React from "react"
import { cn } from "@/lib/utils"

interface CustomScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function CustomScrollbar({ children, className, ...props }: CustomScrollbarProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      <div className="overflow-y-auto overflow-x-hidden">
        {children}
      </div>
      {/* Estilização personalizada do scrollbar */}
      <style jsx global>{`
        /* Estilo para navegadores WebKit (Chrome, Safari, Edge) */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 100, 0.4);
          border-radius: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 100, 100, 0.6);
        }
        
        /* Estilo para Firefox */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 100, 100, 0.4) rgba(0, 0, 0, 0.1);
        }
        
        /* Scrollbar mais escuro para tema escuro */
        .dark .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .dark .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .dark .overflow-y-auto {
          scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  )
}

// Componente específico para sidebar
export function SidebarScrollbar({ children, className, ...props }: CustomScrollbarProps) {
  return (
    <CustomScrollbar 
      className={cn("h-full", className)} 
      {...props}
    >
      <style jsx global>{`
        /* Estilo específico para sidebar */
        .sidebar-scroll::-webkit-scrollbar {
          width: 8px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-track {
          background: rgba(100, 100, 100, 0.1);
          border-radius: 4px;
          margin: 4px 0;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 100, 0.4);
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 100, 100, 0.6);
          background-clip: content-box;
        }
        
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 100, 100, 0.4) rgba(100, 100, 100, 0.1);
        }
      `}</style>
      {children}
    </CustomScrollbar>
  )
}