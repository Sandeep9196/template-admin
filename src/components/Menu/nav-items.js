export default {


  calalogue_management: {
    label: "catelogue",
    icon: "mdi-shape-outline",
    to: { name: "catelogue" },
    permissions: [
      "Category: View Category",
      "Category: Create Category",
      "Category: Edit/Update Category",
      "Category: Delete Category",
      "Product: View Product",
      "Product: Create Product",
      "Product: Edit/Update Product",
      "Product: Delete Product",
      "Tag: View Tag",
      "Tag: Create Tag",
      "Tag: Edit/Update Tag",
      "Tag: Delete Tag",
    ],
    children: []
  },
  order_management: {
    label: "Order Management",
    permissions: [
      "Transaction: View Transaction",
      "Transaction: Create Transaction",
      "Transaction: Edit/Update Transaction",
      "Transaction: Delete Transaction",
      "Payment Gateway: View Payment Gateway",
      "Payment Gateway: Create Payment Gateway",
      "Payment Gateway: Update Payment Gateway",
      "Payment Gateway: Delete Payment Gateway",
      "Order: View Order",
      "Order: Edit/Update Order",
      "Order: Delete Order",
      "Order: Views Order",
    ],
    children: [
      {
        label: "Transactions",
        icon: "mdi-transcribe-close",
        to: { name: "transaction" },
        permissions: ["Transaction: View Transaction", "Transaction: Edit/Update Transaction"],
      },

      {
        label: "Orders",
        icon: "mdi-order-bool-descending-variant",
        to: { name: "order" },
        permissions: ["Order: View Order", "Order: Views Order"],
      },
    ],
  },


  admin_management: {
    label: "Admin Management",
    permissions: [
      "User: View User",
      "User: Create User",
      "User: Edit/Update User",
      "User: Delete User",
      "Role: View Role",
      "Role: Create Role",
      "Role: Edit/Update Role",
      "Role: Delete Role",
      "Members: View All Members",
      "Members: View Members",
      "Members: Views Members",
      "Members: Create Members",
      "Members: Edit/Update Members",
      "Members: Delete Members",
      "Permission: View Permission",
      "Bots: View Bots",
      "Bots: View Pagination Bots"
    ],
    children: [
      {
        label: "Users",
        icon: "mdi-account-multiple-outline",
        to: { name: "users" },
        permissions: ["User: View User", "User: Create User"],
      },
      {
        label: "Member List",
        icon: "mdi-account-multiple-outline",
        to: { name: "members" },
        permissions: ["Members: View Members", "Members: Create Members"],
      },

      {
        label: "Roles",
        icon: "mdi-account-cog-outline",
        to: { name: "roles" },
        permissions: ["Role: View Role", "Role: Create Role"],
      },
      {
        label: "Permissions",
        icon: "mdi-shield-key-outline",
        to: { name: "permissions" },
        permissions: ["Permission: View Permission"],
      },
    ],
  },
  system_settings: {
    label: "System Settings",
    permissions: [
      "Currency: View Currency",
      "Currency: Create Currency",
      "Currency: Edit/Update Currency",
      "Currency: Delete Currency",
      "Language: View Language",
      "Language: Create Language",
      "Language: Edit/Update Language",
      "Language: Delete Language",
      "Whitelist IP: View Whitelist IP",
      "Whitelist IP: Create Whitelist IP",
      "Whitelist IP: Edit/Update Whitelist IP",
      "Whitelist IP: Delete Whitelist IP",
      "State: View State",
      "State: Create State",
      "State: Edit/Update State",
      "State: Delete State",
      "Country: View Country",
      "Country: Create Country",
      "Country: Edit/Update Country",
      "Country: Delete Country",
      "Banner: View Banner",
      "Banner: Create Banner",
      "Banner: Edit/Update Banner",
      "Banner: Delete Banner",
      "Setting: View Setting",
    ],
    children: [

      {
        label: "Country-State",
        icon: "mdi-flag",
        to: { name: "country-state" },
        permissions: ["Country: View Country", "Country: Create Country", "State: View State", "State: Create State"],
      },
      {
        label: "Currencies",
        icon: "mdi-currency-usd",
        to: { name: "currencies" },
        permissions: ["Currency: View Currency", "Currency: Create Currency"],
      },
      {
        label: "Languages",
        icon: "mdi-translate",
        to: { name: "languages" },
        permissions: ["Language: View Language", "Language: Create Language"],
      },
      {
        label: "Whitelist IP",
        icon: "mdi-desktop-mac",
        to: { name: "whitelist-ips" },
        permissions: [
          "Whitelist IP: View Whitelist IP",
          "Whitelist IP: Create Whitelist IP",
        ],
      },
      {
        label: "Banner",
        icon: "mdi-picture-in-picture-top-right-outline",
        to: { name: "banner" },
        permissions: ["Banner: View Banner", "Banner: Create Banner"],
      },
      {
        label: "templates",
        icon: "mdi-layers-triple",
        to: { name: "templates" },
        permissions: ["Setting: View Setting"],
      },
      {
        label: "layout website",
        icon: "mdi-page-layout-header-footer",
        to: { name: "layout" },
        permissions: ["Setting: View Setting"],
      },

      {
        label: "Menu",
        icon: "mdi-menu",
        to: { name: "menu" },
        permissions: ["Setting: View Setting"],
      },
    ],
  },
  log_history: {
    label: "Logs",
    permissions: ["Report: View Audit Logs"],
    children: [
      {
        label: "Activity Logs",
        icon: "mdi-clipboard-pulse-outline",
        to: { name: "audit-logs" },
        permissions: ["Report: View Audit Logs"],
      },
      {
        label: "Admin Login",
        icon: "mdi-clipboard-list-outline",
        to: { name: "admin-logins" },
        permissions: ["Report: View Audit Logs"],
      },
      {
        label: "Member Login",
        icon: "mdi-clipboard-list-outline",
        to: { name: "member-logins" },
        permissions: ["Report: View Audit Logs"],
      },
    ],
  },
};
