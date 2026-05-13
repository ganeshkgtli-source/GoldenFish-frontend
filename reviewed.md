# GoldenFish Frontend — Project Review (Current Status + Improvements Needed)

> Based on code reading of the existing frontend architecture (Vite + React + TanStack Router + React Query + Zustand + Tailwind) and concrete inspection of the current authentication/KYC implementation.


## Current project status (high level)

- **Core architecture is in place**: TanStack Router route files exist and a generated `routeTree.gen.ts` is present. React Query, Zustand, Tailwind, and Axios-based API layer appear wired.
- **Auth & KYC flow exists end-to-end**:
  - Route: `src/routes/kyc_verification.tsx` → `src/features/auth/pages/KycVerificationPage.tsx`
  - API call: `src/features/auth/api/authApi.ts` (`/kyc_verify/`)
  - Hook: `src/features/auth/hooks/useAuth.ts` (`useKycVerification`)
  - Store: `src/store/authStore.ts` (persists `is_kyc_verified`)
- **Quality varies across the codebase**: some sections show strong patterns (e.g., `parseError`), while others show formatting/structure problems that can harm build stability and maintainability.

## What’s good

1. **Error parsing exists and is reusable**
   - `parseError()` in `src/features/auth/api/authApi.ts` provides consistent user-facing error strings.

2. **API + mutation approach is generally consistent**
   - KYC uses a mutation with `submitKycVerification(formData)` and throws parsed errors.

3. **Auth state persistence is present**
   - Zustand store persists auth state, including `is_kyc_verified`.

## What needs improvement (priority)

### 1) KYC page code health (highest priority)
**File:** `src/features/auth/pages/KycVerificationPage.tsx`

Concrete findings from reading the file:
- The file content shows **severe formatting/structural defects** (indentation/blocks appear corrupted/unglued).
- This is not just “style”—it can cause:
  - build/compile failures,
  - runtime issues,
  - high maintenance risk.

Required improvement:
- Reformat and correct the component structure so `handleSubmit` is properly scoped and JSX return is syntactically correct.

### 2) KYC success logic is not fully aligned with backend response

Concrete issue pattern:
- The page navigates to `/dashboard` after `mutateAsync(formData)` without verifying the returned payload indicates verification success.
- The hook updates `is_kyc_verified` only if `data?.is_kyc_verified` is truthy.

Required improvement:
- Navigate only when backend confirms KYC verification (e.g., `data.is_kyc_verified === true`).
- Optionally show a success message/state before redirecting.

### 3) Remove debug logging of submitted FormData
**File:** `src/features/auth/pages/KycVerificationPage.tsx`

Concrete issue pattern:
- The page logs `FormData` entries via `console.log` loops.

Required improvement:
- Remove debug logs before production.

### 4) Avoid submitting empty email when user/profile is missing

Concrete issue pattern:
- KYC form uses `user?.email || ""`.
- If `user` is `null` (e.g., refresh timing or rehydration not complete), `email` becomes an empty string.

Required improvement:
- Block submit with a clear UI error if `user` or `user.email` is missing.
- Alternatively, trigger profile load before allowing KYC submit.

### 5) Add client-side validation for KYC fields (UX + error reduction)

Required improvement:
- Validate:
  - **Aadhaar**: digits only + length checks.
  - **PAN**: regex format + uppercase normalization.
  - **IFSC**: uppercase normalization + format checks.
  - **Account number / holder name**: numeric/length/name checks.
- This reduces backend rejects and improves user experience.

## Suggested next steps (implementation checklist)

1. **Fix and reformat** `KycVerificationPage.tsx` so it compiles and is maintainable.
2. **Remove** FormData debug `console.log`.
3. **Change submit success flow**:
   - only redirect to `/dashboard` when backend confirms verification.
4. **Guard submit** when `user?.email` is missing (show error / load profile).
5. **Add client validation** for Aadhaar, PAN, IFSC, account number.


