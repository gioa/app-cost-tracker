import { type Tag } from '../schema';

export async function getTags(): Promise<Tag[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all available tags for filtering and assignment.
    
    // Mock tags data
    return [
        {
            id: 1,
            name: 'Production',
            description: 'Production workloads and applications',
            color: '#ff0000',
            created_at: new Date('2024-01-01')
        },
        {
            id: 2,
            name: 'Development',
            description: 'Development and testing environments',
            color: '#00ff00',
            created_at: new Date('2024-01-01')
        },
        {
            id: 3,
            name: 'Analytics',
            description: 'Data analytics and reporting jobs',
            color: '#0000ff',
            created_at: new Date('2024-01-01')
        },
        {
            id: 4,
            name: 'Machine Learning',
            description: 'ML training and inference workloads',
            color: '#ff9900',
            created_at: new Date('2024-01-01')
        },
        {
            id: 5,
            name: 'Data Processing',
            description: 'ETL and data transformation jobs',
            color: '#9900ff',
            created_at: new Date('2024-01-01')
        }
    ];
}