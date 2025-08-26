import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdvancedConfig = () => {
  const [voiceType, setVoiceType] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [contentStructure, setContentStructure] = useState("");
  const [contentLength, setContentLength] = useState("");
  const [additionalOptions, setAdditionalOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const additionalOptionsData = [
    { id: "faqs", label: "FAQs" },
    { id: "bullets", label: "Bullets or Table" },
    { id: "citations", label: "Citations" },
  ];

  const handleAdditionalOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setAdditionalOptions(prev => [...prev, optionId]);
    } else {
      setAdditionalOptions(prev => prev.filter(id => id !== optionId));
    }
  };

  const handleSelectAll = () => {
    if (additionalOptions.length === additionalOptionsData.length) {
      setAdditionalOptions([]);
    } else {
      setAdditionalOptions(additionalOptionsData.map(option => option.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!voiceType || !brandVoice || !contentStructure || !contentLength) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://n8n.dev.aioapp.com/webhook-test/6ea1b457-5d59-41be-8dda-b588521c5a7b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voice_type: voiceType,
          brand_voice: brandVoice,
          content_structure: contentStructure,
          content_length: contentLength,
          additional_options: additionalOptions.map(id => 
            additionalOptionsData.find(option => option.id === id)?.label
          ).filter(Boolean),
        }),
      });

      if (response.ok) {
        toast({
          title: "Submitted successfully!",
          description: "Your advanced configuration has been saved.",
        });
        // Navigate to outline creation
        navigate("/outline-creation");
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="bg-gradient-card border-border/20 shadow-elegant max-w-md w-full">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Configuration Complete!</h2>
            <p className="text-muted-foreground mb-6">
              Your blog settings have been successfully saved and processed.
            </p>
            <Button 
              onClick={() => navigate("/")} 
              variant="outline"
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Basic Settings
          </Button>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Advanced Configuration
            </h1>
          </div>
          <p className="text-muted-foreground">
            Fine-tune your content settings for optimal results
          </p>
        </div>

        <Card className="bg-gradient-card border-border/20 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-xl">Content Customization</CardTitle>
            <CardDescription>
              Configure the style, structure, and format of your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Voice Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Voice Type</Label>
                  <Select value={voiceType} onValueChange={setVoiceType}>
                    <SelectTrigger className="bg-background/50 border-border/60">
                      <SelectValue placeholder="Select voice type..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border/60">
                      <SelectItem value="Personal Voice (I, Me, My)">Personal Voice (I, Me, My)</SelectItem>
                      <SelectItem value="Talk to the Reader (You, Your)">Talk to the Reader (You, Your)</SelectItem>
                      <SelectItem value="Describe Others (He, She, They)">Describe Others (He, She, They)</SelectItem>
                      <SelectItem value="Collective Voice (We, Us, Our)">Collective Voice (We, Us, Our)</SelectItem>
                      <SelectItem value="Professional Voice (No Pronouns)">Professional Voice (No Pronouns)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand Voice Style */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Brand Voice Style</Label>
                  <Select value={brandVoice} onValueChange={setBrandVoice}>
                    <SelectTrigger className="bg-background/50 border-border/60">
                      <SelectValue placeholder="Select brand voice..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border/60">
                      <SelectItem value="Professional and Authoritative Brand Voice Characteristics">Professional and Authoritative</SelectItem>
                      <SelectItem value="Tech-Savvy and Innovative Brand Voice">Tech-Savvy and Innovative</SelectItem>
                      <SelectItem value="Customer-Centric and Compassionate Brand Voice">Customer-Centric and Compassionate</SelectItem>
                      <SelectItem value="Inspirational and Motivational Brand Voice">Inspirational and Motivational</SelectItem>
                      <SelectItem value="Storytelling Brand Voice Characteristics">Storytelling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Structure */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Content Structure</Label>
                  <Select value={contentStructure} onValueChange={setContentStructure}>
                    <SelectTrigger className="bg-background/50 border-border/60">
                      <SelectValue placeholder="Select structure..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border/60">
                      <SelectItem value="Listicle Structure">Listicle Structure</SelectItem>
                      <SelectItem value="How to guide blog">How to guide blog</SelectItem>
                      <SelectItem value="Comparison">Comparison</SelectItem>
                      <SelectItem value="Problem Solution">Problem Solution</SelectItem>
                      <SelectItem value="Ultimate Guide">Ultimate Guide</SelectItem>
                      <SelectItem value="Pros and Cons">Pros and Cons</SelectItem>
                      <SelectItem value="What's in it for Me?">What's in it for Me?</SelectItem>
                      <SelectItem value="Myth-Busting">Myth-Busting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Length */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Content Length (words)</Label>
                  <Select value={contentLength} onValueChange={setContentLength}>
                    <SelectTrigger className="bg-background/50 border-border/60">
                      <SelectValue placeholder="Select length..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border/60">
                      <SelectItem value="500">500 words</SelectItem>
                      <SelectItem value="1000">1,000 words</SelectItem>
                      <SelectItem value="1500">1,500 words</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Output Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Additional Output Options</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {additionalOptions.length === additionalOptionsData.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {additionalOptionsData.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={additionalOptions.includes(option.id)}
                        onCheckedChange={(checked) => 
                          handleAdditionalOptionChange(option.id, !!checked)
                        }
                      />
                      <Label
                        htmlFor={option.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-8" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Generate Content"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedConfig;