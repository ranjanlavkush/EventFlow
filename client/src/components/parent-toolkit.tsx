import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Image, Presentation, Users, BookOpen, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Language, useTranslation } from "@/lib/i18n";

interface ParentToolkitProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'image' | 'presentation' | 'template';
  category: 'poster' | 'guide' | 'checklist' | 'presentation';
  language: Language[];
  fileSize: string;
  downloadUrl: string;
}

const resources: Resource[] = [
  {
    id: "aadhaar-seeding-poster",
    title: "Aadhaar Seeding Awareness Poster",
    description: "Colorful poster explaining the difference between Aadhaar-linked and DBT-enabled accounts",
    type: "image",
    category: "poster",
    language: ["en", "hi", "mai", "bho"],
    fileSize: "2.5 MB",
    downloadUrl: "/api/download/poster-aadhaar-seeding"
  },
  {
    id: "scholarship-checklist",
    title: "Scholarship Application Checklist",
    description: "Step-by-step checklist for students and parents to ensure complete application",
    type: "pdf",
    category: "checklist",
    language: ["en", "hi"],
    fileSize: "1.2 MB",
    downloadUrl: "/api/download/checklist-scholarship"
  },
  {
    id: "pta-presentation",
    title: "PTA Meeting Presentation",
    description: "Ready-to-use PowerPoint presentation for parent-teacher meetings about scholarships",
    type: "presentation",
    category: "presentation",
    language: ["en", "hi"],
    fileSize: "8.7 MB",
    downloadUrl: "/api/download/presentation-pta"
  },
  {
    id: "dbt-guide",
    title: "DBT Process Complete Guide",
    description: "Comprehensive guide explaining DBT, account seeding, and troubleshooting",
    type: "pdf",
    category: "guide",
    language: ["en", "hi", "mai", "bho"],
    fileSize: "5.4 MB",
    downloadUrl: "/api/download/guide-dbt"
  },
  {
    id: "bank-visit-template",
    title: "Bank Visit Preparation Template",
    description: "Editable template with questions to ask and documents to carry when visiting bank",
    type: "template",
    category: "checklist",
    language: ["en", "hi"],
    fileSize: "0.8 MB",
    downloadUrl: "/api/download/template-bank-visit"
  },
  {
    id: "scholarship-timeline-poster",
    title: "Annual Scholarship Timeline Poster",
    description: "Visual timeline showing key scholarship dates throughout the academic year",
    type: "image",
    category: "poster",
    language: ["en", "hi"],
    fileSize: "3.1 MB",
    downloadUrl: "/api/download/poster-timeline"
  },
  {
    id: "discussion-guide",
    title: "Community Discussion Guide",
    description: "Guide for conducting awareness sessions in villages and communities",
    type: "pdf",
    category: "guide",
    language: ["en", "hi", "mai", "bho"],
    fileSize: "2.8 MB",
    downloadUrl: "/api/download/guide-discussion"
  },
  {
    id: "quick-reference-card",
    title: "Quick Reference Card",
    description: "Printable pocket-sized card with key scholarship information and helpline numbers",
    type: "pdf",
    category: "checklist",
    language: ["en", "hi", "mai", "bho"],
    fileSize: "0.5 MB",
    downloadUrl: "/api/download/card-reference"
  }
];

export default function ParentToolkit({ isOpen, onClose, language }: ParentToolkitProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [downloadStats, setDownloadStats] = useState<Record<string, number>>({});
  const t = useTranslation(language);
  const { toast } = useToast();

  const handleDownload = (resource: Resource) => {
    // Simulate download
    toast({
      title: "Download Started",
      description: `Downloading ${resource.title}...`,
    });
    
    // Update download stats
    setDownloadStats(prev => ({
      ...prev,
      [resource.id]: (prev[resource.id] || 0) + 1
    }));

    // In a real implementation, this would trigger the actual file download
    // For now, we'll just show a success message after a delay
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${resource.title} has been downloaded successfully.`,
      });
    }, 2000);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="text-red-500" size={20} />;
      case 'image':
        return <Image className="text-blue-500" size={20} />;
      case 'presentation':
        return <Presentation className="text-orange-500" size={20} />;
      case 'template':
        return <FileCheck className="text-green-500" size={20} />;
      default:
        return <FileText className="text-gray-500" size={20} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'poster':
        return <Image size={16} />;
      case 'guide':
        return <BookOpen size={16} />;
      case 'checklist':
        return <FileCheck size={16} />;
      case 'presentation':
        return <Presentation size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const filteredResources = resources.filter(resource => 
    selectedCategory === "all" || resource.category === selectedCategory
  );

  const categories = [
    { id: "all", name: "All Resources", count: resources.length },
    { id: "poster", name: "Posters", count: resources.filter(r => r.category === "poster").length },
    { id: "guide", name: "Guides", count: resources.filter(r => r.category === "guide").length },
    { id: "checklist", name: "Checklists", count: resources.filter(r => r.category === "checklist").length },
    { id: "presentation", name: "Presentations", count: resources.filter(r => r.category === "presentation").length }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" data-testid="parent-toolkit">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="text-green-600" />
            Parent-Teacher Toolkit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Introduction */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">📚 Empower Your Community</h3>
              <p className="text-sm text-muted-foreground">
                Download these professionally designed materials to spread scholarship awareness in your school, 
                community, or PTA meetings. All resources are available in multiple languages and print-ready formats.
              </p>
            </CardContent>
          </Card>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-5 w-full">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-1 text-xs"
                  data-testid={`category-${category.id}`}
                >
                  {getCategoryIcon(category.id)}
                  <span className="hidden sm:inline">{category.name}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-start gap-3 text-base">
                        {getResourceIcon(resource.type)}
                        <div className="flex-1">
                          <div className="font-medium leading-tight">{resource.title}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {resource.type.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{resource.fileSize}</span>
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Available languages:</div>
                        <div className="flex flex-wrap gap-1">
                          {resource.language.map((lang) => (
                            <Badge key={lang} variant="secondary" className="text-xs">
                              {lang === 'en' ? 'English' : 
                               lang === 'hi' ? 'हिंदी' :
                               lang === 'mai' ? 'मैथिली' : 'भोजपुरी'}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-xs text-muted-foreground">
                          {downloadStats[resource.id] ? 
                            `${downloadStats[resource.id]} downloads` : 
                            'Ready to download'
                          }
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(resource)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          data-testid={`download-${resource.id}`}
                        >
                          <Download className="mr-2" size={14} />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Usage Guidelines */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base">📋 Usage Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">✅ Recommended Uses:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• School notice boards and classrooms</li>
                    <li>• PTA and parent meetings</li>
                    <li>• Community awareness programs</li>
                    <li>• Village panchayat meetings</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">📝 Print Instructions:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Use high-quality paper (120+ GSM)</li>
                    <li>• Print in color for maximum impact</li>
                    <li>• A3 size recommended for posters</li>
                    <li>• Regular A4 for guides and checklists</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                // Download all resources
                filteredResources.forEach(resource => handleDownload(resource));
              }}
              data-testid="download-all-button"
            >
              <Download className="mr-2" size={16} />
              Download All ({filteredResources.length})
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Sharing Kit",
                  description: "A shareable link has been copied to your clipboard!",
                });
              }}
              data-testid="share-toolkit-button"
            >
              Share Toolkit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
