import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy } from "lucide-react";
import { RichTextEditor } from "@/components/RichTextEditor";

const CreateContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [editableContent, setEditableContent] = useState("");
  const { toast } = useToast();

  const formatContent = (text: string) => {
    return text
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/<\/ul>\s*<ul>/g, '')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hul])/gm, '<p>')
      .replace(/(?<![>])\n(?![<])/g, '</p><p>')
      .replace(/<p><\/p>/g, '')
      .replace(/^<p>(<h[1-6]>)/gm, '$1')
      .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
      .replace(/^<p>(<ul>)/gm, '$1')
      .replace(/(<\/ul>)<\/p>/g, '$1')
      .replace(/^<p>(<li>)/gm, '$1')
      .replace(/(<\/li>)<\/p>/g, '$1');
  };

  const handleGenerateContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://n8n.dev.aioapp.com/webhook/6ea1b457-5d59-41be-8dda-b588521c5a7b", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.text();
        const formattedContent = formatContent(data);
        setContent(data);
        setEditableContent(formattedContent);
        toast({
          title: "Success!",
          description: "Content generated successfully!",
        });
      } else {
        throw new Error("Failed to generate content");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(editableContent);
      toast({
        title: "Success!",
        description: "Content copied to clipboard!",
      });
    } catch (error) {
      console.error("Failed to copy content:", error);
      toast({
        title: "Error",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Create Content
          </h1>
          <p className="text-muted-foreground text-lg">
            Generate formatted content for your blog
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/50 border-primary/20 shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Content Generation</CardTitle>
            <CardDescription>
              Generate and copy your formatted blog content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!content && (
              <div className="text-center">
                <Button
                  onClick={handleGenerateContent}
                  disabled={isLoading}
                  size="lg"
                  className="min-w-48"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Generating content...
                    </>
                  ) : (
                    "Generate Content"
                  )}
                </Button>
              </div>
            )}

            {content && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      Generated Content
                    </h3>
                    <Button
                      onClick={handleCopyContent}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Content
                    </Button>
                  </div>
                  
                  <RichTextEditor 
                    content={editableContent}
                    onChange={setEditableContent}
                  />
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleGenerateContent}
                    variant="outline"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Regenerating...
                      </>
                    ) : (
                      "Regenerate Content"
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

export default CreateContent;