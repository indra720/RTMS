export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  image: string;
  isAvailable: boolean; // Added for inventory management
}

export const menuCategories: string[] = [
  "Appetizers",
  "Main Course",
  "Desserts",
  "Beverages",
];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Margherita Pizza",
    description: "Tomato, mozzarella, basil",
    price: 12.99,
    category: "Main Course",
    emoji: "🍕",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?w=500&q=80",
    isAvailable: true,
  },
  {
    id: 2,
    name: "Spicy Pepperoni Pizza",
    description: "Tomato, mozzarella, pepperoni, chili flakes",
    price: 14.50,
    category: "Main Course",
    emoji: "🌶️🍕",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80",
    isAvailable: true,
  },
  {
    id: 3,
    name: "Veggie Delight Pizza",
    description: "Mushrooms, bell peppers, onions, olives",
    price: 13.75,
    category: "Main Course",
    emoji: "🥦🍕",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
    isAvailable: true,
  },
  {
    id: 4,
    name: "Chicken Alfredo Pasta",
    description: "Fettuccine in creamy Alfredo sauce with grilled chicken",
    price: 16.00,
    category: "Main Course",
    emoji: "🍝🐔",
    image: "https://images.unsplash.com/photo-1645112481338-31745049581a?w=500&q=80",
    isAvailable: true,
  },
  {
    id: 5,
    name: "Spaghetti Bolognese",
    description: "Classic meat sauce with spaghetti",
    price: 15.50,
    category: "Main Course",
    emoji: "🍝🥩",
    image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=500&q=80",
    isAvailable: true,
  },
  {
    id: 6,
    name: "Caesar Salad",
    description: "Romaine lettuce, croutons, parmesan, Caesar dressing",
    price: 9.00,
    category: "Appetizers",
    emoji: "🥗",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80",
    isAvailable: true,
  },
  {
    id: 7,
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter and herbs",
    price: 5.00,
    category: "Appetizers",
    emoji: "🍞",
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&q=80",
    isAvailable: true,
  },
  {
    id: 8,
    name: "Tiramisu",
    description: "Coffee-flavored Italian dessert",
    price: 7.50,
    category: "Desserts",
    emoji: "🍰",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80",
    isAvailable: true,
  },
  {
    id: 9,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center",
    price: 8.00,
    category: "Desserts",
    emoji: "🍫🎂",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&q=80",
    isAvailable: true,
  },
  {
    id: 10,
    name: "Coca-Cola",
    description: "Refreshing carbonated drink",
    price: 3.00,
    category: "Beverages",
    emoji: "🥤",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80",
    isAvailable: true,
  },
  {
    id: 11,
    name: "Fresh Orange Juice",
    description: "Freshly squeezed oranges",
    price: 4.50,
    category: "Beverages",
    emoji: "🍊",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80",
    isAvailable: true,
  },
];

export const notifications = [
  {
    id: 1,
    message: "New reservation for Table 5 at 7:00 PM",
    time: "2 mins ago",
    type: "reservation",
    read: false,
  },
  {
    id: 2,
    message: "Order #402 ready for pickup",
    time: "15 mins ago",
    type: "order",
    read: true,
  },
  {
    id: 3,
    message: "VIP guest arrived at Table 12",
    time: "25 mins ago",
    type: "vip",
    read: false,
  },
  {
    id: 4,
    message: "Table 8 needs cleaning",
    time: "45 mins ago",
    type: "cleaning",
    read: true,
  },
];

export interface KitchenOrder {
  id: string;
  tableNumber: string;
  orderTime: string;
  status: "new" | "cooking" | "ready" | "completed";
  items: Array<{ name: string; quantity: number }>;
  specialNotes?: string;
}

export const kitchenOrders: KitchenOrder[] = [
  {
    id: "ORD001",
    tableNumber: "T2",
    orderTime: "12:45 PM",
    status: "cooking",
    items: [
      { name: "Classic Margherita Pizza", quantity: 1 },
      { name: "Garlic Bread", quantity: 2 },
    ],
    specialNotes: "No olives on pizza please.",
  },
  {
    id: "ORD002",
    tableNumber: "T4",
    orderTime: "12:50 PM",
    status: "new",
    items: [
      { name: "Chicken Alfredo Pasta", quantity: 1 },
      { name: "Coca-Cola", quantity: 1 },
    ],
  },
  {
    id: "ORD003",
    tableNumber: "T7",
    orderTime: "12:30 PM",
    status: "ready",
    items: [
      { name: "Veggie Delight Pizza", quantity: 1 },
      { name: "Fresh Orange Juice", quantity: 2 },
    ],
  },
];

export type TableStatus = "available" | "occupied" | "reserved" | "serving" | "dirty" | "billing";

export interface RestaurantTable {
  [x: string]: string;
  section: string;
  id: number;
  number: string;
  capacity: number;
  status: TableStatus;
  assignedWaiter?: string;
  seatedAt?: string;
  orderStatus?: string;
  currentOrder?: {
    id: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
  };
}

export const tables: RestaurantTable[] = [
  { id: 1, number: "T1", capacity: 2, status: "available", position: { x: 50, y: 50, width: 80, height: 80, rotation: 0 } },
  { id: 2, number: "T2", capacity: 2, status: "occupied", position: { x: 150, y: 50, width: 80, height: 80, rotation: 0 }, currentOrder: { id: "ORD001", items: [{ name: "Classic Margherita Pizza", quantity: 1, price: 12.99 }], total: 12.99 } },
  { id: 3, number: "T3", capacity: 4, status: "reserved", position: { x: 250, y: 50, width: 100, height: 100, rotation: 0 } },
  { id: 4, number: "T4", capacity: 4, status: "serving", position: { x: 50, y: 150, width: 100, height: 100, rotation: 0 }, currentOrder: { id: "ORD002", items: [{ name: "Chicken Alfredo Pasta", quantity: 1, price: 16.00 }], total: 16.00 } },
  { id: 5, number: "T5", capacity: 6, status: "available", position: { x: 180, y: 150, width: 120, height: 100, rotation: 0 } },
  { id: 6, number: "T6", capacity: 2, status: "dirty", position: { x: 320, y: 150, width: 80, height: 80, rotation: 0 } },
  { 
    id: 7, 
    number: "7", 
    capacity: 4, 
    status: "billing", 
    position: { x: 50, y: 280, width: 100, height: 100, rotation: 0 },
    currentOrder: { 
      id: "ORD-991", 
      items: [
        { name: "Butter Chicken", quantity: 2, price: 18.00 },
        { name: "Garlic Naan", quantity: 4, price: 3.50 }
      ], 
      total: 50.00 
    } 
  },
  { id: 8, number: "T8", capacity: 4, status: "available", position: { x: 180, y: 280, width: 100, height: 100, rotation: 0 } },
];

export const revenueData = [
  { day: "Mon", revenue: 2400 },
  { day: "Tue", revenue: 1800 },
  { day: "Wed", revenue: 3200 },
  { day: "Thu", revenue: 2800 },
  { day: "Fri", revenue: 4500 },
  { day: "Sat", revenue: 5200 },
  { day: "Sun", revenue: 3900 },
];

export const hourlyOrders = [
  { hour: "12pm", orders: 12 },
  { hour: "1pm", orders: 18 },
  { hour: "2pm", orders: 8 },
  { hour: "3pm", orders: 5 },
  { hour: "4pm", orders: 7 },
  { hour: "5pm", orders: 14 },
  { hour: "6pm", orders: 22 },
  { hour: "7pm", orders: 28 },
  { hour: "8pm", orders: 25 },
  { hour: "9pm", orders: 15 },
];

export const popularDishes = [
  { name: "Margherita Pizza", orders: 84, revenue: 1092 },
  { name: "Butter Chicken", orders: 76, revenue: 1368 },
  { name: "Caesar Salad", orders: 62, revenue: 558 },
  { name: "Tiramisu", orders: 48, revenue: 360 },
  { name: "Garlic Bread", orders: 45, revenue: 225 },
];

export interface StaffMember {
  id: number;
  name: string;
  role: "admin" | "waiter" | "chef" | "manager";
  status: "active" | "on-break" | "off-duty";
  email: string;
  phone: string;
  joinDate: string;
  tablesServed: number;
  ordersHandled: number;
  revenue: number;
  avatar?: string;
  shift: {
    start: string;
    end: string;
  };
}

export const staffMembers: StaffMember[] = [
  { 
    id: 1, 
    name: "Rahul Sharma", 
    role: "manager",
    status: "active",
    email: "rahul@rtms.com",
    phone: "+91 98765 43210",
    joinDate: "2023-01-15",
    tablesServed: 24, 
    ordersHandled: 86, 
    revenue: 1240,
    avatar: "https://i.pravatar.cc/150?u=rahul",
    shift: { start: "09:00 AM", end: "06:00 PM" }
  },
  { 
    id: 2, 
    name: "Priya Singh", 
    role: "waiter",
    status: "active",
    email: "priya@rtms.com",
    phone: "+91 98765 43211",
    joinDate: "2023-03-10",
    tablesServed: 18, 
    ordersHandled: 64, 
    revenue: 980,
    avatar: "https://i.pravatar.cc/150?u=priya",
    shift: { start: "12:00 PM", end: "09:00 PM" }
  },
  { 
    id: 3, 
    name: "Amit Kumar", 
    role: "chef",
    status: "on-break",
    email: "amit@rtms.com",
    phone: "+91 98765 43212",
    joinDate: "2023-02-20",
    tablesServed: 21, 
    ordersHandled: 72, 
    revenue: 1120,
    avatar: "https://i.pravatar.cc/150?u=amit",
    shift: { start: "10:00 AM", end: "07:00 PM" }
  },
  { 
    id: 4, 
    name: "Sanya Malik", 
    role: "waiter",
    status: "off-duty",
    email: "sanya@rtms.com",
    phone: "+91 98765 43213",
    joinDate: "2023-05-05",
    tablesServed: 15, 
    ordersHandled: 52, 
    revenue: 840,
    avatar: "https://i.pravatar.cc/150?u=sanya",
    shift: { start: "04:00 PM", end: "11:00 PM" }
  },
];

export interface Reservation {
  id: string;
  guestName: string;
  guests: number;
  date: string;
  time: string;
  tableNumber: string;
  status: "confirmed" | "pending" | "cancelled";
  contact: string;
  phone?: string;
  specialRequests?: string;
}

export const reservations: Reservation[] = [
  { id: "RES001", guestName: "John Doe", guests: 4, date: "2024-03-20", time: "7:00 PM", tableNumber: "3", status: "confirmed", contact: "john@example.com", phone: "+1 234-567-8901" },
  { id: "RES002", guestName: "Jane Smith", guests: 2, date: "2024-03-20", time: "8:30 PM", tableNumber: "5", status: "pending", contact: "jane@example.com", phone: "+1 234-567-8902" },
  { id: "RES003", guestName: "Mike Ross", guests: 4, date: "2024-03-21", time: "6:00 PM", tableNumber: "1", status: "confirmed", contact: "mike@example.com", phone: "+1 234-567-8903" },
];

export interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalVisits: number;
  totalSpending: number;
  lastVisit: string;
  favoriteTable: string;
  favoriteDishes: string[];
  visitHistory: Array<{ date: string; table: string; amount: number }>;
}

export const customerProfiles: CustomerProfile[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234-567-8901",
    totalVisits: 12,
    totalSpending: 840,
    lastVisit: "2024-03-15",
    favoriteTable: "3",
    favoriteDishes: ["Margherita Pizza", "Garlic Bread"],
    visitHistory: [
      { date: "2024-03-15", table: "3", amount: 45 },
      { date: "2024-03-01", table: "3", amount: 62 },
    ]
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 234-567-8902",
    totalVisits: 8,
    totalSpending: 520,
    lastVisit: "2024-03-10",
    favoriteTable: "5",
    favoriteDishes: ["Butter Chicken", "Fresh Orange Juice"],
    visitHistory: [
      { date: "2024-03-10", table: "5", amount: 38 },
      { date: "2024-02-25", table: "2", amount: 54 },
    ]
  }
];

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  cuisine: string;
  rating: number;
  location: string;
  priceRange: string;
  image?: string;
}

export const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "La Piazza",
    description: "Authentic Italian wood-fired pizzas and homemade pasta in a cozy, rustic atmosphere.",
    cuisine: "Italian",
    rating: 4.8,
    location: "Connaught Place, New Delhi",
    priceRange: "$$$",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
  },
  {
    id: 2,
    name: "Spice Garden",
    description: "Modern Indian fusion cuisine featuring regional specialties with a contemporary twist.",
    cuisine: "Indian",
    rating: 4.6,
    location: "Cyber Hub, Gurgaon",
    priceRange: "$$",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80"
  },
  {
    id: 3,
    name: "Sakura Sushi",
    description: "Premium Japanese dining experience with fresh sushi, sashimi, and traditional teppanyaki.",
    cuisine: "Japanese",
    rating: 4.9,
    location: "Saket, New Delhi",
    priceRange: "$$$$",
    image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800&q=80"
  },
  {
    id: 4,
    name: "The Blue Door",
    description: "Casual Mediterranean bistro offering fresh seafood, salads, and mezze platters.",
    cuisine: "Mediterranean",
    rating: 4.5,
    location: "Khan Market, New Delhi",
    priceRange: "$$",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"
  }
];

export interface Bill {
  id: string;
  orderId: string;
  tableNumber: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "cash" | "card" | "upi";
  status: "paid" | "cancelled" | "refunded";
  date: string;
  time: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "Vegetables" | "Dairy" | "Meat" | "Spices" | "Beverages" | "Grains";
  currentStock: number;
  unit: "kg" | "liters" | "units" | "packs" | "grams";
  minThreshold: number;
  lastRestocked: string;
  pricePerUnit: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalVisits: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastVisit: string;
  favoriteDishes: string[];
  tags: string[];
  status: "Regular" | "VIP" | "New";
}

export const customers: Customer[] = [
  {
    id: "CUST001",
    name: "Rahul Sharma",
    email: "rahul.s@example.com",
    phone: "+91 98765 43210",
    totalVisits: 12,
    totalSpent: 15400,
    loyaltyPoints: 1240,
    lastVisit: "2024-03-10",
    favoriteDishes: ["Paneer Butter Masala", "Butter Naan"],
    tags: ["Vegetarian", "Weekend Regular"],
    status: "VIP"
  },
  {
    id: "CUST002",
    name: "Priya Patel",
    email: "priya.p@example.com",
    phone: "+91 98222 11100",
    totalVisits: 5,
    totalSpent: 6200,
    loyaltyPoints: 450,
    lastVisit: "2024-03-08",
    favoriteDishes: ["Chicken Biryani", "Cold Coffee"],
    tags: ["Spicy Lover"],
    status: "Regular"
  },
  {
    id: "CUST003",
    name: "Ankit Verma",
    email: "ankit.v@example.com",
    phone: "+91 99888 77766",
    totalVisits: 1,
    totalSpent: 1200,
    loyaltyPoints: 120,
    lastVisit: "2024-03-12",
    favoriteDishes: ["Masala Dosa"],
    tags: ["First Timer"],
    status: "New"
  },
  {
    id: "CUST004",
    name: "Sneha Reddy",
    email: "sneha.r@example.com",
    phone: "+91 91234 56789",
    totalVisits: 25,
    totalSpent: 42000,
    loyaltyPoints: 3800,
    lastVisit: "2024-03-11",
    favoriteDishes: ["Pasta Alfredo", "Garlic Bread", "Red Wine"],
    tags: ["VIP", "Wine Enthusiast", "No Onion Garlic"],
    status: "VIP"
  }
];

export const inventoryItems: InventoryItem[] = [
  {
    id: "INV001",
    name: "Paneer (Fresh)",
    category: "Dairy",
    currentStock: 15,
    unit: "kg",
    minThreshold: 5,
    lastRestocked: "2024-03-10",
    pricePerUnit: 450,
    status: "In Stock"
  },
  {
    id: "INV002",
    name: "Tomato",
    category: "Vegetables",
    currentStock: 8,
    unit: "kg",
    minThreshold: 10,
    lastRestocked: "2024-03-11",
    pricePerUnit: 40,
    status: "Low Stock"
  },
  {
    id: "INV003",
    name: "Chicken Breast",
    category: "Meat",
    currentStock: 25,
    unit: "kg",
    minThreshold: 8,
    lastRestocked: "2024-03-12",
    pricePerUnit: 320,
    status: "In Stock"
  },
  {
    id: "INV004",
    name: "Milk",
    category: "Dairy",
    currentStock: 50,
    unit: "liters",
    minThreshold: 15,
    lastRestocked: "2024-03-12",
    pricePerUnit: 66,
    status: "In Stock"
  },
  {
    id: "INV005",
    name: "Basmati Rice",
    category: "Grains",
    currentStock: 4,
    unit: "packs",
    minThreshold: 5,
    lastRestocked: "2024-03-01",
    pricePerUnit: 1200,
    status: "Low Stock"
  },
  {
    id: "INV006",
    name: "Coca-Cola (500ml)",
    category: "Beverages",
    currentStock: 0,
    unit: "units",
    minThreshold: 20,
    lastRestocked: "2024-02-28",
    pricePerUnit: 35,
    status: "Out of Stock"
  },
  {
    id: "INV007",
    name: "Butter",
    category: "Dairy",
    currentStock: 12,
    unit: "kg",
    minThreshold: 3,
    lastRestocked: "2024-03-05",
    pricePerUnit: 580,
    status: "In Stock"
  }
];

export const pastOrders: Bill[] = [
  {
    id: "INV-1001",
    orderId: "ORD-552",
    tableNumber: "T3",
    customerName: "John Doe",
    items: [
      { name: "Classic Margherita Pizza", quantity: 2, price: 12.99 },
      { name: "Garlic Bread", quantity: 1, price: 5.00 },
    ],
    subtotal: 30.98,
    tax: 2.48,
    total: 33.46,
    paymentMethod: "card",
    status: "paid",
    date: "2024-03-10",
    time: "08:15 PM"
  },
  {
    id: "INV-1002",
    orderId: "ORD-553",
    tableNumber: "T5",
    customerName: "Jane Smith",
    items: [
      { name: "Chicken Alfredo Pasta", quantity: 1, price: 16.00 },
      { name: "Fresh Orange Juice", quantity: 2, price: 4.50 },
    ],
    subtotal: 25.00,
    tax: 2.00,
    total: 27.00,
    paymentMethod: "upi",
    status: "paid",
    date: "2024-03-10",
    time: "09:30 PM"
  }
];
