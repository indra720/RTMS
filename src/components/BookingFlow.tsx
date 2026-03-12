// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import type { Restaurant } from "@/data/mock-data";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";
// import { CalendarIcon, ArrowLeft, Check, Users, Clock, Armchair, User, CheckCircle2 } from "lucide-react";

// interface BookingFlowProps {
//   restaurant: Restaurant;
//   onBack: () => void;
// }

// const timeSlots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
// const preferences = [
//   { label: "Standard table", description: "Regular seating in the main dining area" },
//   { label: "Window seat", description: "Enjoy the view from our window tables" },
//   { label: "Private booth", description: "Intimate dining in a private setting" },
// ];

// const steps = [
//   { icon: Clock, label: "Date & Time" },
//   { icon: Users, label: "Guests" },
//   { icon: Armchair, label: "Preference" },
//   { icon: User, label: "Contact" },
//   { icon: Check, label: "Confirm" },
// ];

// export function BookingFlow({ restaurant, onBack }: BookingFlowProps) {
//   const [step, setStep] = useState(0);
//   const [date, setDate] = useState<Date>();
//   const [time, setTime] = useState("");
//   const [guests, setGuests] = useState(2);
//   const [preference, setPreference] = useState("Standard table");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [confirmed, setConfirmed] = useState(false);

//   const next = () => setStep((s) => s + 1);
//   const prev = () => setStep((s) => s - 1);

//   const slideVariant = {
//     initial: { opacity: 0, x: 30 },
//     animate: { opacity: 1, x: 0 },
//     exit: { opacity: 0, x: -30 },
//   };

//   if (confirmed) {
//     return (
//       <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] p-6">
//         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl border border-border/50 shadow-glass p-10 max-w-md w-full text-center">
//           <div className="h-16 w-16 rounded-full bg-status-available/10 flex items-center justify-center mx-auto mb-4">
//             <CheckCircle2 className="h-8 w-8 text-status-available" />
//           </div>
//           <h2 className="font-heading font-bold text-2xl text-foreground mb-2">Booking Confirmed!</h2>
//           <p className="text-muted-foreground mb-6">Your table at {restaurant.name} has been reserved.</p>
//           <div className="space-y-2 text-sm bg-muted/30 rounded-xl p-5 mb-6 text-left">
//             <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium text-foreground">{date ? format(date, "PPP") : ""}</span></div>
//             <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium text-foreground">{time}</span></div>
//             <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="font-medium text-foreground">{guests}</span></div>
//             <div className="flex justify-between"><span className="text-muted-foreground">Seating</span><span className="font-medium text-foreground">{preference}</span></div>
//           </div>
//           <Button onClick={onBack} className="gradient-primary text-primary-foreground border-0 rounded-xl h-11 px-8">
//             Back to Restaurants
//           </Button>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-6xl ">
//       <button onClick={step === 0 ? onBack : prev} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
//         <ArrowLeft className="h-4 w-4" /> Back
//       </button>

//       <div className="mb-8">
//         <h2 className="font-heading font-bold text-xl text-foreground">{restaurant.name}</h2>
//         <p className="text-sm text-muted-foreground mt-0.5">{restaurant.cuisine} · {restaurant.location}</p>
//       </div>

//       {/* Step indicator */}
//       <div className="flex items-center  gap-2 mb-8">
//         {steps.map((s, i) => (
//           <div key={i} className="flex items-center gap-2">
//             <div className={cn(
//               "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
//               i < step ? "gradient-primary text-primary-foreground" :
//               i === step ? "bg-primary/10 text-primary border-2 border-primary" :
//               "bg-muted text-muted-foreground"
//             )}>
//               {i < step ? <Check className="h-3.5 w-3.5" /> : <s.icon className="h-3.5 w-3.5" />}
//             </div>
//             {i < steps.length - 1 && (
//               <div className={cn("h-0.5 w-8 rounded-full transition-colors duration-300", i < step ? "bg-primary" : "bg-border")} />
//             )}
//           </div>
//         ))}
//       </div>

//       <AnimatePresence mode="wait">
//         {step === 0 && (
//           <motion.div key="s0" {...slideVariant} transition={{ duration: 0.2 }} className="space-y-5">
//             <div>
//               <label className="text-sm font-medium text-foreground mb-2 block">Select Date</label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button variant="outline" className={cn("w-full justify-start h-11 rounded-xl", !date && "text-muted-foreground")}>
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {date ? format(date, "PPP") : "Pick a date"}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                   <Calendar mode="single" selected={date} onSelect={setDate} className="p-3 pointer-events-auto" />
//                 </PopoverContent>
//               </Popover>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-foreground mb-2 block">Select Time</label>
//               <div className="grid grid-cols-4 gap-2">
//                 {timeSlots.map((t) => (
//                   <button
//                     key={t}
//                     onClick={() => setTime(t)}
//                     className={cn(
//                       "text-sm py-2.5 rounded-xl border transition-all duration-200 font-medium",
//                       time === t ? "gradient-primary text-primary-foreground border-transparent shadow-md" : "border-border/50 text-foreground hover:border-primary/30 hover:bg-primary/5"
//                     )}
//                   >
//                     {t}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <Button onClick={next} disabled={!date || !time} className="w-full gradient-primary text-primary-foreground border-0 rounded-xl h-11">Next</Button>
//           </motion.div>
//         )}

//         {step === 1 && (
//           <motion.div key="s1" {...slideVariant} transition={{ duration: 0.2 }} className="space-y-5">
//             <label className="text-sm font-medium text-foreground mb-2 block">Number of Guests</label>
//             <div className="flex items-center justify-center gap-6 py-8">
//               <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl" onClick={() => setGuests(Math.max(1, guests - 1))}>−</Button>
//               <span className="font-heading text-6xl font-bold text-foreground w-20 text-center">{guests}</span>
//               <Button variant="outline" size="icon" className="h-14 w-14 rounded-xl" onClick={() => setGuests(Math.min(12, guests + 1))}>+</Button>
//             </div>
//             <Button onClick={next} className="w-full gradient-primary text-primary-foreground border-0 rounded-xl h-11">Next</Button>
//           </motion.div>
//         )}

//         {step === 2 && (
//           <motion.div key="s2" {...slideVariant} transition={{ duration: 0.2 }} className="space-y-4">
//             <label className="text-sm font-medium text-foreground mb-2 block">Table Preference</label>
//             {preferences.map((p) => (
//               <button
//                 key={p.label}
//                 onClick={() => setPreference(p.label)}
//                 className={cn(
//                   "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
//                   preference === p.label ? "border-primary bg-primary/5 shadow-md" : "border-border/50 hover:border-primary/20"
//                 )}
//               >
//                 <span className="font-medium text-sm text-foreground">{p.label}</span>
//                 <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
//               </button>
//             ))}
//             <Button onClick={next} className="w-full gradient-primary text-primary-foreground border-0 rounded-xl h-11">Next</Button>
//           </motion.div>
//         )}

//         {step === 3 && (
//           <motion.div key="s3" {...slideVariant} transition={{ duration: 0.2 }} className="space-y-4">
//             <label className="text-sm font-medium text-foreground mb-2 block">Contact Details</label>
//             <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl" />
//             <Input placeholder="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl" />
//             <Button onClick={next} disabled={!name || !email} className="w-full gradient-primary text-primary-foreground border-0 rounded-xl h-11">Review Booking</Button>
//           </motion.div>
//         )}

//         {step === 4 && (
//           <motion.div key="s4" {...slideVariant} transition={{ duration: 0.2 }} className="space-y-5">
//             <label className="text-sm font-medium text-foreground mb-2 block">Confirm Your Booking</label>
//             <div className="space-y-3 bg-muted/30 rounded-xl p-5 text-sm">
//               <div className="flex justify-between"><span className="text-muted-foreground">Restaurant</span><span className="font-medium text-foreground">{restaurant.name}</span></div>
//               <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium text-foreground">{date ? format(date, "PPP") : ""}</span></div>
//               <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium text-foreground">{time}</span></div>
//               <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="font-medium text-foreground">{guests}</span></div>
//               <div className="flex justify-between"><span className="text-muted-foreground">Seating</span><span className="font-medium text-foreground">{preference}</span></div>
//               <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium text-foreground">{name}</span></div>
//               <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium text-foreground">{email}</span></div>
//             </div>
//             <Button onClick={() => setConfirmed(true)} className="w-full gradient-primary text-primary-foreground border-0 rounded-xl h-11">Confirm Booking</Button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }









import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Restaurant } from "@/data/mock-data";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon, ArrowLeft, Check, Users, Clock, Armchair, User, CheckCircle2,
  Sun, Moon, Star, Bell, Coffee, Wine, Gift
} from "lucide-react";

interface BookingFlowProps {
  restaurant: Restaurant;
  onBack: () => void;
}

const timeSlots = {
  evening: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"],
  lunch: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30"],
};

const preferences = [
  { 
    label: "Standard table", 
    description: "Regular seating in the main dining area",
    icon: Armchair,
    color: "bg-blue-100 text-blue-600"
  },
  { 
    label: "Window seat", 
    description: "Enjoy the view from our window tables",
    icon: Sun,
    color: "bg-amber-100 text-amber-600"
  },
  { 
    label: "Private booth", 
    description: "Intimate dining in a private setting",
    icon: Star,
    color: "bg-purple-100 text-purple-600"
  },
];

const occasions = [
  { label: "Casual Dining", icon: Coffee },
  { label: "Birthday", icon: Gift },
  { label: "Anniversary", icon: Heart },
  { label: "Business", icon: Briefcase },
];

export function BookingFlow({ restaurant, onBack }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [preference, setPreference] = useState("Standard table");
  const [occasion, setOccasion] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  const progress = (step / 5) * 100;

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center relative overflow-hidden"
        >
          {/* Confetti effect background */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-primary to-green-400" />
          
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 text-sm mb-6">Your table at {restaurant.name} is ready.</p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-semibold text-gray-900">{date ? format(date, "EEE, MMM d") : ""}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Time</span>
              <span className="font-semibold text-gray-900">{time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Guests</span>
              <span className="font-semibold text-gray-900">{guests} {guests === 1 ? 'person' : 'people'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Table</span>
              <span className="font-semibold text-gray-900">{preference}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onBack}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-11"
            >
              Browse More
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl h-11"
            >
              Add to Calendar
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header with progress */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={step === 1 ? onBack : prev}
              className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Book a Table</h1>
              <p className="text-xs text-gray-500">{restaurant.name} · {restaurant.cuisine}</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-medium text-gray-400">
            <span className={step >= 1 ? "text-primary" : ""}>DateTime</span>
            <span className={step >= 2 ? "text-primary" : ""}>Guests</span>
            <span className={step >= 3 ? "text-primary" : ""}>Preference</span>
            <span className={step >= 4 ? "text-primary" : ""}>Contact</span>
            <span className={step >= 5 ? "text-primary" : ""}>Confirm</span>
          </div>
        </div>

        {/* Step content - card style */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                    Select Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start h-12 rounded-xl border-2 text-sm",
                          !date ? "text-gray-400 border-gray-200" : "border-primary/30 text-gray-900"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        {date ? format(date, "EEEE, MMMM d, yyyy") : "Choose a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                    Select Time
                  </label>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="h-4 w-4 text-amber-500" />
                        <span className="text-xs font-medium text-gray-600">Lunch</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.lunch.map((t) => (
                          <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={cn(
                              "py-2.5 rounded-xl border text-sm font-medium transition-all",
                              time === t
                                ? "bg-primary text-white border-primary shadow-md"
                                : "border-gray-200 text-gray-700 hover:border-primary/30 hover:bg-primary/5"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Moon className="h-4 w-4 text-indigo-500" />
                        <span className="text-xs font-medium text-gray-600">Dinner</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.evening.map((t) => (
                          <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={cn(
                              "py-2.5 rounded-xl border text-sm font-medium transition-all",
                              time === t
                                ? "bg-primary text-white border-primary shadow-md"
                                : "border-gray-200 text-gray-700 hover:border-primary/30 hover:bg-primary/5"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={next}
                  disabled={!date || !time}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold mt-4"
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                  Number of Guests
                </label>
                
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-xl bg-white shadow-sm hover:bg-gray-100"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                  >
                    <span className="text-xl font-bold">−</span>
                  </Button>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-gray-900">{guests}</span>
                    <p className="text-xs text-gray-500 mt-1">guests</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-xl bg-white shadow-sm hover:bg-gray-100"
                    onClick={() => setGuests(Math.min(12, guests + 1))}
                  >
                    <span className="text-xl font-bold">+</span>
                  </Button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">
                    Occasion (Optional)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {occasions.map((occ) => (
                      <button
                        key={occ.label}
                        onClick={() => setOccasion(occ.label)}
                        className={cn(
                          "py-3 rounded-xl border-2 text-center transition-all",
                          occasion === occ.label
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/30"
                        )}
                      >
                        <occ.icon className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                        <span className="text-[10px] font-medium text-gray-700">{occ.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={next} className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold">
                  Continue
                </Button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                  Table Preference
                </label>
                
                <div className="grid gap-3">
                  {preferences.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setPreference(p.label)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 transition-all",
                        preference === p.label
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-primary/30"
                      )}
                    >
                      <div className={`h-10 w-10 rounded-lg ${p.color} flex items-center justify-center`}>
                        <p.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold text-gray-900">{p.label}</h4>
                        <p className="text-xs text-gray-500">{p.description}</p>
                      </div>
                      {preference === p.label && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <Button onClick={next} className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold mt-2">
                  Continue
                </Button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                  Contact Information
                </label>
                
                <div className="space-y-3">
                  <Input
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-primary text-sm"
                  />
                  <Input
                    placeholder="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-primary text-sm"
                  />
                  <Input
                    placeholder="Phone number (optional)"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-primary text-sm"
                  />
                  <textarea
                    placeholder="Special requests (allergies, dietary restrictions, etc.)"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={3}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm resize-none"
                  />
                </div>

                <Button
                  onClick={next}
                  disabled={!name || !email}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold mt-2"
                >
                  Review Booking
                </Button>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                  Review Your Booking
                </label>
                
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <span className="text-xs text-gray-500">Restaurant</span>
                    <span className="font-semibold text-gray-900">{restaurant.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-gray-500 block">Date</span>
                      <span className="font-medium text-gray-900 text-sm">{date ? format(date, "MMM d, yyyy") : ""}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Time</span>
                      <span className="font-medium text-gray-900 text-sm">{time}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Guests</span>
                      <span className="font-medium text-gray-900 text-sm">{guests}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Table</span>
                      <span className="font-medium text-gray-900 text-sm">{preference}</span>
                    </div>
                    {occasion && (
                      <div className="col-span-2">
                        <span className="text-xs text-gray-500 block">Occasion</span>
                        <span className="font-medium text-gray-900 text-sm">{occasion}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500 block">Contact</span>
                    <span className="font-medium text-gray-900 text-sm">{name} · {email}</span>
                    {phone && <span className="text-xs text-gray-500 block mt-1">{phone}</span>}
                  </div>
                  {specialRequests && (
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500 block">Special requests</span>
                      <span className="text-sm text-gray-700">{specialRequests}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={prev}
                    className="flex-1 h-12 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => setConfirmed(true)}
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold"
                  >
                    Confirm
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Help text */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Secure booking · No prepayment required
        </p>
      </div>
    </div>
  );
}

// Missing imports
function Heart(props: any) { return <Bell {...props} />; }
function Briefcase(props: any) { return <Coffee {...props} />; }
