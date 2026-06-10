"use client"

import type React from "react"

import { useState } from "react"
import {
  Banknote,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  IdCard,
  PartyPopper,
  Truck,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field } from "@/components/field"
import { FileUpload } from "@/components/file-upload"
import { MobileOtpField } from "@/components/mobile-otp-field"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: "owner", title: "Owner", icon: User },
  { id: "vehicle", title: "Vehicle", icon: Truck },
  { id: "driver", title: "Driver", icon: IdCard },
  { id: "documents", title: "Documents", icon: FileCheck2 },
  { id: "payment", title: "Payment", icon: Banknote },
] as const

export function RegistrationForm() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [payMethod, setPayMethod] = useState("upi")
  const [terms, setTerms] = useState(false)

  const isLast = step === STEPS.length - 1
  const progress = ((step + 1) / STEPS.length) * 100

  function next() {
    if (isLast) {
      setSubmitted(true)
      return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-10 text-center shadow-sm ring-1 ring-border">
        <span className="flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent">
          <PartyPopper className="size-8" />
        </span>
        <h2 className="text-2xl font-semibold text-foreground">Registration submitted!</h2>
        <p className="max-w-sm text-pretty text-muted-foreground">
          Your vehicle details are under review. We&apos;ll notify you on your verified mobile number once approved.
        </p>
        <Button
          className="mt-2"
          onClick={() => {
            setSubmitted(false)
            setStep(0)
          }}
        >
          Register another vehicle
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border">
      {/* Stepper */}
      <div className="border-b border-border bg-secondary/50 px-4 py-5 sm:px-8">
        <ol className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const done = i < step
            const active = i === step
            return (
              <li key={s.id} className="flex flex-1 items-center last:flex-none">
                <button
                  type="button"
                  onClick={() => i <= step && setStep(i)}
                  className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2"
                >
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full border-2 transition-colors",
                      done && "border-accent bg-accent text-accent-foreground",
                      active && "border-accent bg-card text-accent",
                      !done && !active && "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="size-4" /> : <Icon className="size-4" />}
                  </span>
                  <span
                    className={cn(
                      "hidden text-sm font-medium sm:block",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s.title}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <span className={cn("mx-2 h-0.5 flex-1 rounded", done ? "bg-accent" : "bg-border")} />
                )}
              </li>
            )
          })}
        </ol>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <form
        className="p-4 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault()
          next()
        }}
      >
        {step === 0 && (
          <Section title="Owner Details" subtitle="Tell us who owns the vehicle.">
            <Field id="ownerName" label="Full Name" required placeholder="e.g. Ramesh Kumar" />
            <MobileOtpField id="ownerMobile" label="Mobile Number" />
          </Section>
        )}

        {step === 1 && (
          <Section title="Vehicle Details" subtitle="Details about the vehicle you want to register.">
            <Field id="regNumber" label="Vehicle Registration Number" required placeholder="e.g. KA01AB1234" className="uppercase" />
            <div className="flex flex-col gap-2">
              <Label htmlFor="vehicleType">
                Vehicle Type<span className="ml-0.5 text-accent">*</span>
              </Label>
              <Select>
                <SelectTrigger id="vehicleType">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mini-truck">Mini Truck</SelectItem>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="lcv">Light Commercial Vehicle</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="trailer">Trailer</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Field id="loadCapacity" label="Load Capacity (kg / tons)" required placeholder="e.g. 5 tons" />
            <Field id="location" label="Current Location" required placeholder="e.g. Bengaluru, Karnataka" />
          </Section>
        )}

        {step === 2 && (
          <Section title="Driver Details" subtitle="Information about the assigned driver.">
            <Field id="driverName" label="Driver Name" required placeholder="e.g. Suresh Singh" />
            <Field id="driverMobile" label="Driver Mobile Number" required inputMode="numeric" placeholder="10-digit mobile number" />
            <Field id="license" label="Driving License Number" required placeholder="e.g. KA0120201234567" className="uppercase" />
          </Section>
        )}

        {step === 3 && (
          <>
            <Section title="Required Documents" subtitle="Upload clear copies of the documents below.">
              <FileUpload id="rc" label="RC (Registration Certificate)" required />
              <FileUpload id="dl" label="Driving License" required />
              <FileUpload id="insurance" label="Insurance Certificate" required />
            </Section>
            <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Camera className="size-4 text-accent" /> Vehicle Photos
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FileUpload id="frontPhoto" label="Vehicle Front Photo" required variant="photo" accept="image/*" />
              <FileUpload id="sidePhoto" label="Vehicle Side Photo" required variant="photo" accept="image/*" />
            </div>
          </>
        )}

        {step === 4 && (
          <Section title="Payment Details" subtitle="Where should we send your payouts?">
            <RadioGroup value={payMethod} onValueChange={setPayMethod} className="grid gap-3 sm:grid-cols-2">
              <PayOption value="upi" label="UPI ID" current={payMethod} />
              <PayOption value="bank" label="Bank Account" current={payMethod} />
            </RadioGroup>

            {payMethod === "upi" ? (
              <Field id="upi" label="UPI ID" required placeholder="e.g. ramesh@okhdfcbank" />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="account" label="Bank Account Number" required inputMode="numeric" placeholder="Account number" />
                <Field id="ifsc" label="IFSC Code" required placeholder="e.g. HDFC0001234" className="uppercase" />
              </div>
            )}

            <label className="mt-2 flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
              <Checkbox checked={terms} onCheckedChange={(v) => setTerms(Boolean(v))} className="mt-0.5" />
              <span className="text-sm text-foreground">
                I accept the <span className="font-medium text-accent underline underline-offset-2">Terms &amp; Conditions</span> and confirm
                that all the information provided is accurate.
                <span className="ml-0.5 text-accent">*</span>
              </span>
            </label>
          </Section>
        )}

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Button type="button" variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ChevronLeft className="size-4" /> Back
          </Button>
          <span className="text-sm text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </span>
          <Button type="submit" disabled={isLast && !terms}>
            {isLast ? "Submit Registration" : "Continue"}
            {!isLast && <ChevronRight className="size-4" />}
          </Button>
        </div>
      </form>
    </div>
  )
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-6 grid gap-5">{children}</div>
    </div>
  )
}

function PayOption({ value, label, current }: { value: string; label: string; current: string }) {
  const active = current === value
  return (
    <Label
      htmlFor={`pay-${value}`}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors",
        active ? "border-accent bg-accent/5" : "border-border bg-card",
      )}
    >
      <RadioGroupItem id={`pay-${value}`} value={value} />
      <span className="font-medium text-foreground">{label}</span>
    </Label>
  )
}
