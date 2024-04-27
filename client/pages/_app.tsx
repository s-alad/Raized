import Layout from "@/layout/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import RedirectBasedOnAuth from "@/redirect/redirect";
import AuthProvider from "@/authentication/authcontext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <RedirectBasedOnAuth>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RedirectBasedOnAuth>
    </AuthProvider>
  )
}
