export const PAGE_SIZE = 5;

export const adminNav = [
  { label: "Dashboard", path: "/super-admin" },
  { label: "Users", path: "/super-admin/users" },
  { label: "Organizers", path: "/super-admin/organizers" },
  { label: "Tournaments", path: "/super-admin/tournaments" },
  { label: "Payments", path: "/super-admin/payments" },
  { label: "Settlements", path: "/super-admin/settlements" },
  { label: "Games", path: "/super-admin/games" },
  { label: "Support", path: "/super-admin/support" },
];

export const adminBottomNav = [
  { label: "Settings", path: "/super-admin/settings" },
];

export const adminPageTitles: Record<string, string> = {
  "/super-admin": "Command Center",
  "/super-admin/users": "User Management",
  "/super-admin/organizers": "Organizer Management",
  "/super-admin/tournaments": "Tournament Oversight",
  "/super-admin/payments": "Financial Reporting",
  "/super-admin/settlements": "Tournament Settlements",
  "/super-admin/games": "Available Games",
  "/super-admin/support": "Support Inbox",
  "/super-admin/settings": "Settings",
};

export const adminMetrics = [
  {
    id: "users",
    label: "Total Users",
    value: "186",
  },
  {
    id: "organizers",
    label: "Total Organizers",
    value: "14",
  },
  {
    id: "revenue",
    label: "Total Revenue",
    value: "Rs. 1.2L",
  },
  {
    id: "tournaments",
    label: "Total Tournaments",
    value: "28",
  },
  {
    id: "active",
    label: "Active Tournaments",
    value: "5",
  },
  {
    id: "pending",
    label: "Pending Approvals",
    value: "3",
    action: "Review Now",
    highlight: true,
  },
];

export const growthYAxis = ["Rs. 20k", "Rs. 15k", "Rs. 10k", "Rs. 5k", "0"];

export const growthData30 = [
  { label: "Week 1", revenue: 18, tournaments: 25 },
  { label: "Week 2", revenue: 32, tournaments: 38 },
  { label: "Week 3", revenue: 48, tournaments: 52 },
  { label: "Week 4", revenue: 72, tournaments: 65 },
];

export const growthData90 = [
  { label: "Week 1", revenue: 8, tournaments: 12 },
  { label: "Week 2", revenue: 14, tournaments: 18 },
  { label: "Week 3", revenue: 20, tournaments: 24 },
  { label: "Week 4", revenue: 26, tournaments: 30 },
  { label: "Week 5", revenue: 32, tournaments: 35 },
  { label: "Week 6", revenue: 38, tournaments: 40 },
  { label: "Week 7", revenue: 45, tournaments: 48 },
  { label: "Week 8", revenue: 52, tournaments: 54 },
  { label: "Week 9", revenue: 58, tournaments: 60 },
  { label: "Week 10", revenue: 64, tournaments: 66 },
  { label: "Week 11", revenue: 70, tournaments: 72 },
  { label: "Week 12", revenue: 78, tournaments: 75 },
];

export const recentActivity = [
  {
    id: 1,
    type: "approval" as const,
    text: "Kathmandu Gaming Hub was approved as a new Organizer",
    time: "10 mins ago",
  },
  {
    id: 2,
    type: "create" as const,
    text: "New tournament Dashain Esports Cup created",
    time: "45 mins ago",
  },
  {
    id: 3,
    type: "alert" as const,
    text: "System alert: Peak registrations on Kathmandu servers",
    time: "2 hours ago",
  },
  {
    id: 4,
    type: "payment" as const,
    text: "Weekly eSewa payout batch #12 processed",
    time: "Yesterday",
  },
];

export type AdminUserStatus = "Active" | "Inactive" | "Suspended";

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  tournamentsJoined: number;
  status: AdminUserStatus;
  initials: string;
  avatarColor: string;
};

export const totalAdminUsers = 186;

export const adminUsers: AdminUser[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    tournamentsJoined: 12,
    status: "Active",
    initials: "AS",
    avatarColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    name: "Binita Thapa",
    email: "binita.thapa@gmail.com",
    tournamentsJoined: 8,
    status: "Active",
    initials: "BT",
    avatarColor: "bg-purple-100 text-purple-700",
  },
  {
    id: 3,
    name: "Sujan Gurung",
    email: "sujan.gurung@gmail.com",
    tournamentsJoined: 3,
    status: "Inactive",
    initials: "SG",
    avatarColor: "bg-gray-100 text-gray-700",
  },
  {
    id: 4,
    name: "Riya Karki",
    email: "riya.karki@gmail.com",
    tournamentsJoined: 15,
    status: "Active",
    initials: "RK",
    avatarColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 5,
    name: "Nabin Rai",
    email: "nabin.rai@gmail.com",
    tournamentsJoined: 0,
    status: "Suspended",
    initials: "NR",
    avatarColor: "bg-rose-100 text-rose-700",
  },
  {
    id: 6,
    name: "Anisha Shrestha",
    email: "anisha.shrestha@gmail.com",
    tournamentsJoined: 6,
    status: "Active",
    initials: "AS",
    avatarColor: "bg-cyan-100 text-cyan-700",
  },
  {
    id: 7,
    name: "Prakash Tamang",
    email: "prakash.tamang@gmail.com",
    tournamentsJoined: 2,
    status: "Active",
    initials: "PT",
    avatarColor: "bg-amber-100 text-amber-700",
  },
];

export type OrganizerStatus = "Pending" | "Active" | "Flagged" | "Rejected";

export type AdminOrganizer = {
  id: number;
  name: string;
  email: string;
  tournaments: number;
  status: OrganizerStatus;
  initial: string;
  avatarColor: string;
};

export const organizerStats = {
  total: 14,
  pending: 3,
  flagged: 1,
};

export const totalAdminOrganizers = 14;

export const adminOrganizers: AdminOrganizer[] = [
  {
    id: 1,
    name: "Kathmandu Gaming Hub",
    email: "contact@ktmgaming.com.np",
    tournaments: 0,
    status: "Pending",
    initial: "K",
    avatarColor: "bg-amber-100 text-amber-700",
  },
  {
    id: 2,
    name: "Pokhara Esports Club",
    email: "hello@pokharaesports.com",
    tournaments: 18,
    status: "Active",
    initial: "P",
    avatarColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    name: "Nepal Valorant Circuit",
    email: "admin@nvc.gg",
    tournaments: 24,
    status: "Active",
    initial: "N",
    avatarColor: "bg-cyan-100 text-cyan-700",
  },
  {
    id: 4,
    name: "Chitwan Battle Arena",
    email: "info@cbaesports.np",
    tournaments: 6,
    status: "Flagged",
    initial: "C",
    avatarColor: "bg-rose-100 text-rose-700",
  },
  {
    id: 5,
    name: "Butwal Esports League",
    email: "info@butwalesports.np",
    tournaments: 2,
    status: "Pending",
    initial: "B",
    avatarColor: "bg-violet-100 text-violet-700",
  },
];

export type TournamentAdminStatus = "Live" | "Pending" | "Completed" | "Upcoming";

export type AdminTournament = {
  id: number;
  name: string;
  prizePool: string;
  game: string;
  organizer: string;
  organizerInitial: string;
  organizerColor: string;
  date: string;
  status: TournamentAdminStatus;
  entryFee?: string;
  slots?: string;
};

export const adminTournamentGames = [
  "All Games",
  "Valorant",
  "PUBG Mobile",
  "Free Fire",
  "MLBB",
  "CODM",
];

export const adminTournamentStatuses = [
  "All Status",
  "Live",
  "Pending",
  "Completed",
];

export const totalAdminTournaments = 28;

export const adminTournaments: AdminTournament[] = [
  {
    id: 1,
    name: "Nepal Valorant Cup",
    prizePool: "Rs. 50,000",
    game: "Valorant",
    organizer: "Nepal Valorant Circuit",
    organizerInitial: "N",
    organizerColor: "bg-cyan-100 text-cyan-700",
    date: "Apr 29 – May 2, 2026",
    status: "Live",
  },
  {
    id: 2,
    name: "Dashain Esports Cup",
    prizePool: "Rs. 75,000",
    game: "PUBG Mobile",
    organizer: "Kathmandu Gaming Hub",
    organizerInitial: "K",
    organizerColor: "bg-amber-100 text-amber-700",
    date: "Oct 10 – Oct 15, 2026",
    status: "Pending",
  },
  {
    id: 3,
    name: "Pokhara Free Fire Open",
    prizePool: "Rs. 25,000",
    game: "Free Fire",
    organizer: "Pokhara Esports Club",
    organizerInitial: "P",
    organizerColor: "bg-blue-100 text-blue-700",
    date: "Sep 5 – Sep 8, 2026",
    status: "Upcoming",
  },
  {
    id: 4,
    name: "MLBB INV",
    prizePool: "Rs. 30,000",
    game: "MLBB",
    organizer: "Pokhara Esports Club",
    organizerInitial: "P",
    organizerColor: "bg-blue-100 text-blue-700",
    date: "Aug 1 – Aug 5, 2026",
    status: "Live",
  },
  {
    id: 5,
    name: "Arenova Open Series",
    prizePool: "Rs. 20,000",
    game: "Valorant",
    organizer: "Nepal Valorant Circuit",
    organizerInitial: "N",
    organizerColor: "bg-cyan-100 text-cyan-700",
    date: "Jul 20 – Jul 25, 2026",
    status: "Completed",
  },
  {
    id: 6,
    name: "CODM Nepal Masters",
    prizePool: "Rs. 35,000",
    game: "CODM",
    organizer: "Chitwan Battle Arena",
    organizerInitial: "C",
    organizerColor: "bg-rose-100 text-rose-700",
    date: "Nov 1 – Nov 4, 2026",
    status: "Pending",
  },
];

export type PaymentStatus = "Completed" | "Pending" | "Failed";

export type AdminPayment = {
  id: number;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  tournament: string;
  amount: string;
  method: string;
  date: string;
  status: PaymentStatus;
};

export const paymentMetrics = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "Rs. 1.2L",
  },
  {
    id: "commission",
    label: "Platform Commission",
    value: "Rs. 12,000",
  },
  {
    id: "refunds",
    label: "Refunds",
    value: "Rs. 2,400",
  },
  {
    id: "success",
    label: "Success Rate",
    value: "98.1%",
  },
];

export const adminPaymentStatuses = ["All Status", "Completed", "Pending", "Failed"];

export const adminPayments: AdminPayment[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    initials: "AS",
    avatarColor: "bg-blue-100 text-blue-700",
    tournament: "Nepal Valorant Cup",
    amount: "Rs. 500",
    method: "eSewa",
    date: "Aug 12, 2026",
    status: "Completed",
  },
  {
    id: 2,
    name: "Binita Thapa",
    email: "binita.thapa@gmail.com",
    initials: "BT",
    avatarColor: "bg-purple-100 text-purple-700",
    tournament: "MLBB INV",
    amount: "Rs. 300",
    method: "Khalti",
    date: "Aug 11, 2026",
    status: "Completed",
  },
  {
    id: 3,
    name: "Sujan Gurung",
    email: "sujan.gurung@gmail.com",
    initials: "SG",
    avatarColor: "bg-gray-100 text-gray-700",
    tournament: "Arenova Open Series",
    amount: "Rs. 150",
    method: "eSewa",
    date: "Aug 10, 2026",
    status: "Pending",
  },
  {
    id: 4,
    name: "Riya Karki",
    email: "riya.karki@gmail.com",
    initials: "RK",
    avatarColor: "bg-emerald-100 text-emerald-700",
    tournament: "Dashain Esports Cup",
    amount: "Rs. 400",
    method: "Bank Transfer",
    date: "Aug 9, 2026",
    status: "Failed",
  },
  {
    id: 5,
    name: "Anisha Shrestha",
    email: "anisha.shrestha@gmail.com",
    initials: "AS",
    avatarColor: "bg-cyan-100 text-cyan-700",
    tournament: "Pokhara Free Fire Open",
    amount: "Rs. 250",
    method: "Khalti",
    date: "Aug 8, 2026",
    status: "Completed",
  },
  {
    id: 6,
    name: "Prakash Tamang",
    email: "prakash.tamang@gmail.com",
    initials: "PT",
    avatarColor: "bg-amber-100 text-amber-700",
    tournament: "CODM Nepal Masters",
    amount: "Rs. 350",
    method: "eSewa",
    date: "Aug 7, 2026",
    status: "Completed",
  },
];

export type PlatformAdmin = {
  id: number;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Support";
  lastActive: string;
  initials: string;
  avatarColor: string;
};

export const platformAdmins: PlatformAdmin[] = [
  {
    id: 1,
    name: "Zyro Admin",
    email: "zyro@gmail.com",
    role: "Owner",
    lastActive: "Just now",
    initials: "ZA",
    avatarColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    name: "Gun Admin",
    email: "gungun@gmail.com",
    role: "Admin",
    lastActive: "2 hours ago",
    initials: "GA",
    avatarColor: "bg-violet-100 text-violet-700",
  },
  {
    id: 3,
    name: "Support Desk",
    email: "support@arenova.gg",
    role: "Support",
    lastActive: "Yesterday",
    initials: "SD",
    avatarColor: "bg-emerald-100 text-emerald-700",
  },
];

export type AuditLog = {
  id: number;
  actor: string;
  action: string;
  target: string;
  time: string;
};

export const auditLogs: AuditLog[] = [
  {
    id: 1,
    actor: "Zyro Admin",
    action: "Approved organizer",
    target: "Kathmandu Gaming Hub",
    time: "10 mins ago",
  },
  {
    id: 2,
    actor: "Gun Admin",
    action: "Created tournament",
    target: "Dashain Esports Cup",
    time: "45 mins ago",
  },
  {
    id: 3,
    actor: "System",
    action: "Peak registration alert",
    target: "Kathmandu servers",
    time: "2 hours ago",
  },
  {
    id: 4,
    actor: "Zyro Admin",
    action: "Processed payout batch",
    target: "eSewa #12",
    time: "Yesterday",
  },
  {
    id: 5,
    actor: "Support Desk",
    action: "Refunded payment",
    target: "Riya Karki · Dashain Esports Cup",
    time: "Yesterday",
  },
  {
    id: 6,
    actor: "Gun Admin",
    action: "Suspended user",
    target: "Nabin Rai",
    time: "2 days ago",
  },
];
