import React from "react";

export default function DashboardLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main>
      <section>
        <h1>{title}</h1>
        {children}
      </section>
    </main>
  );
}
