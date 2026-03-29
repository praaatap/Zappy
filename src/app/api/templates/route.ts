// Templates API - Get workflow templates

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Template } from '@/lib/models';
import { workflowTemplates, templateCategories } from '@/lib/templates';

/**
 * GET /api/templates
 * Get all available workflow templates
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { search, category } = Object.fromEntries(request.nextUrl.searchParams);

    // Filter templates based on search and category
    let filteredTemplates = workflowTemplates;

    if (category && category !== 'All') {
      filteredTemplates = filteredTemplates.filter(
        (t) => t.category === category
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTemplates = filteredTemplates.filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      templates: filteredTemplates,
      categories: templateCategories,
      total: filteredTemplates.length,
    });
  } catch (error: any) {
    console.error('Get templates error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
