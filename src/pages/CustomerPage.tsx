import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { restaurants, type Restaurant } from "@/data/mock-data";
import { BookingFlow } from "@/components/BookingFlow";
import { Star, MapPin, ArrowRight, Search, Filter, UtensilsCrossed, Clock, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CustomerPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");

  const cuisines = useMemo(() => {
    const unique = Array.from(new Set(restaurants.map(r => r.cuisine)));
    return ["All", ...unique];
  }, []);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCuisine = activeCuisine === "All" || r.cuisine === activeCuisine;
      return matchesSearch && matchesCuisine;
    });
  }, [searchQuery, activeCuisine]);

  if (selectedRestaurant) {
    return <BookingFlow restaurant={selectedRestaurant} onBack={() => setSelectedRestaurant(null)} />;
  }

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden bg-foreground h-[240px] flex items-center px-8 shadow-elevated">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&q=80" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="outline" className="text-primary-foreground border-primary-foreground/20 mb-3 font-heading font-bold uppercase tracking-wider text-[10px] px-2 py-0">
              Concierge
            </Badge>
            <h1 className="text-3xl font-heading font-bold text-background tracking-tight">
              Reserved for Excellence
            </h1>
            <p className="text-background/70 text-sm mt-1 max-w-lg">
              Discover and book the city's most exclusive dining destinations with ease.
            </p>
          </motion.div>

          <div className="flex items-center gap-3 pt-2">
            <div className="relative flex-1 group max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-background/50 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search by name, dish or vibe..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-lg bg-background/10 backdrop-blur-md border-background/10 text-background placeholder:text-background/40 focus-visible:ring-primary/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cuisine Filter */}
      <div className="space-y-3">
        <h2 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4 text-primary" />
          Explore Cuisines
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setActiveCuisine(cuisine)}
              className={`px-5 py-2 rounded-lg font-heading font-semibold text-xs uppercase tracking-wider whitespace-nowrap transition-all border ${
                activeCuisine === cuisine 
                ? "bg-primary border-primary text-primary-foreground shadow-sm" 
                : "bg-card border-border/50 text-muted-foreground hover:border-primary/30"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRestaurants.map((r, i) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-card border border-border/50 rounded-xl overflow-hidden shadow-elevated hover:shadow-glass transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={r.image} 
                  alt={r.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-3 right-3">
                  <Button size="icon" variant="secondary" className="rounded-lg h-8 w-8 bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-primary transition-colors">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <Badge className="bg-white/20 backdrop-blur-md border-white/20 text-white font-heading font-bold text-[10px] uppercase tracking-wider px-2 py-0">
                    {r.cuisine}
                  </Badge>
                  <Badge className="bg-status-available/80 backdrop-blur-md border-none text-white font-heading font-bold text-[10px] uppercase tracking-wider px-2 py-0">
                    OPEN
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <h3 className="font-heading font-semibold text-lg text-foreground truncate">{r.name}</h3>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-heading font-bold uppercase tracking-wider">{r.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-status-reserved/10 text-status-reserved px-1.5 py-0.5 rounded-md">
                    <Star className="h-3 w-3 fill-status-reserved" />
                    <span className="text-xs font-heading font-bold">{r.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {r.description}
                </p>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider">Budget</span>
                    <span className="text-sm font-heading font-bold text-primary">{r.priceRange}</span>
                  </div>
                  
                  <Button
                    onClick={() => setSelectedRestaurant(r)}
                    className="rounded-lg h-9 px-4 font-heading font-semibold text-xs uppercase tracking-wider gap-2 transition-all"
                  >
                    Reserve Now <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="py-20 text-center space-y-4 bg-muted/20 rounded-xl border border-dashed border-border/50">
          <div className="h-16 w-16 bg-muted/50 rounded-xl flex items-center justify-center mx-auto text-muted-foreground">
            <Filter className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-semibold text-foreground">No matches found</h3>
            <p className="text-xs text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
          <Button variant="outline" className="rounded-lg font-heading font-semibold text-xs uppercase tracking-wider" onClick={() => {setSearchQuery(""); setActiveCuisine("All");}}>
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

