"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Check, FileText, ImageIcon, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  id: string
  label: string
  required?: boolean
  accept?: string
  variant?: "document" | "photo"
}

export function FileUpload({ id, label, required, accept = "image/*,application/pdf", variant = "document" }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  function handleFiles(files: FileList | null) {
    const f = files?.[0]
    if (!f) return
    setFile(f)
    if (f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f))
    } else {
      setPreview(null)
    }
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation()
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const Icon = variant === "photo" ? ImageIcon : FileText

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-accent">*</span>}
      </label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          "group relative flex min-h-32 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/40 p-4 text-center transition-colors",
          dragOver && "border-accent bg-accent/5",
          file && "border-solid border-accent/60 bg-card",
        )}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview || "/placeholder.svg"} alt={label} className="h-28 w-full rounded-lg object-cover" />
            <span
              onClick={clear}
              className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-foreground/80 text-background transition hover:bg-destructive"
            >
              <X className="size-4" />
            </span>
          </>
        ) : file ? (
          <div className="flex w-full items-center gap-3 rounded-lg bg-secondary px-3 py-2 text-left">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
              <Check className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">{file.name}</span>
              <span className="block text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span>
            </span>
            <span
              onClick={clear}
              className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="size-4" />
            </span>
          </div>
        ) : (
          <>
            <span className="flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent transition group-hover:scale-110">
              {dragOver ? <Upload className="size-5" /> : <Icon className="size-5" />}
            </span>
            <span className="text-sm font-medium text-foreground">
              {variant === "photo" ? "Add photo" : "Click to upload"}
            </span>
            <span className="text-xs text-muted-foreground">or drag &amp; drop {variant === "photo" ? "an image" : "PDF / JPG / PNG"}</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
