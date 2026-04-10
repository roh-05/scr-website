// src/app/alumni/page.tsx
import prisma from "@/lib/prisma";
import AlumniClient from "./AlumniClient";

// Helper to translate Prisma ENUMs into your UI's exact button names
function formatDept(dept: string) {
  if (dept === 'EQUITY_RESEARCH') return 'Equity Research';
  if (dept === 'MERGERS_ACQUISITIONS') return 'Mergers & Acquisitions';
  if (dept === 'QUANTITATIVE_FINANCE') return 'Quantitative Finance';
  if (dept === 'ECONOMIC_RESEARCH') return 'Economic Research';
  return dept;
}

export default async function AlumniPage() {
  // Fetch only members who have been marked as ALUMNI
  const rawAlumni = await prisma.teamMember.findMany({
    where: { status: 'ALUMNI' },
    orderBy: { classYear: 'desc' }, // Order by newest graduates first
  });

  // Map the database structure to the specific props the UI expects
  const mappedAlumni = rawAlumni.map((a) => ({
    id: a.id,
    name: `${a.firstName} ${a.lastName}`,
    scrRole: a.role,
    department: formatDept(a.department),
    classYear: a.classYear,
    currentRole: a.currentRole,
    company: a.currentCompany,
    location: a.location,
    linkedin: a.linkedinUrl,
    imageUrl: a.imageUrl,
    quote: a.alumniQuote,
  }));

  return <AlumniClient initialAlumni={mappedAlumni} />;
}