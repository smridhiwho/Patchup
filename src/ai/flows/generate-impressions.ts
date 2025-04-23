'use server';
/**
 * @fileOverview An AI agent that generates personalized suggestions on how to impress a girlfriend/boyfriend based on the description of an argument and gender.
 *
 * - generateImpressions - A function that handles the generation of suggestions.
 * - GenerateImpressionsInput - The input type for the generateImpressions function.
 * - GenerateImpressionsOutput - The return type for the generateImpressions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateImpressionsInputSchema = z.object({
  argumentDescription: z.string().describe('The description of the argument with the partner.'),
  partnerGender: z.enum(['girl', 'boy']).describe('The gender of the partner.'), // Added gender
});
export type GenerateImpressionsInput = z.infer<typeof GenerateImpressionsInputSchema>;

const GenerateImpressionsOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('A list of personalized suggestions on how to impress the partner.')
  ).describe('The list of personalized suggestions.'),
});
export type GenerateImpressionsOutput = z.infer<typeof GenerateImpressionsOutputSchema>;

export async function generateImpressions(input: GenerateImpressionsInput): Promise<GenerateImpressionsOutput> {
  return generateImpressionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImpressionsPrompt',
  input: {
    schema: z.object({
      argumentDescription: z.string().describe('The description of the argument with the partner.'),
      partnerGender: z.enum(['girl', 'boy']).describe('The gender of the partner.'), // Added gender
    }),
  },
  output: {
    schema: z.object({
      suggestions: z.array(
        z.string().describe('A list of personalized suggestions on how to impress the partner.')
      ).describe('The list of personalized suggestions.'),
    }),
  },
  prompt: `You are a relationship expert. Given the description of an argument with a partner, and the partner's gender, generate a list of personalized suggestions on how to impress her/him. Return the suggestions as a JSON array of strings.
      \n\nArgument Description: {{{argumentDescription}}}
      \n\nPartner Gender: {{{partnerGender}}}`, // Changed template syntax to Handlebars and added gender context
});

const generateImpressionsFlow = ai.defineFlow<
  typeof GenerateImpressionsInputSchema,
  typeof GenerateImpressionsOutputSchema
>({
  name: 'generateImpressionsFlow',
  inputSchema: GenerateImpressionsInputSchema,
  outputSchema: GenerateImpressionsOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
