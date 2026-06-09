"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  required?: boolean
}

export function Field({ id, label, required, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-0.5 text-accent">*</span>}
      </Label>
      <Input id={id} {...props} />
    </div>
  )
}
