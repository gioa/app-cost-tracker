import { type Application } from '../schema';

export async function getApplications(): Promise<Application[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all applications with their details.
    // Should query applications table and optionally include associated tags.
    
    // Mock applications data
    return [
        {
            id: 1,
            name: 'ML Training Pipeline',
            description: 'Machine learning model training and validation pipeline',
            creator: 'ml-team@company.com',
            workspace_id: 'ws-ml-001',
            created_at: new Date('2024-01-15'),
            updated_at: new Date('2024-04-20')
        },
        {
            id: 2,
            name: 'Data Processing Jobs',
            description: 'Daily ETL jobs for data warehouse',
            creator: 'data-team@company.com',
            workspace_id: 'ws-data-001',
            created_at: new Date('2024-02-01'),
            updated_at: new Date('2024-04-22')
        },
        {
            id: 3,
            name: 'Analytics Dashboard',
            description: null,
            creator: 'analytics@company.com',
            workspace_id: 'ws-analytics-001',
            created_at: new Date('2024-03-10'),
            updated_at: new Date('2024-04-21')
        },
        {
            id: 15,
            name: 'legacy-data-processor',
            description: null,
            creator: 'old-team@company.com',
            workspace_id: 'ws-12345',
            created_at: new Date('2023-12-01'),
            updated_at: new Date('2024-04-15')
        }
    ];
}