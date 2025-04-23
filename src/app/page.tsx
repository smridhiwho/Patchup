'use client';

import {useState} from 'react';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {generateImpressions} from '@/ai/flows/generate-impressions';
import {Heart, Loader2} from 'lucide-react';
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";

export default function Home() {
  const [argumentDescription, setArgumentDescription] = useState('');
  const [partnerGender, setPartnerGender] = useState<'girl' | 'boy'>('girl'); // Default to girl
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSuggestions, setSavedSuggestions] = useState<string[]>([]);

  const handleGenerateSuggestions = async () => {
    setLoading(true);
    try {
      const result = await generateImpressions({argumentDescription, partnerGender});
      setSuggestions(result?.suggestions || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setSuggestions(['Failed to generate suggestions. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSuggestion = (suggestion: string) => {
    setSuggestions(prevSuggestions => {
      return prevSuggestions.map(s => {
        if (s === suggestion) {
          return {
            ...s,
            saved: !savedSuggestions.includes(suggestion),
          };
        }
        return s;
      });
    });
    if (savedSuggestions.includes(suggestion)) {
      setSavedSuggestions(savedSuggestions.filter(s => s !== suggestion));
    } else {
      setSavedSuggestions([...savedSuggestions, suggestion]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-12 bg-background">
      <h1 className="text-4xl font-bold mb-8 text-center text-foreground">Charm Advisor</h1>
      <div className="max-w-3xl w-full px-4">
        <Textarea
          placeholder="Describe the argument with your partner..."
          value={argumentDescription}
          onChange={(e) => setArgumentDescription(e.target.value)}
          className="mb-4 rounded-md shadow-sm"
        />

        <div className="mb-4">
          <RadioGroup defaultValue="girl" className="flex gap-2" onValueChange={(value) => setPartnerGender(value as 'girl' | 'boy')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="girl" id="girl"/>
              <Label htmlFor="girl">Girl</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="boy" id="boy"/>
              <Label htmlFor="boy">Boy</Label>
            </div>
          </RadioGroup>
        </div>

        <Button onClick={handleGenerateSuggestions} disabled={loading} className="w-full mb-8 rounded-md shadow-md">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Suggestions...
            </>
          ) : (
            'Generate Suggestions'
          )}
        </Button>
        {suggestions.length > 0 && (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="rounded-md shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Suggestion {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-muted-foreground">{suggestion}</CardDescription>
                  <Button
                    variant="outline"
                    onClick={() => handleSaveSuggestion(suggestion)}
                    className="w-full rounded-md"
                  >
                    <Heart
                      className={`mr-2 h-4 w-4 ${
                        savedSuggestions.includes(suggestion) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                    {savedSuggestions.includes(suggestion) ? 'Remove from Favorites' : 'Save to Favorites'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
