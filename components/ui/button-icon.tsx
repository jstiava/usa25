import { ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ButtonIcon({children, onClick, disabled = false}: {
  children: any,
  onClick?: any,
  disabled?: boolean
}) {
  return (
    <Button disabled={disabled} onClick={onClick} variant="secondary" size="icon" className="size-8">
      {children}
    </Button>
  )
}
