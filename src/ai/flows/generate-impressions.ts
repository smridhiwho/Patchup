'use server';
/**
 * @fileOverview An AI agent that generates personalized suggestions on how to impress a girlfriend/boyfriend based on mood, context of fight and gender.
 *
 * - generateImpressions - A function that handles the generation of suggestions.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateImpressionsInputSchema = z.object({
  fightExplanation: z.string().describe('A comprehensive explanation of the fight between the user and their partner.'),
  fightType: z.enum([
    'Misunderstanding',
    'Trust',
    'Tone',
    'Overthinking',
    'Jealousy',
  ]).describe('The type of fight you had with your partner.').nullable(),
  userFeeling: z.enum([
    'Angry',
    'Sad',
    'Regretful',
    'Confused',
    'Guilty',
  ]).describe('How you are feeling after the fight.').nullable(),
  fightIntensity: z.enum([
    'Light',
    'Medium',
    'Intense',
  ]).describe('How serious was the fight.').nullable(),
  partnerGender: z.enum(['girl', 'boy']).describe('The gender of the partner.'),
});
export type GenerateImpressionsInput = z.infer<typeof GenerateImpressionsInputSchema>;

const GenerateImpressionsOutputSchema = z.object({
  messageTemplates: z.array(z.string()).describe('A few message templates (sweet, funny, honest).'),
  conversationOpeners: z.array(z.string()).describe('Suggested conversation openers.'),
  gestureIdeas: z.array(z.string()).describe('Thoughtful gesture ideas (e.g., send flowers).'),
  whatNotToSay: z.array(z.string()).describe('“What Not to Say Right Now” tips.'),
});
export type GenerateImpressionsOutput = z.infer<typeof GenerateImpressionsOutputSchema>;

export async function generateImpressions(input: GenerateImpressionsInput): Promise<GenerateImpressionsOutput> {
  return generateImpressionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImpressionsPrompt',
  input: {
    schema: z.object({
      fightExplanation: z.string().describe('A comprehensive explanation of the fight between the user and their partner.'),
      fightType: z.enum([
        'Misunderstanding',
        'Trust',
        'Tone',
        'Overthinking',
        'Jealousy',
      ]).describe('The type of fight you had with your partner.').nullable(),
      userFeeling: z.enum([
        'Angry',
        'Sad',
        'Regretful',
        'Confused',
        'Guilty',
      ]).describe('How you are feeling after the fight.').nullable(),
      fightIntensity: z.enum([
        'Light',
        'Medium',
        'Intense',
      ]).describe('How serious was the fight.').nullable(),
      partnerGender: z.enum(['girl', 'boy']).describe('The gender of the partner.'),
    }),
  },
  output: {
    schema: z.object({
      messageTemplates: z.array(z.string()).describe('A few message templates (sweet, funny, honest).'),
      conversationOpeners: z.array(z.string()).describe('Suggested conversation openers.'),
      gestureIdeas: z.array(z.string()).describe('Thoughtful gesture ideas (e.g., send flowers).'),
      whatNotToSay: z.array(z.string()).describe('“What Not to Say Right Now” tips.'),
    }),
  },
  prompt: `You are a relationship expert. Given the user's comprehensive explanation of the fight, how the user is feeling, the intensity of the fight, and the partner's gender, generate suggestions on how to impress her/him.

Here are some guiding principles for the suggestions:

1.  Message Templates: Provide 3 message templates that vary in tone: sweet, funny, and honest.
2.  Conversation Openers: Suggest 2 conversation openers that can help initiate a positive dialogue.
3.  Gesture Ideas: Offer 2 thoughtful gesture ideas that can help express remorse and affection. These can range from simple to more elaborate, depending on the intensity of the fight.
4.  What Not to Say: Provide 2 tips on what to avoid saying in order to prevent escalating the conflict.

Here is the data:
Fight Explanation: {{{fightExplanation}}}
Fight Type: {{{fightType}}}
User Feeling: {{{userFeeling}}}
Fight Intensity: {{{fightIntensity}}}
Partner Gender: {{{partnerGender}}}

Return the suggestions as a JSON object with the keys "messageTemplates", "conversationOpeners", "gestureIdeas", and "whatNotToSay". Each key should have an array of strings as its value.`,
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
