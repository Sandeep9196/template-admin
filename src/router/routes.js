const routes = [
  {
    name: "Page: Login",
    path: "/auth/login",
    component: () => import("src/pages/Login.vue"),
  },
  {
    path: "/",
    meta: { requiresAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "/",
        component: () => import("src/pages/Dashboard.vue"),
        meta: { title: "Home", subtitle: "Dashboard" },
      },
      // LOG HISTORY
      {
        name: "audit-logs",
        path: "/audit-logs",
        component: () => import("src/pages/LogHistory/AuditLog.vue"),
        meta: { title: "Home", subtitle: "Activity Logs" },
      },
      {
        name: "admin-logins",
        path: "/admin-logins",
        component: () => import("src/pages/LogHistory/AdminLoginLog.vue"),
        meta: { title: "Home", subtitle: "Admin Login" },
      },
      {
        name: "member-logins",
        path: "/member-logins",
        component: () => import("src/pages/LogHistory/MemberLoginLog.vue"),
        meta: { title: "Home", subtitle: "Member Login" },
      },
      // ACL
      {
        name: "roles",
        path: "/roles",
        component: () => import("pages/Role/Index.vue"),
        meta: { title: "Home", subtitle: "Roles" },
      },
      {
        name: "permissions",
        path: "/permissions",
        component: () => import("pages/Permission/Index.vue"),
        meta: { title: "Home", subtitle: "Permissions" },
      },
      // MASTER DATA
      {
        name: "languages",
        path: "/languages",
        component: () => import("pages/Language/Index.vue"),
        meta: { title: "Home", subtitle: "Languages" },
      },
      {
        name: "whitelist-ips",
        path: "/whitelist-ips",
        component: () => import("pages/WhitelistIP/Index.vue"),
        meta: { title: "Home", subtitle: "Whitelist IPs" },
      },
      // USER MANAGEMENT
      {
        name: "users",
        path: "/users",
        component: () => import("pages/User/Index.vue"),
        meta: { title: "Home", subtitle: "Users" },
      },
      // Currency MANAGEMENT
      {
        name: "currencies",
        path: "/currencies",
        component: () => import("src/pages/Currency/Index.vue"),
        meta: { title: "Home", subtitle: "Currency" },
      },
      // Currency MANAGEMENT
      {
        name: "country-state",
        path: "/country-state",
        component: () => import("src/pages/Country-State/Index.vue"),
        meta: { title: "Currency", subtitle: "Country State" },
      },
      // Product MANAGEMENT
      {
        name: "catelogue",
        path: "/products",
        component: () => import("pages/Product/Index.vue"),
        meta: { title: "Catelogue", subtitle: "Catelogue" },
      },
      // Caltalogue MANAGEMENT
      {
        name: "category",
        path: "/categoies",
        component: () => import("pages/Category/Index.vue"),
        meta: { title: "Category", subtitle: "Category" },
      },
      // Tag MANAGEMENT
      {
        name: "tag",
        path: "/tags",
        component: () => import("pages/Tag/Index.vue"),
        meta: { title: "Tags", subtitle: "Tags" },
      },
      // Order MANAGEMENT
      {
        name: "order",
        path: "/orders",
        component: () => import("src/pages/Orders/Index.vue"),
        meta: { title: "Orders", subtitle: "Orders" },
      },
      // Order MANAGEMENT
      {
        name: "prize",
        path: "/prize",
        component: () => import("src/pages/PrizeClaim/Index.vue"),
        meta: { title: "Prize Claim", subtitle: "Prize Claim" },
      },
      // Members MANAGEMENT
      {
        name: "members",
        path: "/members",
        component: () => import("pages/Members/Index.vue"),
        meta: { title: "Members", subtitle: "Members" },
      },
      // Setting MANAGEMENT
      {
        name: "settings",
        path: "/settings",
        component: () => import("pages/Settings/Index.vue"),
        meta: { title: "Settings", subtitle: "Settings" },
      },
      // Carriers MANAGEMENT
      {
        name: "carriers",
        path: "/carriers",
        component: () => import("pages/Carriers/Index.vue"),
        meta: { title: "Carriers", subtitle: "Carriers" },
      },
      // Banner
      {
        name: "banner",
        path: "/banner",
        component: () => import("pages/Banner/Index.vue"),
        meta: { title: "Banner", subtitle: "Banner" },
      },
      // layout
      {
        name: "layout",
        path: "/layout",
        component: () => import("pages/Layout/Index.vue"),
        meta: { title: "layout website", subtitle: "layout website" },
      },
      // menu
      {
        name: "menu",
        path: "/menu",
        component: () => import("pages/Menu/Index.vue"),
        meta: { title: "Menu", subtitle: "Menu" },
      },
         // menu
         {
          name: "templates",
          path: "/templates",
          component: () => import("pages/Template/Index.vue"),
          meta: { title: "templates", subtitle: "templates" },
        },

      // Bot
      {
        name: "bot",
        path: "/bots",
        component: () => import("pages/Bots/Index.vue"),
        meta: { title: "Bots", subtitle: "Bots" },
      },

      // transaction
      {
        name: "transaction",
        path: "/transactions",
        component: () => import("pages/Transaction/Index.vue"),
        meta: { title: "Transactions", subtitle: "Transactions" },
      },
      // payment-gateway
      {
        name: "payment-gateway",
        path: "/payment-gateway",
        component: () => import("pages/PaymentGateway/Index.vue"),
        meta: { title: "Payment Gateway", subtitle: "Payment Gateway" },
      },
      // Winner List Report
      {
        name: "winner-list",
        path: "/winner-list",
        component: () => import("pages/Winner/Index.vue"),
        meta: { title: "Winner Report", subtitle: "Winner List" },
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
