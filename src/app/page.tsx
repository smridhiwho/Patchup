
'use client';

import {useState} from 'react';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {generateImpressions} from '@/ai/flows/generate-impressions';
import {Heart, Loader2} from 'lucide-react';

export default function Home() {
  const [argumentDescription, setArgumentDescription] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSuggestions, setSavedSuggestions] = useState<string[]>([]);

  const handleGenerateSuggestions = async () => {
    setLoading(true);
    try {
      const result = await generateImpressions({argumentDescription});
      setSuggestions(result?.suggestions || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setSuggestions(['Failed to generate suggestions. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSuggestion = (suggestion: string) => {
    if (savedSuggestions.includes(suggestion)) {
      setSavedSuggestions(savedSuggestions.filter(s => s !== suggestion));
    } else {
      setSavedSuggestions([...savedSuggestions, suggestion]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-12 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Charm Advisor</h1>
      <div className="max-w-3xl w-full px-4">
        <Textarea
          placeholder="Describe the argument with your girlfriend..."
          value={argumentDescription}
          onChange={(e) => setArgumentDescription(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleGenerateSuggestions} disabled={loading} className="w-full mb-8">
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
              <Card key={index} className="bg-white shadow-md rounded-md">
                <CardHeader>
                  <CardTitle>Suggestion {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{suggestion}</CardDescription>
                  <Button
                    variant="outline"
                    onClick={() => handleSaveSuggestion(suggestion)}
                    className="w-full"
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
