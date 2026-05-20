# TODO

## Admin/Strategy/Operations enterprise chunk isolation

- [x] Convert eager imports in:
  - src/routes/admin/dashboard.tsx
  - src/routes/admin/orders.tsx
  - src/routes/admin/errors.tsx
  - src/routes/admin/clients.tsx
  - src/routes/admin/client/$id.tsx
  - src/routes/admin/profile.tsx
  - src/routes/super-admin/dashboard.tsx
  - src/routes/super-admin/createstrategies.tsx
  to `React.lazy(() => import(...))`.


- [x] Wrap each lazy-loaded route component render with:
  `<Suspense fallback={<PageLoader />}> ... </Suspense>`


- [x] Ensure `beforeLoad` remains unchanged and still calls `requireAdmin()`.


- [ ] Do NOT modify:
  - routeTree.gen.ts
  - generated TanStack router files
  - any API logic / business logic
  - hooks and shared UI components

- [ ] After changes, run `npm run build` and inspect chunk splitting via `stats.html` (or generated dist assets).



- [x] Document expected bundle impact + remaining heavy dependencies in final report.



