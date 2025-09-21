import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Eye, Share2, Clock, Globe, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Language, useTranslation } from "@/lib/i18n";

// Alternative approach without ReactPlayer dependency
interface VideoSectionProps {
  language: Language;
}

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  views: string;
  languages: string;
  thumbnail: string;
  embedUrl?: string;
}

const videos: Video[] = [
  {
    id: "aadhaar-seeding-guide",
    title: "Complete Guide to Aadhaar Seeding",
    description: "Learn how to seed your bank account with Aadhaar for seamless DBT transfers and scholarship payments.",
    duration: "15 minutes",
    views: "125,234 views",
    languages: "Hindi & English",
    thumbnail: "bg-primary",
    embedUrl: "https://www.youtube.com/embed/0tYLwHISb84?si=EJudORv30M03r61R"
  },
  {
    id: "dbt-troubleshooting",
    title: "Common DBT Issues & Solutions",
    description: "Quick solutions for common issues faced during DBT verification and fund transfer processes.",
    duration: "8 minutes",
    views: "89,567 views",
    languages: "Regional Languages",
    thumbnail: "bg-secondary",
    embedUrl: "https://www.youtube.com/embed/uoXt_6UQkAg?si=vHdz84ASoIxU1VPN"
  },
  {
    id: "scholarship-application",
    title: "Step-by-Step Scholarship Application",
    description: "Complete walkthrough of the online scholarship application process with tips and best practices.",
    duration: "12 minutes",
    views: "156,890 views",
    languages: "Hindi & English",
    thumbnail: "bg-accent"
  },
  {
    id: "bank-account-setup",
    title: "Setting Up Your First Bank Account",
    description: "Everything students need to know about opening a bank account for scholarship purposes.",
    duration: "10 minutes",
    views: "67,432 views",
    languages: "Multi-language",
    thumbnail: "bg-purple-600"
  }
];

export default function VideoSection({ language }: VideoSectionProps) {
  const t = useTranslation(language);
  const { toast } = useToast();
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const handleShareVideo = (video: Video) => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: video.embedUrl || window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(video.embedUrl || window.location.href).then(() => {
        toast({
          title: "Link Copied",
          description: "Video link has been copied to your clipboard!",
        });
      });
    }
  };

  const handlePlayVideo = (video: Video) => {
    if (video.embedUrl) {
      setActiveVideo(video);
    } else {
      toast({
        title: "Video Coming Soon",
        description: "This video will be available shortly.",
      });
    }
  };

  return (
    <section className="py-16 bg-background" data-testid="video-section">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Watch & Learn: DBT and Aadhaar Seeding</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understand the difference between Aadhaar-linked and DBT-enabled accounts through our comprehensive video guides
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Featured Video */}
          <div className="md:col-span-2 lg:col-span-1">
            <Card className="overflow-hidden border border-border hover:shadow-lg transition-shadow">
              <div className="relative aspect-video bg-muted flex items-center justify-center group cursor-pointer">
                <div className={`absolute inset-0 ${videos[0].thumbnail} opacity-80`} />
                <div className="relative z-10 text-center text-white">
                  <Button
                    onClick={() => handlePlayVideo(videos[0])}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/50 w-16 h-16 rounded-full mb-4 group-hover:scale-110 transition-transform"
                    data-testid={`play-video-${videos[0].id}`}
                  >
                    <Play className="ml-1" size={24} />
                  </Button>
                  <p className="font-medium">{videos[0].title}</p>
                  <div className="flex items-center justify-center gap-4 mt-2 text-sm opacity-90">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {videos[0].duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe size={14} />
                      {videos[0].languages}
                    </span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-2">{videos[0].title}</h4>
                <p className="text-muted-foreground mb-4">{videos[0].description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Eye className="mr-2" size={16} />
                    <span>{videos[0].views}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShareVideo(videos[0])}
                    data-testid={`share-video-${videos[0].id}`}
                  >
                    <Share2 className="mr-2" size={14} />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video List */}
          <div className="space-y-4">
            {videos.slice(1).map((video) => (
              <Card key={video.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div 
                      className={`relative w-24 h-16 ${video.thumbnail} rounded flex items-center justify-center flex-shrink-0 cursor-pointer group`}
                      onClick={() => handlePlayVideo(video)}
                    >
                      <Play className="text-white group-hover:scale-110 transition-transform" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm leading-tight mb-1 line-clamp-2">
                        {video.title}
                      </h5>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {video.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {video.duration}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleShareVideo(video)}
                      className="flex-shrink-0"
                      data-testid={`share-video-${video.id}`}
                    >
                      <Share2 size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Video Categories */}
        <div className="mt-12 grid md:grid-cols-4 gap-4">
          {[
            { name: "Aadhaar Basics", count: "12 videos", icon: "🆔" },
            { name: "DBT Process", count: "8 videos", icon: "💰" },
            { name: "Bank Procedures", count: "6 videos", icon: "🏦" },
            { name: "Troubleshooting", count: "10 videos", icon: "🛠️" }
          ].map((category, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h4 className="font-semibold mb-1">{category.name}</h4>
                <p className="text-sm text-muted-foreground">{category.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-primary/10 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h4 className="text-xl font-semibold mb-3">📺 Subscribe for Updates</h4>
              <p className="text-muted-foreground mb-6">
                Get notified when we release new educational videos and tutorials about scholarships and government processes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  data-testid="subscribe-youtube-button"
                >
                  Subscribe on YouTube
                </Button>
                <Button 
                  variant="outline"
                  data-testid="newsletter-subscribe-button"
                >
                  Email Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Video Player Modal - Using native iframe */}
      {activeVideo?.embedUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={activeVideo.embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={activeVideo.title}
            />
            <Button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 p-0"
              aria-label="Close video"
            >
              <X size={20} />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
