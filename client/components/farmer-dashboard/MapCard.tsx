import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function MapCard() {
  const [ndvi, setNdvi] = useState(true);
  const [landcover, setLandcover] = useState(false);

  return (
    <Card className="rounded-2xl shadow-sm card-interactive card-soft">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Farm Map Preview</span>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={ndvi} onChange={() => setNdvi(!ndvi)} />
              <span>NDVI</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={landcover} onChange={() => setLandcover(!landcover)} />
              <span>Landcover</span>
            </label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-48 bg-gradient-to-br from-[#E6F4EA] to-[#F9F9F9] rounded-lg overflow-hidden flex items-center justify-center">
          <img src="/placeholder.svg" alt="map placeholder" className="w-full h-full object-cover opacity-90" />
          <div className="absolute p-4 text-sm text-gray-700">Interactive preview (stub)</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default React.memo(MapCard);
