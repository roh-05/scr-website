"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/lib/types";

export type RecentActivityItem = {
    id: string;
    type: "REPORT" | "TEAM";
    title: string;
    subtitle: string;
    date: Date;
    url?: string;
};

export async function getRecentActivity(): Promise<ActionResponse<RecentActivityItem[]>> {
    try {
        // Fetch 3 most recent reports
        const recentReports = await prisma.report.findMany({
            orderBy: { createdAt: "desc" },
            take: 4,
        });

        // Fetch 2 most recently added team members
        const recentTeam = await prisma.teamMember.findMany({
            orderBy: { createdAt: "desc" },
            take: 3,
        });

        const activity: RecentActivityItem[] = [];

        recentReports.forEach(r => {
            activity.push({
                id: r.id,
                type: "REPORT",
                title: `Report ${r.status.toLowerCase()}: ${r.title}`,
                subtitle: `by ${r.authorNames}`,
                date: r.createdAt,
                url: r.fileUrl,
            });
        });

        recentTeam.forEach(t => {
            activity.push({
                id: t.id,
                type: "TEAM",
                title: `New team member: ${t.firstName} ${t.lastName}`,
                subtitle: `${t.role} (${t.department.replace('_', ' ')})`,
                date: t.createdAt,
            });
        });

        // Sort combined array by date descending
        activity.sort((a, b) => b.date.getTime() - a.date.getTime());

        // Return only top 5 combined items
        return { success: true, data: activity.slice(0, 5) };
    } catch (error) {
        console.error("[DASHBOARD FETCH ERROR]:", error);
        return { success: false, error: "Failed to load recent activity from database." };
    }
}
