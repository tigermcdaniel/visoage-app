"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Search, ScanBarcode, Droplets, FlaskConical, Sparkles, Sun, X, Plus } from "lucide-react"
import { OnboardingProgress } from "@/components/onboarding-progress"

const categories = [
  { id: "cleansers", name: "Cleansers", icon: Droplets },
  { id: "serums", name: "Serums", icon: FlaskConical },
  { id: "moisturizers", name: "Moisturizers", icon: Sparkles },
  { id: "sunscreen", name: "Sunscreen", icon: Sun },
]

const popularProducts = [
  {
    id: "ha",
    name: "Hyaluronic Acid 2% + B5",
    brand: "The Ordinary",
    image: "/images/products/vitc.jpg",
  },
  {
    id: "cleanser",
    name: "Hydrating Facial Cleanser",
    brand: "CeraVe",
    image: "/images/products/cleanser.jpg",
  },
  {
    id: "spf",
    name: "Mineral SPF 50",
    brand: "Supergoop",
    image: "/images/products/spf.jpg",
  },
]

export default function CabinetStep() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [addedProducts, setAddedProducts] = useState<string[]>([])

  const toggleProduct = (productId: string) => {
    setAddedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const getAddedProductDetails = () => {
    return popularProducts.filter(p => addedProducts.includes(p.id))
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="w-16" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Step 4 of 4</span>
        <button
          onClick={() => router.push("/onboarding/complete")}
          className="text-xs uppercase tracking-widest text-primary font-semibold hover:underline"
        >
          Skip
        </button>
      </div>

      {/* Hero */}
      <section className="mb-8">
        <h1 className="font-serif text-4xl text-foreground mb-3 leading-tight">
          Your Digital <span className="italic text-primary">Cabinet</span>
        </h1>
        <p className="text-muted-foreground max-w-md">
          Add the products you currently use. We&apos;ll analyze how they interact with your skin&apos;s unique chemistry.
        </p>
      </section>

      {/* Search and Scan */}
      <div className="grid grid-cols-12 gap-4 mb-8">
        {/* Search Bar */}
        <div className="col-span-8 bg-card rounded-xl p-5 shadow-sm">
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-primary mb-3">
            Search Database
          </label>
          <div className="relative flex items-center bg-muted rounded-lg px-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Find brands or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 py-3 text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-[10px] text-muted-foreground mb-1 w-full">Popular</span>
            {["La Roche-Posay", "The Ordinary", "CeraVe"].map((brand) => (
              <button
                key={brand}
                className="px-3 py-1.5 bg-muted rounded-full text-xs font-medium hover:bg-primary-fixed transition-colors"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Scan Button */}
        <div className="col-span-4 bg-primary-container rounded-xl p-5 flex flex-col justify-between text-primary-foreground">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3">
            <ScanBarcode className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-serif text-lg mb-1 text-white">Quick Scan</h3>
            <p className="text-xs opacity-90 text-white/80">Scan barcode</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="mb-8">
        <h2 className="font-serif text-xl text-foreground mb-4">Browse by Category</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                className="bg-muted/50 p-4 rounded-xl hover:bg-muted transition-all text-center group"
              >
                <div className="w-8 h-8 mx-auto bg-card rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground">{category.name}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Popular Products */}
      <section className="mb-8">
        <h2 className="font-serif text-xl text-foreground mb-4">Popular Products</h2>
        <div className="space-y-3">
          {popularProducts.map((product) => {
            const isAdded = addedProducts.includes(product.id)
            return (
              <div
                key={product.id}
                className={`flex items-center gap-4 p-3 rounded-xl shadow-sm transition-all ${
                  isAdded ? "bg-primary/10 border-2 border-primary" : "bg-card"
                }`}
              >
                <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden relative">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-foreground text-sm">{product.name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.brand}</p>
                </div>
                <button
                  onClick={() => toggleProduct(product.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isAdded
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {isAdded ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Added Products */}
      {addedProducts.length > 0 && (
        <section className="mb-32">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-serif text-xl text-foreground">In Your Cabinet</h2>
            <span className="text-xs text-muted-foreground">{addedProducts.length} Products</span>
          </div>
          <div className="space-y-2">
            {getAddedProductDetails().map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 bg-card rounded-xl shadow-sm"
              >
                <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden relative">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-foreground text-sm">{product.name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.brand}</p>
                </div>
                <button
                  onClick={() => toggleProduct(product.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl z-50 rounded-t-[2rem] shadow-lg">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push("/onboarding/complete")}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-primary-foreground rounded-full font-semibold text-sm uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
          >
            Generate My Routine
          </button>
          <button
            onClick={() => router.push("/onboarding/skin-type")}
            className="w-full flex items-center justify-center gap-2 py-3 text-muted-foreground mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="mt-3">
            <OnboardingProgress currentStep={4} />
          </div>
        </div>
      </div>
    </div>
  )
}
