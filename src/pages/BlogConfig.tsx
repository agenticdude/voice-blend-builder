import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

const BlogConfig = () => {
  const [blogTitle, setBlogTitle] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [contentSource, setContentSource] = useState("");
  const [webSearch, setWebSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!blogTitle || !seoKeywords || !contentSource) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://n8n.dev.aioapp.com/webhook/5a6f3605-f853-4dee-b751-9d4b657a81bf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blog_title: blogTitle,
          seo_keywords: seoKeywords,
          content_source: contentSource,
          web_search: webSearch,
        }),
      });

      if (response.ok) {
        toast({
          title: "Submitted successfully!",
          description: "Your blog configuration has been saved.",
        });
        
        // Navigate to the second form after a brief delay
        setTimeout(() => {
          navigate("/advanced-config");
        }, 1500);
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Blog Creator
            </h1>
          </div>
          <p className="text-muted-foreground">
            Configure your blog settings to get started
          </p>
        </div>

        <Card className="bg-gradient-card border-border/20 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-xl">Basic Configuration</CardTitle>
            <CardDescription>
              Set up the foundation for your blog content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="blog-title" className="text-sm font-medium">
                  Blog Title
                </Label>
                <Input
                  id="blog-title"
                  type="text"
                  placeholder="Enter your blog title..."
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  className="bg-background/50 border-border/60 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo-keywords" className="text-sm font-medium">
                  SEO Keywords
                </Label>
                <Input
                  id="seo-keywords"
                  type="text"
                  placeholder="keyword1, keyword2, keyword3..."
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  className="bg-background/50 border-border/60 focus:border-primary transition-colors"
                />
                <p className="text-xs text-muted-foreground">
                  Separate keywords with commas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-source" className="text-sm font-medium">
                  Content Source
                </Label>
                <Select value={contentSource} onValueChange={setContentSource}>
                  <SelectTrigger className="bg-background/50 border-border/60">
                    <SelectValue placeholder="Choose content source..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border/60">
                    <SelectItem value="Web Search">Web Search</SelectItem>
                    <SelectItem value="AI Generated">AI Generated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-1">
                  <Label htmlFor="web-search" className="text-sm font-medium">
                    Enable Web Search
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Include web search results in content generation
                  </p>
                </div>
                <Switch
                  id="web-search"
                  checked={webSearch}
                  onCheckedChange={setWebSearch}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full mt-8" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Continue to Advanced Settings"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogConfig;