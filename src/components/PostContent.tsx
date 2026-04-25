"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

interface PostContentProps {
  html: string;
  className?: string;
}

export default function PostContent({ html, className }: PostContentProps) {
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignora âncoras internas (#), links relativos e mailto/tel
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      try {
        const url = new URL(href, window.location.href);
        // Só intercepta se for domínio externo
        if (url.origin !== window.location.origin) {
          e.preventDefault();
          router.push(`/redirect?url=${encodeURIComponent(url.href)}`);
        }
      } catch {
        // URL inválida — deixa o comportamento padrão
      }
    },
    [router]
  );

  return (
    <div
      className={className}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
