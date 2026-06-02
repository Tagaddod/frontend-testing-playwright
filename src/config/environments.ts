export const ENVIRONMENTS = {
  dev: {
    GRAPHQL_URL: "https://dev2.tagaddod.com/graphql",
    GREENPAN_BASE_URL: "https://dev-greenpan.tagaddod.com",
    B2B_BASE_URL: "https://dev-b2b.tagaddod.com",
  },
  staging: {
    GRAPHQL_URL: "https://staging2.tagaddod.com/graphql",
    GREENPAN_BASE_URL: "https://staging2-greenpan.tagaddod.com",
    B2B_BASE_URL: "https://staging-b2b.tagaddod.com",
  },
  uat: {
    GRAPHQL_URL: "https://uat.tagaddod.com/graphql",
    GREENPAN_BASE_URL: "https://uat-greenpan.tagaddod.com",
    B2B_BASE_URL: "https://uat-b2b.tagaddod.com",
  }
} as const; // as const to protect the values from being changed 