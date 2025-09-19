import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type Language } from "@/lib/i18n";
import { type HelpCenter } from "@shared/schema";

interface HelpCenterMapProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export default function HelpCenterMap({ isOpen, onClose, language }: HelpCenterMapProps) {
  const [pincode, setPincode] = useState("");
  const [serviceType, setServiceType] = useState<string>("all");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const { data: helpCenters, isLoading, refetch } = useQuery({
    queryKey: ['/api/help-centers', pincode, serviceType === 'all' ? undefined : serviceType],
    enabled: false // Only fetch when user searches
  });

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  }, []);

  const handleSearch = () => {
    if (pincode) {
      refetch();
    }
  };

  const calculateDistance = (center: HelpCenter): string => {
    if (!userLocation || !center.latitude || !center.longitude) {
      return "Distance unknown";
    }

    const lat1 = userLocation.lat;
    const lon1 = userLocation.lng;
    const lat2 = parseFloat(center.latitude);
    const lon2 = parseFloat(center.longitude);

    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return `${distance.toFixed(1)} km away`;
  };

  const getDirections = (center: HelpCenter) => {
    if (center.latitude && center.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`;
      window.open(url, '_blank');
    }
  };

  const getCenterTypeIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return '🏦';
      case 'csc':
        return '💻';
      case 'uidai':
        return '🆔';
      default:
        return '📍';
    }
  };

  const getCenterTypeName = (type: string) => {
    switch (type) {
      case 'bank':
        return 'Bank Branch';
      case 'csc':
        return 'CSC Center';
      case 'uidai':
        return 'UIDAI Office';
      default:
        return 'Help Center';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" data-testid="help-center-map">
        <DialogHeader>
          <DialogTitle>Find Nearby Help Centers</DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Search Panel */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="pincode">Enter your location</Label>
              <Input
                id="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pin code or city"
                data-testid="location-input"
              />
            </div>
            
            <div>
              <Label htmlFor="service">Service needed</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger data-testid="service-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="bank">Banking Services</SelectItem>
                  <SelectItem value="csc">CSC Services</SelectItem>
                  <SelectItem value="uidai">Aadhaar Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleSearch} 
              className="w-full"
              disabled={!pincode || isLoading}
              data-testid="search-centers-button"
            >
              {isLoading ? "Searching..." : "Find Centers"}
            </Button>
            
            {/* Results List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(helpCenters as HelpCenter[])?.map((center: HelpCenter) => (
                <Card key={center.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-start gap-2">
                      <span className="text-lg">{getCenterTypeIcon(center.type)}</span>
                      <div className="flex-1">
                        <div className="font-medium">{center.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {getCenterTypeName(center.type)}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <MapPin size={12} className="mt-0.5" />
                      <span>{center.address}</span>
                    </div>
                    
                    {center.phoneNumber && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone size={12} />
                        <span>{center.phoneNumber}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-accent">
                      <Navigation size={12} />
                      <span>{calculateDistance(center)}</span>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => getDirections(center)}
                      className="w-full text-xs"
                      data-testid={`directions-button-${center.id}`}
                    >
                      Get Directions
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {helpCenters && (helpCenters as HelpCenter[]).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="mx-auto mb-2" size={32} />
                  <p>No centers found in this area</p>
                  <p className="text-sm">Try a different pin code</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <div className="bg-muted rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center">
                <MapPin className="mx-auto mb-4 text-muted-foreground" size={48} />
                <p className="text-muted-foreground text-lg font-medium">Interactive Map</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Map integration with Google Maps API
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  In production: Real-time locations with navigation
                </p>
              </div>
            </div>
            
            {/* Map Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span>🏦</span>
                <span>Bank Branches</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💻</span>
                <span>CSC Centers</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🆔</span>
                <span>UIDAI Offices</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
