import { json } from "@remix-run/node"
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node"
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react"
import Footer from "./components/Footer"
import GlobalSpinner from "./components/GlobalSpiner"
import LiveReload from "./components/LiveReload"
import { getTheme, toggleTheme } from "./lib/themeCookie.server"
import tailwind from "./tailwind.css"

export function links() {
  return [
    { rel: "stylesheet", href: tailwind },
  ]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: 'Juan D. Jara',
  description: 'pagina web personal / blogfolio de Juan D. Jara',
  viewport: "width=device-width,initial-scale=1",
})

export async function loader({ request }: LoaderArgs) {
  return {
    theme: await getTheme(request)
  }
}

export async function action({ request }: ActionArgs) {
  const cookie = await toggleTheme(request)
  return json({ ok: true }, {
    headers: {
      'Set-Cookie': cookie
    }
  })
}

export default function App() {
  const { theme } = useLoaderData<{ theme: string }>()
  return (
    <html lang="es" className={theme}>
      <head>
        <meta name="color-scheme" content="dark light" />
        <Meta />
        <Links />
      </head>
      <body className="bg-cyan-50 dark:bg-cyan-900 text-stone-800 dark:text-white">
        <GlobalSpinner />
        <div className="max-w-prose md:mx-20 px-3">
          <Outlet />
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)
  return (
    <html>
      <head>
        <title>Oh noes! 💥</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="max-w-xl bg-red-50 text-red-800 rounded-xl my-8 mx-auto p-4">
          <h1 className="text-2xl font-bold text-red-600">
            Boom! <span role='img' aria-label='explosion'>💥</span>
          </h1>
          <h2 className="mt-1 text-xl font-bold text-red-600">There was an unexpected error</h2>
          <p className="my-2 text-lg">{error.message}</p>
        </div>
        <Scripts />
      </body>
    </html>
  )
}

export function CatchBoundary() {
  const { status, statusText, data } = useCatch()
  const title = `${status} ${statusText}`

  return (
    <html>
      <head>
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="h-screen flex flex-col items-center justify-center text-slate-700 text-center">
          <span className="text-xl" role='img' aria-label='Worried face'>😟</span>
          <p className="text-2xl">
            {status === 404 ? 'There is nothing here' : `I'm sorry`}
          </p>
          <div className="my-6">
            <p className="text-xl font-semibold">{title}</p>
            <p className="text-base">{data?.message}</p>
          </div>
          <Link to="/" className="bg-slate-700 text-white rounded-lg px-4 py-2">Take me home</Link>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
