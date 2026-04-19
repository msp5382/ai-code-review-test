"use client";

import { useState } from "react";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const [selectedSuspectIds, setSelectedSuspectIds] = useState<string[]>([]);
  const [highlightTowerIds, setHighlightTowerIds] = useState<string[]>([]);
  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);

  const handleSelectSuspects = (ids: string[], towerIds: string[]) => {
    setSelectedSuspectIds(ids);
    setHighlightTowerIds(towerIds);
  };

  const handleSelectTower = (towerId: string) => {
    setSelectedTowerId(towerId);
    setSelectedSuspectIds([]);
    setHighlightTowerIds([towerId]);
  };

  const handleClearTower = () => {
    setSelectedTowerId(null);
    setHighlightTowerIds([]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="w-[30%] min-w-[340px] max-w-[480px] h-full border-r border-gray-800/60">
        <Sidebar
          selectedTowerId={selectedTowerId}
          onClearTower={handleClearTower}
          onSelectSuspects={handleSelectSuspects}
        />
      </div>
      <div className="flex-1 h-full relative">
        <MapView
          selectedSuspectIds={selectedSuspectIds}
          highlightTowerIds={highlightTowerIds}
          onSelectTower={handleSelectTower}
        />
      </div>
    </div>
  );
}
