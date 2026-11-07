export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  LOAN_OFFICER: "LOAN_OFFICER",
  ADMIN: "ADMIN",
  SUPERADMIN: "SUPERADMIN"
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const LOAN_STATUSES = {
  SUBMITTED: "SUBMITTED",
  PENDING: "PENDING",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  DISBURSED: "DISBURSED",
  ACTIVE: "ACTIVE",
  CLOSED: "CLOSED"
} as const;

export type LoanStatus = (typeof LOAN_STATUSES)[keyof typeof LOAN_STATUSES];

export const KYC_STATUSES = {
  PENDING: "PENDING",
  UNDER_REVIEW: "UNDER_REVIEW",
  VERIFIED: "VERIFIED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
} as const;

export type KycStatus = (typeof KYC_STATUSES)[keyof typeof KYC_STATUSES];

export const API_ENDPOINTS = {
  health: {
    live: "/health/live",
    ready: "/health/ready"
  },
  ledger: {
    entries: "/ledger/entries"
  },
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    register: "/auth/register",
    verifyOtp: "/auth/verify-otp"
  },
  loans: {
    create: "/loans",
    getAll: "/loans",
    getById: (id: string | number) => `/loans/${id}`,
    approve: (id: string | number) => `/loans/${id}/approve`,
    reject: (id: string | number) => `/loans/${id}/reject`,
    update: (id: string | number) => `/loans/${id}`
  },
  kyc: {
    submit: "/kyc/submit",
    getStatus: "/kyc/status",
    uploadDocument: "/kyc/upload-document",
    verifyFace: "/kyc/verify-face"
  },
  users: {
    getAll: "/users",
    getById: (id: string | number) => `/users/${id}`,
    create: "/users",
    updateRole: (id: string | number) => `/users/${id}/role`,
    delete: (id: string | number) => `/users/${id}`
  }
};

