import { type Recommendation } from '../schema';

export async function getRecommendations(): Promise<Recommendation[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching AI-generated cost optimization recommendations.
    // Initially returns mock data, later will connect to AI service.
    
    // Mock data for initial implementation
    return [
        {
            id: 1,
            title: "Optimize Cluster Autoscaling",
            description: "Your clusters are running idle 40% of the time. Enable aggressive autoscaling to reduce costs by an estimated $2,400/month.",
            potential_savings: 2400.00,
            priority: "high" as const,
            category: "compute",
            is_active: true,
            created_at: new Date()
        },
        {
            id: 2,
            title: "Right-size Instance Types",
            description: "Several workloads are over-provisioned. Consider switching to smaller instance types for non-critical jobs.",
            potential_savings: 800.00,
            priority: "medium" as const,
            category: "compute",
            is_active: true,
            created_at: new Date()
        },
        {
            id: 3,
            title: "Schedule Non-Critical Jobs",
            description: "Run non-critical data processing jobs during off-peak hours to take advantage of lower pricing.",
            potential_savings: 600.00,
            priority: "low" as const,
            category: "scheduling",
            is_active: true,
            created_at: new Date()
        }
    ];
}