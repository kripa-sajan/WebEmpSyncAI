"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wrench, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface FixPunchProps {
  companyId: number
  disabled?: boolean
  className?: string
}

export default function FixPunch({ companyId, disabled = false, className = "" }: FixPunchProps) {
  const [isFixingPunches, setIsFixingPunches] = useState(false)
  const router = useRouter()

  const handleFixPunches = async () => {
    setIsFixingPunches(true)
    
    try {
      const response = await fetch('/api/punch/fix-punches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_id: companyId,
          // You can optionally add user_id or date here for specific fixes
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`✅ ${result.message}. Fixed ${result.fixed} punches.`)
        
        // If punches were fixed and last_sync was updated, refresh company data
        if (result.fixed > 0) {
          setTimeout(() => {
            router.refresh()
          }, 1000)
        }
      } else {
        toast.error(`❌ ${result.message}`)
      }
    } catch (error) {
      console.error('Error fixing punches:', error)
      toast.error('Failed to fix punches')
    } finally {
      setIsFixingPunches(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleFixPunches}
      disabled={isFixingPunches || disabled}
      className={`bg-green-50 hover:bg-green-100 text-green-700 border-green-200 ${className}`}
    >
      {isFixingPunches ? (
        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
      ) : (
        <Wrench className="w-3 h-3 mr-1" />
      )}
      {isFixingPunches ? 'Fixing...' : 'Fix Now'}
    </Button>
  )
}