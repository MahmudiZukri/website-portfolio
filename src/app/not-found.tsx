import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A27B5C_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-8">
        <h1 className="text-8xl md:text-[150px] font-black text-foreground tracking-tighter drop-shadow-[8px_8px_0_var(--primary)] animate-pulse">
          404
        </h1>
        
        <div className="space-y-4">
          <h2 className="text-2xl md:text-4xl font-bold bg-primary text-primary-foreground px-4 py-2 border-4 border-black shadow-[6px_6px_0_0_#000] inline-block">
            LOST IN THE MESH
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">
            The page you are looking for has been moved, deleted, or possibly never existed.
          </p>
        </div>

        <Link href="/">
          <Button size="lg" className="mt-8 bg-card hover:bg-primary/20 text-card-foreground border-4 border-primary shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] hover:-translate-y-1 active:translate-y-2 active:shadow-none transition-all rounded-none text-lg font-bold px-8 py-6">
            RETURN TO BASE
          </Button>
        </Link>
      </div>
    </div>
  )
}
