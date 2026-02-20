"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Check, X, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  title: string
  onSave: (title: string) => Promise<void>
  isActive?: boolean
  disabled?: boolean
}

export default function Title({
  title,
  onSave,
  isActive = false,
  disabled = false
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(title)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setEditValue(title)
  }, [title])

  const handleStartEdit = (e: React.MouseEvent) => {
    if (disabled) return
    e.stopPropagation()
    setIsEditing(true)
    setEditValue(title)
  }

  const handleSave = async () => {
    const trimmedValue = editValue.trim()

    if (!trimmedValue) {
      setEditValue(title)
      setIsEditing(false)
      return
    }

    if (trimmedValue === title) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onSave(trimmedValue)
      setIsEditing(false)
    } catch {
      setEditValue(title)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(title)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div
        className="flex items-center gap-1 flex-1 min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={(e) => {
            const relatedTarget = e.relatedTarget as HTMLElement
            if (!relatedTarget || !relatedTarget.closest('.edit-actions')) {
              handleSave()
            }
          }}
          placeholder="Suhbat nomi"
          className="h-6 px-2 py-1 text-sm border-border focus-visible:ring-1"
          disabled={isSaving}
        />
        <div className="flex items-center gap-0.5 edit-actions">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={(e) => {
              e.stopPropagation()
              handleSave()
            }}
            disabled={isSaving}
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation()
              handleCancel()
            }}
            disabled={isSaving}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0 group/title">
      <p className="text-sm truncate flex-1">
        {title}
      </p>
      {!disabled && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-4 w-4 p-0 opacity-0 group-hover/title:opacity-100 transition-opacity duration-200",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
            isActive && "opacity-100"
          )}
          onClick={handleStartEdit}
          aria-label={`Tahrirlash: ${title}`}
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
