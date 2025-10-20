'use server';

/**
 * @fileOverview Sales report generation flow.
 *
 * - generateSalesReport - A function that generates a sales report using an LLM.
 * - GenerateSalesReportInput - The input type for the generateSalesReport function.
 * - GenerateSalesReportOutput - The return type for the generateSalesReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSalesReportInputSchema = z.object({
  startDate: z.string().describe('The start date for the sales report (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date for the sales report (YYYY-MM-DD).'),
  specificDetails: z.string().optional().describe('Any specific details or requests for the report.'),
});
export type GenerateSalesReportInput = z.infer<typeof GenerateSalesReportInputSchema>;

const GenerateSalesReportOutputSchema = z.object({
  report: z.string().describe('The generated sales report.'),
});
export type GenerateSalesReportOutput = z.infer<typeof GenerateSalesReportOutputSchema>;

export async function generateSalesReport(input: GenerateSalesReportInput): Promise<GenerateSalesReportOutput> {
  return generateSalesReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSalesReportPrompt',
  input: {schema: GenerateSalesReportInputSchema},
  output: {schema: GenerateSalesReportOutputSchema},
  prompt: `You are an expert sales analyst. Generate a sales report based on the provided data.

  Start Date: {{{startDate}}}
  End Date: {{{endDate}}}
  Specific Details: {{{specificDetails}}}

  Please provide a comprehensive sales report, including total revenue, table utilization rates, and any other relevant insights. Format the report in a clear and concise manner.
  `,
});

const generateSalesReportFlow = ai.defineFlow(
  {
    name: 'generateSalesReportFlow',
    inputSchema: GenerateSalesReportInputSchema,
    outputSchema: GenerateSalesReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
