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
  // 1. Fetch data from the database
  const [rawReports, deptMetadata] = await Promise.all([
    prisma.report.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.departmentMetadata.findMany({
      select: { department: true, tagColor: true }
    })
  ]);

  // 2. Create a color mapping for the client
  const departmentColors: Record<string, string> = {};
  deptMetadata.forEach(meta => {
    if (meta.tagColor) {
      departmentColors[meta.department] = meta.tagColor;
    }
  });

  // 3. Format the data into a clean, serializable object for the Client component
  const reports = rawReports.map((r) => ({
    id: r.id,
    title: r.title,
    department: formatDept(r.department),
    departmentEnum: r.department, // Keep the enum for color lookup
    authorNames: r.authorNames,
    fileUrl: r.fileUrl,
    coverUrl: r.coverUrl,
    excerpt: r.excerpt,
    tags: r.tags,
    date: r.publishedAt ? r.publishedAt.toISOString() : r.createdAt.toISOString(),
  }));

  // 4. Render the interactive UI, injecting the live database data
  return (
    <PublicationsClient 
      initialReports={reports} 
      departmentColors={departmentColors}
    />
  );
}