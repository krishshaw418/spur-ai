import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: any) {
  return (
    <div>
        <main>{children}</main>
        <Toaster />
    </div>
  )
}