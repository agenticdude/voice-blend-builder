import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const OutlineCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [outline, setOutline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCreateOutline = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://n8n.dev.aioapp.com/webhook-test/6ea1b457-5d59-41be-8dda-b588521c5a7b", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.text();
        setOutline(data);
        toast({
          title: "Success!",
          description: "Outline fetched successfully!",
        });
      } else {
        throw new Error("Failed to fetch outline");
      }
    } catch (error) {
      console.error("Error fetching outline:", error);
      toast({
        title: "Error",
        description: "Failed to fetch outline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOutline = async () => {
    if (!outline.trim()) {
      toast({
        title: "Error",
        description: "Please create an outline before submitting.",
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
          final_outline: outline,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Outline submitted successfully!",
        });
        setOutline("");
        // Navigate to create content page
        window.location.href = "/create-content";
      } else {
        throw new Error("Failed to submit outline");
      }
    } catch (error) {
      console.error("Error submitting outline:", error);
      toast({
        title: "Error",
        description: "Failed to submit outline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Outline Creation
          </h1>
          <p className="text-muted-foreground text-lg">
            Create and edit your content outline
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/50 border-primary/20 shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your Outline</CardTitle>
            <CardDescription>
              Generate an outline and customize it to your needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!outline && (
              <div className="text-center">
                <Button
                  onClick={handleCreateOutline}
                  disabled={isLoading}
                  size="lg"
                  className="min-w-48"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Fetching outlines...
                    </>
                  ) : (
                    "Create Outline"
                  )}
                </Button>
              </div>
            )}

            {outline && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Edit Your Outline
                  </label>
                  <Textarea
                    value={outline}
                    onChange={(e) => setOutline(e.target.value)}
                    placeholder="Your outline will appear here..."
                    className="min-h-80 resize-none font-mono text-sm bg-background/50 border-primary/20 focus:border-primary/40"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleCreateOutline}
                    variant="outline"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Regenerating...
                      </>
                    ) : (
                      "Regenerate Outline"
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleSubmitOutline}
                    disabled={isSubmitting || !outline.trim()}
                    size="lg"
                    className="min-w-48"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Outline"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OutlineCreation;