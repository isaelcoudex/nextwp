import RedirectCountdown from "@/components/RedirectCountdown";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redirecionando...",
  robots: { index: false, follow: false },
};

interface RedirectPageProps {
  searchParams: Promise<{ url?: string }>;
}

export default async function RedirectPage({ searchParams }: RedirectPageProps) {
  const { url } = await searchParams;
  const destination = decodeURIComponent(url ?? "");

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <RedirectCountdown url={destination} />
    </div>
  );
}
