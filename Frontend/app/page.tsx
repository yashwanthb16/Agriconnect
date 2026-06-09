import { ShieldCheck, Truck } from "lucide-react"
import { RegistrationForm } from "@/components/registration-form"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Truck className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">FleetRoute</span>
          </div>
          <span className="hidden items-center gap-1.5 text-sm text-primary-foreground/70 sm:flex">
            <ShieldCheck className="size-4 text-accent" /> Secure registration
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Register Your Vehicle
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
            Join our network of carriers in a few quick steps. Add your vehicle, driver, and payout details to start
            getting loads.
          </p>
        </div>

        <RegistrationForm />

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Need help? Contact support at support@fleetroute.app
        </p>
      </div>
    </main>
  )
}
