"use client";

import { useState } from "react";
import {
  suspects,
  detectedGangs,
  getHitsForSuspect,
  getTowerById,
  getSuspectById,
  type Suspect,
  type DetectedGang,
} from "../data/mock";
import TowerDetailPanel from "./TowerDetailPanel";

interface SidebarProps {
  selectedTowerId: string | null;
  onClearTower: () => void;
  onSelectSuspects: (ids: string[], towerIds: string[]) => void;
}

export default function Sidebar({
  selectedTowerId,
  onClearTower,
  onSelectSuspects,
}: SidebarProps) {
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [selectedGangId, setSelectedGangId] = useState<string | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [notes, setNotes] = useState<
    { fromId: string; toId: string; type: string; detail: string }[]
  >([]);
  const [noteForm, setNoteForm] = useState({
    fromId: "",
    toId: "",
    type: "ร่วมขบวนการ",
    detail: "",
  });

  const handleSelectSuspect = (suspect: Suspect) => {
    if (selectedSuspectId === suspect.id) {
      setSelectedSuspectId(null);
      setSelectedGangId(null);
      onSelectSuspects([], []);
      return;
    }
    setSelectedSuspectId(suspect.id);
    setSelectedGangId(null);
    const hits = getHitsForSuspect(suspect.id);
    const towerIds = [...new Set(hits.map((h) => h.towerId))];
    onSelectSuspects([suspect.id], towerIds);
  };

  const handleSelectGang = (gang: DetectedGang) => {
    if (selectedGangId === gang.id) {
      setSelectedGangId(null);
      setSelectedSuspectId(null);
      onSelectSuspects([], []);
      return;
    }
    setSelectedGangId(gang.id);
    setSelectedSuspectId(null);
    const towerIds = [...new Set(gang.coLocations.map((c) => c.towerId))];
    onSelectSuspects(gang.suspectIds, towerIds);
  };

  const handleAddNote = () => {
    if (noteForm.fromId && noteForm.toId && noteForm.fromId !== noteForm.toId) {
      setNotes([...notes, { ...noteForm }]);
      setNoteForm({ fromId: "", toId: "", type: "ร่วมขบวนการ", detail: "" });
      setShowNoteForm(false);
    }
  };

  const selectedSuspect = selectedSuspectId
    ? suspects.find((s) => s.id === selectedSuspectId)
    : null;

  const selectedGang = selectedGangId
    ? detectedGangs.find((g) => g.id === selectedGangId)
    : null;

  const suspectHits = selectedSuspect
    ? getHitsForSuspect(selectedSuspect.id)
    : [];

  // Tower detail view
  if (selectedTowerId) {
    return (
      <div className="h-full relative">
        <TowerDetailPanel towerId={selectedTowerId} onClose={onClearTower} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0d1117] text-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800/60 shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h1 className="text-base font-semibold tracking-wide text-gray-100">
            ระบบติดตามเครือข่ายยาเสพติด
          </h1>
        </div>
        <p className="text-[11px] text-gray-500 ml-5">
          กองบัญชาการตำรวจปราบปรามยาเสพติด — ระบบสาธิต
        </p>
      </div>

      {/* Stats */}
      <div className="px-5 py-4 border-b border-gray-800/60 shrink-0">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#161b22] rounded-lg p-3 text-center border border-gray-800/40">
            <div className="text-2xl font-bold text-emerald-400">
              {suspects.length}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              ผู้ต้องสงสัยทั้งหมด
            </div>
          </div>
          <div className="bg-[#161b22] rounded-lg p-3 text-center border border-gray-800/40">
            <div className="text-2xl font-bold text-amber-400">
              {detectedGangs.length}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              กลุ่มที่ตรวจพบ
            </div>
          </div>
          <div className="bg-[#161b22] rounded-lg p-3 text-center border border-gray-800/40">
            <div className="text-2xl font-bold text-blue-400">24</div>
            <div className="text-[10px] text-gray-500 mt-1">ชม. ที่ติดตาม</div>
          </div>
        </div>
        <div className="mt-3 bg-[#161b22] rounded-lg p-3 border border-gray-800/40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">สถิติการติดตาม 24 ชม.</span>
          </div>
          <div className="mt-2 flex items-end gap-1">
            <span className="text-lg font-bold text-amber-400">~10</span>
            <span className="text-[11px] text-gray-500 pb-0.5">
              ผู้ต้องสงสัยถูกระบุตัวตนจากสัญญาณ IMSI
            </span>
          </div>
          <div className="mt-1 text-[10px] text-gray-600">
            คลิกสถานีบนแผนที่เพื่อดูประวัติผู้ผ่าน
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Detected Gangs */}
        <div className="px-5 py-3 flex items-center justify-between sticky top-0 bg-[#0d1117] z-10 border-b border-gray-800/40">
          <h2 className="text-xs font-semibold text-red-400 uppercase tracking-wider">
            กลุ่มเครือข่ายที่ตรวจพบ
          </h2>
          <span className="text-[10px] bg-red-500/20 text-red-400 rounded-full px-2 py-0.5">
            {detectedGangs.length}
          </span>
        </div>

        <div className="px-3 pb-2">
          {detectedGangs.map((gang) => {
            const isSelected = selectedGangId === gang.id;
            return (
              <button
                key={gang.id}
                onClick={() => handleSelectGang(gang)}
                className={`w-full text-left rounded-lg p-3 mt-2 border transition-all cursor-pointer ${
                  isSelected
                    ? "border-red-500/60 bg-red-500/10 ring-1 ring-red-500/30"
                    : "border-gray-800/40 bg-[#161b22] hover:bg-gray-800/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-200">
                    {gang.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-500/20 text-red-400">
                    {gang.confidence}% แม่น
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {gang.suspectIds.map((sid) => {
                    const s = getSuspectById(sid);
                    return (
                      <div key={sid} className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: s?.color }}
                        />
                        <span className="text-[10px] text-gray-400">
                          {s?.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {isSelected && selectedGang && (
                  <div className="mt-3 pt-2 border-t border-gray-700/50 space-y-1.5">
                    <div className="text-[10px] text-gray-500 font-medium">
                      จุดที่พบร่วมกัน:
                    </div>
                    {selectedGang.coLocations.map((loc, i) => {
                      const tower = getTowerById(loc.towerId);
                      return (
                        <div key={i} className="flex items-center gap-2 text-[10px]">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="text-amber-300">{tower?.name}</span>
                          <span className="text-gray-600">—</span>
                          <span className="text-gray-400 font-mono">{loc.timestamp}</span>
                        </div>
                      );
                    })}
                    {notes
                      .filter(
                        (n) =>
                          gang.suspectIds.includes(n.fromId) &&
                          gang.suspectIds.includes(n.toId)
                      )
                      .map((n, i) => (
                        <div
                          key={i}
                          className="text-[10px] bg-purple-500/10 border border-purple-500/30 rounded px-2 py-1"
                        >
                          <span className="text-purple-400">{n.type}: </span>
                          <span className="text-gray-400">
                            {getSuspectById(n.fromId)?.name} ↔{" "}
                            {getSuspectById(n.toId)?.name}
                          </span>
                          {n.detail && (
                            <div className="text-gray-500">{n.detail}</div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Suspect List */}
        <div className="px-5 py-3 flex items-center justify-between sticky top-0 bg-[#0d1117] z-10 border-b border-gray-800/40">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            รายชื่อผู้ต้องสงสัย
          </h2>
          <span className="text-[10px] bg-gray-800 text-gray-400 rounded-full px-2 py-0.5">
            {suspects.length}
          </span>
        </div>

        <div className="px-3 pb-3">
          {suspects.map((suspect) => {
            const isSelected = selectedSuspectId === suspect.id;
            const hits = getHitsForSuspect(suspect.id);
            const gangMembership = detectedGangs.find((g) =>
              g.suspectIds.includes(suspect.id)
            );

            return (
              <button
                key={suspect.id}
                onClick={() => handleSelectSuspect(suspect)}
                className={`w-full text-left rounded-lg p-3 mt-2 border transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-500/60 bg-blue-500/10 ring-1 ring-blue-500/30"
                    : "border-gray-800/40 bg-[#161b22] hover:bg-gray-800/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: suspect.color }}
                  />
                  <span className="text-sm font-medium text-gray-200">
                    {suspect.name}
                  </span>
                  {suspect.warrant?.status === "ยังมีผล" && (
                    <span className="text-[8px] px-1 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/30">
                      หมายจับ
                    </span>
                  )}
                  {gangMembership && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 ml-auto">
                      {gangMembership.name.split("—")[0].trim()}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-gray-600 mt-1 ml-4.5">
                  ปรากฏ {hits.length} ครั้ง ใน 24 ชม.
                </div>

                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-gray-700/50">
                    <div className="text-[10px] text-gray-500 font-medium mb-2">
                      ไทม์ไลน์การเคลื่อนที่:
                    </div>
                    <div className="relative ml-1">
                      <div
                        className="absolute left-[3px] top-1 bottom-1 w-px"
                        style={{ backgroundColor: suspect.color, opacity: 0.3 }}
                      />
                      {suspectHits.map((hit, i) => {
                        const tower = getTowerById(hit.towerId);
                        return (
                          <div key={i} className="flex items-start gap-3 mb-2 relative">
                            <div
                              className="w-[7px] h-[7px] rounded-full shrink-0 mt-0.5 z-10"
                              style={{
                                backgroundColor: suspect.color,
                                boxShadow: `0 0 6px ${suspect.color}50`,
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] text-gray-300">
                                  {hit.timestamp}
                                </span>
                                <span className="text-[10px] text-gray-500">→</span>
                                <span className="text-[11px] text-gray-400">
                                  {tower?.name}
                                </span>
                              </div>
                              {hit.lprPlate && (
                                <div className="text-[9px] text-gray-600 mt-0.5">
                                  LPR: {hit.lprPlate} ({hit.lprVehicleDesc})
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-[10px] text-gray-600 mt-1">
                      <span className="text-gray-500">IMSI: </span>
                      <span className="font-mono">{suspect.imsi}</span>
                    </div>

                    {notes
                      .filter((n) => n.fromId === suspect.id || n.toId === suspect.id)
                      .map((n, i) => (
                        <div
                          key={i}
                          className="text-[10px] bg-purple-500/10 border border-purple-500/30 rounded px-2 py-1 mt-1.5"
                        >
                          <span className="text-purple-400">{n.type}: </span>
                          <span className="text-gray-400">
                            {n.fromId === suspect.id
                              ? getSuspectById(n.toId)?.name
                              : getSuspectById(n.fromId)?.name}
                          </span>
                          {n.detail && (
                            <div className="text-gray-500">{n.detail}</div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Relationship / Note */}
      <div className="border-t border-gray-800/60 shrink-0">
        {!showNoteForm ? (
          <button
            onClick={() => setShowNoteForm(true)}
            className="w-full px-5 py-3 text-xs text-blue-400 hover:bg-blue-500/10 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            เพิ่มความสัมพันธ์ / บันทึกข้อมูล
          </button>
        ) : (
          <div className="px-4 py-3 space-y-2">
            <div className="text-[11px] font-semibold text-gray-400 mb-2">
              บันทึกความสัมพันธ์ระหว่างผู้ต้องสงสัย
            </div>

            <select
              value={noteForm.fromId}
              onChange={(e) => setNoteForm({ ...noteForm, fromId: e.target.value })}
              className="w-full bg-[#161b22] border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">— เลือกผู้ต้องสงสัยคนที่ 1 —</option>
              {suspects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              value={noteForm.toId}
              onChange={(e) => setNoteForm({ ...noteForm, toId: e.target.value })}
              className="w-full bg-[#161b22] border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="">— เลือกผู้ต้องสงสัยคนที่ 2 —</option>
              {suspects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              value={noteForm.type}
              onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}
              className="w-full bg-[#161b22] border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ร่วมขบวนการ">ร่วมขบวนการ</option>
              <option value="ผู้ส่ง-ผู้รับ">ผู้ส่ง — ผู้รับ</option>
              <option value="ญาติ">ญาติ</option>
              <option value="เพื่อนร่วมงาน">เพื่อนร่วมงาน</option>
              <option value="ผู้บงการ">ผู้บงการ</option>
              <option value="คนขนส่ง">คนขนส่ง</option>
            </select>

            <textarea
              value={noteForm.detail}
              onChange={(e) => setNoteForm({ ...noteForm, detail: e.target.value })}
              placeholder="รายละเอียดเพิ่มเติม เช่น พบพูดคุยทางโทรศัพท์..."
              rows={2}
              className="w-full bg-[#161b22] border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500 resize-none"
            />

            <div className="flex gap-2">
              <button
                onClick={handleAddNote}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded transition-colors cursor-pointer"
              >
                บันทึก
              </button>
              <button
                onClick={() => setShowNoteForm(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs py-1.5 rounded transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
