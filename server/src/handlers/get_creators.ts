import { type CostFilters } from '../schema';

export async function getCreators(filters?: CostFilters): Promise<string[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching unique creators/users for the filter dropdown.
    // Should query applications table and return distinct creator values.
    
    // Mock creators data
    return [
        'data-team@company.com',
        'ml-team@company.com',
        'analytics@company.com',
        'devops@company.com',
        'research@company.com',
        'old-team@company.com',
        'frontend-team@company.com',
        'backend-team@company.com'
    ];
}