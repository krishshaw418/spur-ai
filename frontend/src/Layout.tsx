import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: any) {
  return (
    <div className="w-full">
        <main>{children}</main>
        <Toaster />
    </div>
  )
}