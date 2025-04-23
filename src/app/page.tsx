'use client';

import {useState} from 'react';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {generateImpressions} from '@/ai/flows/generate-impressions';
import {Heart, Loader2} from 'lucide-react';
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function Home() {
  const [fightType, setFightType] = useState<'Misunderstanding' | 'Trust' | 'Tone' | 'Overthinking' | 'Jealousy'>('Misunderstanding');
  const [userFeeling, setUserFeeling] = useState<'Angry' | 'Sad' | 'Regretful' | 'Confused' | 'Guilty'>('Angry');
  const [fightIntensity, setFightIntensity] = useState<'Light' | 'Medium' | 'Intense'>('Light');
  const [partnerGender, setPartnerGender] = useState<'girl' | 'boy'>('girl');
  const [suggestions, setSuggestions] = useState({
    messageTemplates: [] as string[],
    conversationOpeners: [] as string[],
    gestureIdeas: [] as string[],
    whatNotToSay: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [savedSuggestions, setSavedSuggestions] = useState<string[]>([]);

  const handleGenerateSuggestions = async () => {
    setLoading(true);
    try {
      const result = await generateImpressions({
        fightType,
        userFeeling,
        fightIntensity,
        partnerGender,
      });
      setSuggestions(result || {
        messageTemplates: [],
        conversationOpeners: [],
        gestureIdeas: [],
        whatNotToSay: [],
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setSuggestions({
        messageTemplates: ['Failed to generate suggestions. Please try again.'],
        conversationOpeners: [],
        gestureIdeas: [],
        whatNotToSay: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSuggestion = (suggestion: string) => {
    setSavedSuggestions(prev =>
      prev.includes(suggestion) ? prev.filter(s => s !== suggestion) : [...prev, suggestion]
    );
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-12 bg-background">
      <h1 className="text-4xl font-bold mb-8 text-center text-foreground">Charm Advisor</h1>
      <div className="max-w-3xl w-full px-4">

        <div className="mb-4">
          <Label htmlFor="fightType" className="block text-sm font-medium text-foreground">
            What kind of fight was it?
          </Label>
          <Select value={fightType} onValueChange={(value) => setFightType(value as any)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a fight type"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Misunderstanding">Misunderstanding</SelectItem>
              <SelectItem value="Trust">Trust</SelectItem>
              <SelectItem value="Tone">Tone</SelectItem>
              <SelectItem value="Overthinking">Overthinking</SelectItem>
              <SelectItem value="Jealousy">Jealousy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Label htmlFor="userFeeling" className="block text-sm font-medium text-foreground">
            How are you feeling?
          </Label>
          <Select value={userFeeling} onValueChange={(value) => setUserFeeling(value as any)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select how you're feeling"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Angry">Angry</SelectItem>
              <SelectItem value="Sad">Sad</SelectItem>
              <SelectItem value="Regretful">Regretful</SelectItem>
              <SelectItem value="Confused">Confused</SelectItem>
              <SelectItem value="Guilty">Guilty</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Label htmlFor="fightIntensity" className="block text-sm font-medium text-foreground">
            How serious was the fight?
          </Label>
          <Select value={fightIntensity} onValueChange={(value) => setFightIntensity(value as any)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select the fight intensity"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Light">Light</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Intense">Intense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <RadioGroup defaultValue="girl" className="flex gap-2"
                      onValueChange={(value) => setPartnerGender(value as 'girl' | 'boy')}>
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              Generating Suggestions...
            </>
          ) : (
            'Generate Suggestions'
          )}
        </Button>

        {suggestions && (
          <>
            {suggestions.messageTemplates.length > 0 && (
              <Card className="mb-4 rounded-md shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Message Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  {suggestions.messageTemplates.map((suggestion, index) => (
                    <div key={index} className="mb-2">
                      <CardDescription className="mb-4 text-muted-foreground">{suggestion}</CardDescription>
                      <Button
                        variant="outline"
                        onClick={() => handleSaveSuggestion(suggestion)}
                        className="w-full rounded-md"
                      >
                        <Heart
                          className={`mr-2 h-4 w-4 ${savedSuggestions.includes(suggestion) ? 'fill-red-500 text-red-500' : ''}`}
                        />
                        {savedSuggestions.includes(suggestion) ? 'Remove from Favorites' : 'Save to Favorites'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {suggestions.conversationOpeners.length > 0 && (
              <Card className="mb-4 rounded-md shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Conversation Openers</CardTitle>
                </CardHeader>
                <CardContent>
                  {suggestions.conversationOpeners.map((suggestion, index) => (
                    <div key={index} className="mb-2">
                      <CardDescription className="mb-4 text-muted-foreground">{suggestion}</CardDescription>
                      <Button
                        variant="outline"
                        onClick={() => handleSaveSuggestion(suggestion)}
                        className="w-full rounded-md"
                      >
                        <Heart
                          className={`mr-2 h-4 w-4 ${savedSuggestions.includes(suggestion) ? 'fill-red-500 text-red-500' : ''}`}
                        />
                        {savedSuggestions.includes(suggestion) ? 'Remove from Favorites' : 'Save to Favorites'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {suggestions.gestureIdeas.length > 0 && (
              <Card className="mb-4 rounded-md shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Gesture Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  {suggestions.gestureIdeas.map((suggestion, index) => (
                    <div key={index} className="mb-2">
                      <CardDescription className="mb-4 text-muted-foreground">{suggestion}</CardDescription>
                      <Button
                        variant="outline"
                        onClick={() => handleSaveSuggestion(suggestion)}
                        className="w-full rounded-md"
                      >
                        <Heart
                          className={`mr-2 h-4 w-4 ${savedSuggestions.includes(suggestion) ? 'fill-red-500 text-red-500' : ''}`}
                        />
                        {savedSuggestions.includes(suggestion) ? 'Remove from Favorites' : 'Save to Favorites'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {suggestions.whatNotToSay.length > 0 && (
              <Card className="mb-4 rounded-md shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">What Not To Say</CardTitle>
                </CardHeader>
                <CardContent>
                  {suggestions.whatNotToSay.map((suggestion, index) => (
                    <div key={index} className="mb-2">
                      <CardDescription className="mb-4 text-muted-foreground">{suggestion}</CardDescription>
                      <Button
                        variant="outline"
                        onClick={() => handleSaveSuggestion(suggestion)}
                        className="w-full rounded-md"
                      >
                        <Heart
                          className={`mr-2 h-4 w-4 ${savedSuggestions.includes(suggestion) ? 'fill-red-500 text-red-500' : ''}`}
                        />
                        {savedSuggestions.includes(suggestion) ? 'Remove from Favorites' : 'Save to Favorites'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
