import type { Metadata } from 'next';
import StyledComponentsRegistry from "../src/lib/registry";
import { weddingConfig } from "../src/config/wedding-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3075'),
  title: weddingConfig.meta.title,
  description: weddingConfig.meta.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: weddingConfig.meta.title,
    description: weddingConfig.meta.description,
    images: [
      {
        url: weddingConfig.meta.ogImage,
        width: 1200,
        height: 630,
        alt: '웨딩 청첩장',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
