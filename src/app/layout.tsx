import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings, getSiteIconUrl } from "@/lib/wordpress";

const GA_ID        = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID       = process.env.NEXT_PUBLIC_GTM_ID;
const FB_PIXEL     = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const ADX_CLIENT   = process.env.NEXT_PUBLIC_ADX_CLIENT;
const CUSTOM_SCRIPT = process.env.NEXT_PUBLIC_CUSTOM_SCRIPT_SRC; // ex: https://cdn.sendwebpush.com/...

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [settings, iconUrl] = await Promise.all([
    getSiteSettings(),
    getSiteIconUrl(),
  ]);

  return {
    title: settings?.title || process.env.NEXT_PUBLIC_SITE_NAME || "Meu Blog WordPress",
    description: settings?.description || "Blog powered by WordPress + Next.js + GraphQL",
    icons: iconUrl
      ? { icon: iconUrl, shortcut: iconUrl, apple: iconUrl }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* ── Script de ad/header externo (ex: AdX, redes de anúncio)
             Equivalente a: <script async src="..."> no <head>
             strategy="afterInteractive" = async, não bloqueia render ── */}
        {CUSTOM_SCRIPT && (
          <Script
            src={CUSTOM_SCRIPT}
            strategy="afterInteractive"
            charSet="UTF-8"
          />
        )}

        {/* ── GTM: afterInteractive — precisa estar pronto cedo ── */}
        {GTM_ID && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}

        {/* ── AdSense / AdX: afterInteractive — não pode atrasar impressões ── */}
        {ADX_CLIENT && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADX_CLIENT}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}

        {/* ── Google Analytics: lazyOnload — não é crítico ── */}
        {GA_ID && !GTM_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}

        {/* ── Facebook Pixel: lazyOnload ── */}
        {FB_PIXEL && (
          <Script id="fb-pixel" strategy="lazyOnload">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${FB_PIXEL}');fbq('track','PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
