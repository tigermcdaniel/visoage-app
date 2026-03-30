"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { ProductCard } from "@/components/product-card"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  brand: string
  category: string
  image: string
  status: "full" | "half" | "low" | "empty"
}

const products: Product[] = [
  {
    id: "1",
    name: "Hydrating Cleanser",
    brand: "CeraVe",
    category: "Cleanser",
    image: "/images/products/cleanser.jpg",
    status: "half",
  },
  {
    id: "2",
    name: "2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    category: "Exfoliant",
    image: "/images/products/bha.jpg",
    status: "low",
  },
  {
    id: "3",
    name: "20% Vitamin C + E Serum",
    brand: "Timeless",
    category: "Serum",
    image: "/images/products/vitc.jpg",
    status: "full",
  },
  {
    id: "4",
    name: "Toleriane Double Repair",
    brand: "La Roche-Posay",
    category: "Moisturizer",
    image: "/images/products/moisturizer.jpg",
    status: "half",
  },
  {
    id: "5",
    name: "Unseen Sunscreen SPF 40",
    brand: "Supergoop",
    category: "SPF",
    image: "/images/products/spf.jpg",
    status: "full",
  },
  {
    id: "6",
    name: "Deep Cleansing Oil",
    brand: "DHC",
    category: "Oil Cleanser",
    image: "/images/products/oil-cleanser.jpg",
    status: "low",
  },
]

const categories = ["All", "Cleanser", "Serum", "Moisturizer", "SPF", "Exfoliant"]

export default function CabinetPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const lowStockCount = products.filter(p => p.status === "low" || p.status === "empty").length

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <section className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
            My Cabinet
          </span>
          <div className="flex items-center justify-between">
            <h1 className="font-serif italic text-3xl text-primary">Products</h1>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </section>

        {/* Alert Banner */}
        {lowStockCount > 0 && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl">
            <p className="text-sm text-orange-800">
              <span className="font-semibold">{lowStockCount} product{lowStockCount !== 1 ? "s" : ""}</span> running low
            </p>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface-container rounded-xl text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-container text-muted-foreground hover:bg-surface-container-high"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              brand={product.brand}
              category={product.category}
              image={product.image}
              status={product.status}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
