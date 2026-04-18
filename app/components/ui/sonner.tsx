"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-md group-[.toaster]:rounded-sm group-[.toaster]:text-sm group-[.toaster]:font-medium",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:font-normal",
          actionButton:
            "group-[.toast]:bg-foreground group-[.toast]:text-background group-[.toast]:rounded-sm group-[.toast]:text-xs",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-sm group-[.toast]:text-xs",
          error:
            "group-[.toaster]:border-destructive/30",
          success:
            "group-[.toaster]:border-border",
          icon:
            "group-[.toast]:[&>svg]:size-3.5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
