import type { Metadata } from "next";
import "./globals.css";
import { ConvexProviderWrapper } from "@/components/providers/convex-provider";

export const metadata: Metadata = {
  title: "ClassLinker",
  description: "Your Google Classroom inbox, simplified.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ConvexProviderWrapper>{children}</ConvexProviderWrapper>
      </body>
    </html>
  );
}
