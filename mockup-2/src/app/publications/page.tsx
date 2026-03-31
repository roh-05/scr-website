// src/app/publications/page.tsx
import prisma from "@/lib/prisma";
import PublicationsClient from "./PublicationsClient";

// Helper to translate Prisma ENUMs into your UI's exact button names
function formatDept(dept: string) {
  if (dept === 'EQUITY_RESEARCH') return 'Equity Research';
  if (dept === 'MERGERS_ACQUISITIONS') return 'M&A';
  if (dept === 'QUANTITATIVE_FINANCE') return 'Quantitative Research';
  if (dept === 'ECONOMIC_RESEARCH') return 'Economic Research';
  return dept;
}

export default async function PublicationsPage() {
  // 1. Fetch only PUBLISHED reports directly from the database
  const rawReports = await prisma.report.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' }, // Newest first
  });

  // 2. Format the data into a clean, serializable object for the Client component
  const reports = rawReports.map((r) => ({
    id: r.id,
    title: r.title,
    department: formatDept(r.department),
    authorNames: r.authorNames,
    fileUrl: r.fileUrl,
    // Convert the Date object to an ISO string to pass it safely to the client
    date: r.publishedAt ? r.publishedAt.toISOString() : r.createdAt.toISOString(),
  }));

  // 3. Render the interactive UI, injecting the live database data
  return <PublicationsClient initialReports={reports} />;
}