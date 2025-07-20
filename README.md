# 🔧 StatusPage Frontend

A sleek, multi-tenant status page frontend built with **Next.js (App Router)** and **TypeScript**. Designed for SaaS-style service monitoring with organization-specific dashboards and public status pages.

<br/>

## 🚀 Features

- ✅ **Dynamic Routing** — `/[org]/dashboard`, `/[org]/status`, etc.
- 🔐 **Auth Modal** — Login/Register with token-based flow
- 🌐 **Public Status Page** — Show real-time service status for any org
- 🧭 **Dashboard** — Add/edit services, monitor incidents
- 🧩 **Reusable Components** — Cards, Badges, Modals, Hooks
- 🎨 **Dark-Slate Themed UI** — Clean, modern aesthetics using Tailwind + Ant Design
- 🌍 **Multi-Org Support** — Each org has isolated context (like `/netflix`, `/openai`, etc.)

<br/>

## 🧱 Tech Stack

| Layer         | Tech                                               |
| ------------- | -------------------------------------------------- |
| **Framework** | [Next.js 14 (App Router)](https://nextjs.org/docs) |
| **Lang**      | TypeScript                                         |
| **UI Kit**    | TailwindCSS + shadcn-ui + Ant Design               |
| **State**     | Redux Toolkit                                      |
| **API Calls** | Axios                                              |
| **Routing**   | Dynamic Segments via App Router                    |

<br/>

## 🗂 Folder Structure

```

src/
│
├── app/ # Next.js app routes
│ ├── \[org]/dashboard/
│ └── \[org]/status/
│
├── components/ # Shared UI components
├── features/ # Redux slices
├── hooks/ # Custom hooks (e.g. statusColor logic)
├── lib/ # Utils (auth, token handling)
├── constants/ # Config vars
└── styles/ # Global styles

```

<br/>

## ⚙️ Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-org/statuspage-frontend.git
   cd statuspage-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Create `.env.local`:

   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

App will run at: `http://localhost:3000/[org]/dashboard`

<br/>

## ✨ Usage Example

Open `http://localhost:3000/google/dashboard` to manage Netflix services.

```ts
router.push(`/${org}/dashboard`);
```

Use `useParams()` to extract `org` from URL:

```ts
const { org } = useParams();
```

Use `useStatusOptions()` hook to get status color and label:

```ts
const { statusCodeToColor, statusCodeToString } = useStatusOptions();
```

<br/>

## 📦 Deployment

Supports deployment on Vercel, Render, or any platform supporting Next.js App Router.

```bash
npm run build
npm start
```

Make sure your `.env` is properly configured in the production environment.
