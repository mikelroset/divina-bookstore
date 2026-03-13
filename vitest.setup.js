import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Mock Firebase per evitar auth/invalid-api-key a CI (sense clau API)
vi.mock("./src/services/firebase", () => ({
  db: {},
  auth: {},
  googleProvider: {},
}));

afterEach(() => {
  cleanup();
});
