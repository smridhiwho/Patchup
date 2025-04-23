'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {generateImpressions} from '@/ai/flows/generate-impressions';
import {Heart, Loader2, Send} from 'lucide-react';
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Textarea} from "@/components/ui/textarea";
import {Copy} from 'lucide-react'; // Import the Copy icon
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"; // Import Tooltip components

export default function Home() {
  const [fightExplanation, setFightExplanation] = useState<string>('');
  const [fightType, setFightType] = useState<'Misunderstanding' | 'Trust' | 'Tone' | 'Overthinking' | 'Jealousy' | null>(null);
  const [userFeeling, setUserFeeling] = useState<'Angry' | 'Sad' | 'Regretful' | 'Confused' | 'Guilty' | null>(null);
  const [fightIntensity, setFightIntensity] = useState<'Light' | 'Medium' | 'Intense' | null>(null);
  const [partnerGender, setPartnerGender] = useState<'girl' | 'boy'>('girl');
  const [suggestions, setSuggestions] = useState({
    messageTemplates: [] as string[],
    conversationOpeners: [] as string[],
    gestureIdeas: [] as string[],
    whatNotToSay: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [savedSuggestions, setSavedSuggestions] = useState<string[]>([]);
  const [copyTooltip, setCopyTooltip] = useState(''); // Tooltip state

  const handleGenerateSuggestions = async () => {
    setLoading(true);
    try {
      const result = await generateImpressions({
        fightExplanation,
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

  // Handler to copy suggestion and show tooltip
  const handleCopySuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion);
    setCopyTooltip('Copied!');
    setTimeout(() => setCopyTooltip(''), 2000);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center justify-start min-h-screen py-12 px-4">
        <h1 className="text-4xl font-bold mb-4 text-center text-foreground">
          <span className="text-primary">PatchUp</span>
        </h1>
        <p className="text-muted-foreground text-center mb-8">When love gets tough💔, we help you patch it up💞</p>

        <div className="max-w-3xl w-full">
          <div className="mb-4">
            <Label htmlFor="fightExplanation" className="block text-sm font-medium text-foreground">
              Explain the fight:
            </Label>
            <Textarea
              id="fightExplanation"
              value={fightExplanation}
              onChange={(e) => setFightExplanation(e.target.value)}
              className="w-full rounded-md shadow-sm"
            />
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="elaborate">
              <AccordionTrigger>Elaborate on the Fight (Optional)</AccordionTrigger>
              <AccordionContent>

                <div className="mb-4">
                  <Label htmlFor="fightType" className="block text-sm font-medium text-foreground">
                    What kind of fight was it?
                  </Label>
                  <Select value={fightType || undefined} onValueChange={(value) => setFightType(value as any)}>
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
                  <Select value={userFeeling || undefined} onValueChange={(value) => setUserFeeling(value as any)}>
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
                  <Select value={fightIntensity || undefined} onValueChange={(value) => setFightIntensity(value as any)}>
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

              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mb-4">
            <Label className="block text-sm font-medium text-foreground">
              Your partner is a -
            </Label>
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

          <Button onClick={handleGenerateSuggestions} disabled={loading || !fightExplanation} className="w-full mb-8 rounded-md shadow-md">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Let’s Patch Things Up...
              </>
            ) : (
              'Let’s Patch Things Up'
            )}
          </Button>

          {suggestions && (
            <>
              {suggestions.messageTemplates.length > 0 && (
                <Card className="mb-4 rounded-md shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Message Templates</CardTitle>
                    <CardDescription>Tap to copy, regenerate for more.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {suggestions.messageTemplates.map((suggestion, index) => (
                      <div key={index} className="mb-4">
                        <div className="relative">
                          <CardDescription className="mb-4 text-muted-foreground">{suggestion}</CardDescription>

                          {/* Copy Button with Tooltip */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCopySuggestion(suggestion)}
                                  className="absolute right-0 top-0"
                                >
                                  <Copy className="h-4 w-4"/>
                                  <span className="sr-only">Copy suggestion</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{copyTooltip || 'Copy to clipboard'}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <Button
                            variant="outline"
                            onClick={() => handleSaveSuggestion(suggestion)}
                            className="w-1/2 rounded-md mr-2"
                          >
                            <Heart
                              className={`mr-2 h-4 w-4 ${savedSuggestions.includes(suggestion) ? 'fill-red-500 text-red-500' : ''}`}
                            />
                            {savedSuggestions.includes(suggestion) ? 'Remove from Favorites' : 'Save to Favorites'}
                          </Button>
                          <Button variant="secondary" className="w-1/2 rounded-md">
                            <Send className="mr-2 h-4 w-4"/>
                            Send (Mock)
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {suggestions.conversationOpeners.length > 0 && (
                <Card className="mb-4 rounded-md shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Conversation Openers</CardTitle>
                    <CardDescription>Ideas to get the chat flowing again.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {suggestions.conversationOpeners.map((suggestion, index) => (
                      <div key={index} className="mb-2">
                        <div className="relative">
                          <CardDescription className="mb-4 text-muted-foreground">{suggestion}</CardDescription>

                          {/* Copy Button with Tooltip */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCopySuggestion(suggestion)}
                                  className="absolute right-0 top-0"
                                >
                                  <Copy className="h-4 w-4"/>
                                  <span className="sr-only">Copy suggestion</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{copyTooltip || 'Copy to clipboard'}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <Button
                            variant="outline"
                            onClick={() => handleSaveSuggestion(suggestion)}
                            className="w-1/2 rounded-md mr-2"
                          >
                            <Heart
                              className={`mr-2 h-4 w-4 ${savedSuggestions.includes(suggestion) ? 'fill-red-500 text-red-500' : ''}`}
                            />
                            {savedSuggestions.includes(suggestion) ? 'Remove from Favorites' : 'Save to Favorites'}
                          </Button>
                          <Button variant="secondary" className="w-1/2 rounded-md">
                            <Send className="mr-2 h-4 w-4"/>
                            Send (Mock)
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {suggestions.gestureIdeas.length > 0 && (
                <Card className="mb-4 rounded-md shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Gesture Ideas</CardTitle>
                    <CardDescription>Thoughtful ways to show you care.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {suggestions.gestureIdeas.map((suggestion, index) => (
                      <div key={index} className="mb-2">
                        <div className="relative">
                          <CardDescription className="mb-4 text-muted-foreground">{suggestion}</CardDescription>

                          {/* Copy Button with Tooltip */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCopySuggestion(suggestion)}
                                  className="absolute right-0 top-0"
                                >
                                  <Copy className="h-4 w-4"/>
                                  <span className="sr-only">Copy suggestion</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{copyTooltip || 'Copy to clipboard'}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <Button
                            variant="outline"
                            onClick={() => handleSaveSuggestion(suggestion)}
                            className="w-1/2 rounded-md mr-2"
                          >
                            <Heart
                              className={`mr-2 h-4 w-4 ${savedSuggestions.includes(suggestion) ? 'fill-red-500 text-red-500' : ''}`}
                            />
                            {savedSuggestions.includes(suggestion) ? 'Remove from Favorites' : 'Save to Favorites'}
                          </Button>
                          <Button variant="secondary" className="w-1/2 rounded-md">
                            <Send className="mr-2 h-4 w-4"/>
                            Send (Mock)
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {suggestions.whatNotToSay.length > 0 && (
                <Card className="mb-4 rounded-md shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">What Not To Say</CardTitle>
                    <CardDescription>Tips to avoid escalating the conflict.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {suggestions.whatNotToSay.map((suggestion, index) => (
                      <div key={index} className="mb-2">
                        <div className="relative">
                          <CardDescription className="mb-4 text-muted-foreground">{suggestion}</CardDescription>

                          {/* Copy Button with Tooltip */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCopySuggestion(suggestion)}
                                  className="absolute right-0 top-0"
                                >
                                  <Copy className="h-4 w-4"/>
                                  <span className="sr-only">Copy suggestion</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{copyTooltip || 'Copy to clipboard'}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <Button
                            variant="outline"
                            onClick={() => handleSaveSuggestion(suggestion)}
                            className="w-1/2 rounded-md mr-2"
                          >
                            <Heart
                              className={`mr-2 h-4 w-4 ${savedSuggestions.includes(suggestion) ? 'fill-red-500 text-red-500' : ''}`}
                            />
                            {savedSuggestions.includes(suggestion) ? 'Remove from Favorites' : 'Save to Favorites'}
                          </Button>
                          <Button variant="secondary" className="w-1/2 rounded-md">
                            <Send className="mr-2 h-4 w-4"/>
                            Send (Mock)
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

