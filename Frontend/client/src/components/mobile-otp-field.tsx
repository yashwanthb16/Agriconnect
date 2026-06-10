"use client"

import { useEffect, useRef, useState } from "react"
import { BadgeCheck, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Status = "idle" | "sending" | "otp" | "verifying" | "verified"

export function MobileOtpField({ id, label }: { id: string; label: string }) {
  const [mobile, setMobile] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [otp, setOtp] = useState(["", "", "", ""])
  const [countdown, setCountdown] = useState(0)
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const valid = /^\d{10}$/.test(mobile)

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  function sendOtp() {
    setStatus("sending")
    setTimeout(() => {
      setStatus("otp")
      setCountdown(30)
    }, 900)
  }

  function handleOtpChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 3) refs.current[i + 1]?.focus()
    if (next.every((d) => d !== "")) verify(next.join(""))
  }

  function verify(code: string) {
    if (code.length !== 4) return
    setStatus("verifying")
    setTimeout(() => setStatus("verified"), 1000)
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        <span className="ml-0.5 text-accent">*</span>
        {status === "verified" && (
          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
            <BadgeCheck className="size-3.5" /> Verified
          </span>
        )}
      </Label>

      <div className="flex gap-2">
        <div className="flex flex-1 items-center rounded-md border border-input bg-card focus-within:ring-2 focus-within:ring-ring/50">
          <span className="select-none border-r border-input px-3 text-sm text-muted-foreground">+91</span>
          <input
            id={id}
            inputMode="numeric"
            placeholder="10-digit mobile number"
            value={mobile}
            disabled={status === "verified"}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="h-9 w-full rounded-r-md bg-transparent px-3 text-sm outline-none disabled:opacity-70"
          />
        </div>
        {status !== "verified" && (
          <Button
            type="button"
            variant={valid ? "default" : "secondary"}
            disabled={!valid || status === "sending"}
            onClick={sendOtp}
            className="shrink-0"
          >
            {status === "sending" ? <Loader2 className="size-4 animate-spin" /> : status === "otp" ? "Resend" : "Send OTP"}
          </Button>
        )}
      </div>

      {(status === "otp" || status === "verifying") && (
        <div className="mt-1 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
          <span className="text-sm text-muted-foreground">Enter the 4-digit code</span>
          <div className="flex gap-2">
            {otp.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  refs.current[i] = el
                }}
                inputMode="numeric"
                maxLength={1}
                value={d}
                disabled={status === "verifying"}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus()
                }}
                className={cn(
                  "size-10 rounded-md border border-input bg-card text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-ring/50",
                )}
              />
            ))}
          </div>
          {status === "verifying" ? (
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Verifying…
            </span>
          ) : countdown > 0 ? (
            <span className="text-sm text-muted-foreground">Resend in {countdown}s</span>
          ) : null}
        </div>
      )}
    </div>
  )
}
