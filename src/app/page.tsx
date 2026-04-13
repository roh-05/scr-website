import prisma from "@/lib/prisma";
import { getSiteSettings } from "@/actions/settings";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  // 1. Fetch live data from the database
  const settingsResult = await getSiteSettings();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings = (settingsResult.success ? settingsResult.data : null) as any;
  
  // 2. Fetch the 3 most recently published reports
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recentReports = await prisma.report.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: 3,
  }) as any[];

  // 3. Fetch live stats
  const activeMembersCount = await prisma.teamMember.count({ where: { status: 'ACTIVE' } });
  const alumniCount = await prisma.teamMember.count({ where: { status: 'ALUMNI' } });
  const reportsCount = await prisma.report.count({ where: { status: 'PUBLISHED' } });

  return (
    <HomeClient 
      settings={settings}
      recentReports={recentReports}
      activeMembersCount={activeMembersCount}
      alumniCount={alumniCount}
      reportsCount={reportsCount}
    />
  );
}