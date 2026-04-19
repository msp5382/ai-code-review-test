"use client";

import { useState } from "react";
import {
  getHitsForTower,
  getTowerById,
  getSuspectById,
  detectedGangs,
  type Suspect,
  type TowerHit,
} from "../data/mock";

interface TowerDetailPanelProps {
  towerId: string;
  onClose: () => void;
}

type ModalType = "warrant" | "vehicle" | "criminal" | null;

export default function TowerDetailPanel({
  towerId,
  onClose,
}: TowerDetailPanelProps) {
  const [modalSuspect, setModalSuspect] = useState<Suspect | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [photoPreview, setPhotoPreview] = useState<{ src: string; name: string } | null>(null);

  const tower = getTowerById(towerId);
  const hits = getHitsForTower(towerId);

  if (!tower) return null;

  const openModal = (suspect: Suspect, type: ModalType) => {
    setModalSuspect(suspect);
    setModalType(type);
  };

  const closeModal = () => {
    setModalSuspect(null);
    setModalType(null);
  };

  return (
    <div className="h-full flex flex-col bg-[#0d1117] text-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800/60 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="text-sm font-semibold text-amber-300">
                {tower.name}
              </h2>
            </div>
            <p className="text-[10px] text-gray-500 ml-5">
              ประวัติผู้ผ่านสถานี — 24 ชม.ล่าสุด
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-[#161b22] rounded-lg p-2 text-center border border-gray-800/40">
            <div className="text-lg font-bold text-amber-400">{hits.length}</div>
            <div className="text-[9px] text-gray-500">สัญญาณที่ตรวจจับ</div>
          </div>
          <div className="bg-[#161b22] rounded-lg p-2 text-center border border-gray-800/40">
            <div className="text-lg font-bold text-emerald-400">
              {new Set(hits.map((h) => h.suspectId)).size}
            </div>
            <div className="text-[9px] text-gray-500">ผู้ต้องสงสัย</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-5 py-3 sticky top-0 bg-[#0d1117] z-10 border-b border-gray-800/40">
          <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            ไทม์ไลน์ผู้ผ่านสถานี
          </h3>
        </div>

        <div className="px-4 pb-4">
          {hits.map((hit, i) => (
            <HitEntry
              key={i}
              hit={hit}
              onOpenModal={openModal}
              onClickPhoto={(src, name) => setPhotoPreview({ src, name })}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {modalSuspect && modalType && (
        <DetailModal
          suspect={modalSuspect}
          type={modalType}
          onClose={closeModal}
        />
      )}

      {/* Photo Preview Modal */}
      {photoPreview && (
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 cursor-pointer"
          onClick={() => setPhotoPreview(null)}
        >
          <div
            className="relative max-w-xs w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photoPreview.src}
              alt={photoPreview.name}
              className="w-full rounded-xl shadow-2xl border border-gray-700/60"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent rounded-b-xl px-4 py-3">
              <div className="text-sm font-medium text-white">{photoPreview.name}</div>
            </div>
            <button
              onClick={() => setPhotoPreview(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer shadow-lg"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function HitEntry({
  hit,
  onOpenModal,
  onClickPhoto,
}: {
  hit: TowerHit;
  onOpenModal: (suspect: Suspect, type: ModalType) => void;
  onClickPhoto: (src: string, name: string) => void;
}) {
  const suspect = getSuspectById(hit.suspectId);
  if (!suspect) return null;

  const gang = detectedGangs.find((g) => g.suspectIds.includes(suspect.id));

  return (
    <div className="mt-3 bg-[#161b22] rounded-lg border border-gray-800/40 overflow-hidden">
      {/* Time bar */}
      <div className="px-3 py-1.5 bg-[#1c2333] flex items-center justify-between border-b border-gray-800/30">
        <span className="font-mono text-xs text-amber-300 font-medium">
          {hit.timestamp}
        </span>
        {gang && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
            {gang.name.split("—")[0].trim()}
          </span>
        )}
      </div>

      <div className="p-3">
        {/* Person info row */}
        <div className="flex gap-3">
          {suspect.photo ? (
            <img
              src={suspect.photo}
              alt={suspect.name}
              className="w-14 h-14 rounded-lg shrink-0 object-cover cursor-pointer hover:opacity-80 transition-opacity"
              style={{ border: `2px solid ${suspect.color}60` }}
              onClick={() => onClickPhoto(suspect.photo!, suspect.name)}
            />
          ) : (
            <div
              className="w-14 h-14 rounded-lg shrink-0 flex items-center justify-center"
              style={{ backgroundColor: suspect.color + "20", border: `2px solid ${suspect.color}40` }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={suspect.color} strokeWidth="1.5" opacity="0.6">
                <circle cx="12" cy="8" r="4" />
                <path d="M5 20c0-4 3.5-7 7-7s7 3 7 7" />
              </svg>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: suspect.color }}
              />
              <span className="text-sm font-medium text-gray-200 truncate">
                {suspect.name}
              </span>
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5 ml-4">
              IMSI: <span className="font-mono">{suspect.imsi}</span>
            </div>
            {suspect.warrant && suspect.warrant.status === "ยังมีผล" && (
              <div className="mt-1 ml-4">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/30 animate-pulse">
                  มีหมายจับ
                </span>
              </div>
            )}
          </div>
        </div>

        {/* LPR capture */}
        {hit.lprPlate && (
          <div className="mt-2.5 flex gap-2 items-center bg-[#0d1117] rounded-lg p-2 border border-gray-800/30">
            {hit.lprPhoto ? (
              <img
                src={hit.lprPhoto}
                alt={`LPR ${hit.lprPlate}`}
                className="w-20 h-14 rounded object-cover shrink-0 border border-gray-700/50 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onClickPhoto(hit.lprPhoto!, `LPR — ${hit.lprPlate}`)}
              />
            ) : (
              <div className="w-20 h-14 rounded bg-gray-900 border border-gray-700/50 shrink-0 flex flex-col items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M2 8h2M20 8h2" />
                </svg>
                <span className="text-[7px] text-gray-600 mt-0.5">LPR</span>
              </div>
            )}
            <div className="flex-1">
              <div className="font-mono text-sm font-bold text-emerald-400">
                {hit.lprPlate}
              </div>
              <div className="text-[10px] text-gray-500">
                {hit.lprVehicleDesc}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-2.5 flex gap-1.5">
          <button
            onClick={() => onOpenModal(suspect, "warrant")}
            className="flex-1 text-[10px] py-1.5 px-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M12 18v-6M9 15h6" />
            </svg>
            หมายจับ
          </button>
          <button
            onClick={() => onOpenModal(suspect, "vehicle")}
            className="flex-1 text-[10px] py-1.5 px-2 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 1 14v2c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
            </svg>
            ข้อมูลรถ
          </button>
          <button
            onClick={() => onOpenModal(suspect, "criminal")}
            className="flex-1 text-[10px] py-1.5 px-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            ประวัติ
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({
  suspect,
  type,
  onClose,
}: {
  suspect: Suspect;
  type: "warrant" | "vehicle" | "criminal";
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-gray-700/60 rounded-xl w-full max-w-sm max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* Modal header */}
        <div className="sticky top-0 px-4 py-3 border-b border-gray-800/60 bg-[#161b22] rounded-t-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-200">
              {type === "warrant" && "ข้อมูลหมายจับ"}
              {type === "vehicle" && "ข้อมูลทะเบียนรถ (กรมขนส่ง)"}
              {type === "criminal" && "ประวัติอาชญากรรม"}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: suspect.color }}
              />
              {suspect.name}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="p-4">
          {type === "warrant" && <WarrantDetail suspect={suspect} />}
          {type === "vehicle" && <VehicleDetail suspect={suspect} />}
          {type === "criminal" && <CriminalDetail suspect={suspect} />}
        </div>
      </div>
    </div>
  );
}

function WarrantDetail({ suspect }: { suspect: Suspect }) {
  if (!suspect.warrant || suspect.warrant.status === "ไม่มีหมาย") {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div className="text-sm text-green-400">ไม่พบหมายจับ</div>
        <div className="text-[10px] text-gray-500 mt-1">
          ไม่มีหมายจับที่ยังมีผลบังคับใช้ในระบบ
        </div>
      </div>
    );
  }

  const w = suspect.warrant;
  return (
    <div className="space-y-3">
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
        <div className="text-red-400 font-semibold text-sm">มีหมายจับ</div>
        <div className="text-red-300 text-[10px] mt-0.5">{w.status}</div>
      </div>

      <InfoRow label="เลขหมาย" value={w.warrantNo} />
      <InfoRow label="ศาลที่ออก" value={w.court} />
      <InfoRow label="วันที่ออก" value={w.issuedDate} />
      <InfoRow label="ข้อหา" value={w.charges} highlight />
    </div>
  );
}

function VehicleDetail({ suspect }: { suspect: Suspect }) {
  if (!suspect.vehicleReg) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 mx-auto rounded-full bg-gray-500/10 flex items-center justify-center mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <div className="text-sm text-gray-400">ไม่พบข้อมูลทะเบียนรถ</div>
        <div className="text-[10px] text-gray-500 mt-1">
          ไม่มีทะเบียนรถที่ผูกกับบุคคลนี้ในระบบกรมขนส่ง
        </div>
      </div>
    );
  }

  const v = suspect.vehicleReg;
  return (
    <div className="space-y-3">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
        <div className="font-mono text-xl font-bold text-blue-300">{v.plateNumber}</div>
        <div className="text-[10px] text-gray-500 mt-0.5">จ.{v.province}</div>
      </div>

      <InfoRow label="ยี่ห้อ/รุ่น" value={`${v.brand} ${v.model}`} />
      <InfoRow label="สี" value={v.color} />
      <InfoRow label="ปีจดทะเบียน" value={String(v.year)} />
      <InfoRow label="ผู้ถือกรรมสิทธิ์" value={v.registeredTo} highlight />
      <InfoRow label="เลขตัวถัง" value={v.chassisNo} mono />
    </div>
  );
}

function CriminalDetail({ suspect }: { suspect: Suspect }) {
  if (suspect.criminalHistory.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div className="text-sm text-green-400">ไม่พบประวัติอาชญากรรม</div>
        <div className="text-[10px] text-gray-500 mt-1">
          ไม่มีประวัติในฐานข้อมูลตำรวจ
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-[10px] text-gray-500 mb-1">
        พบ {suspect.criminalHistory.length} รายการ
      </div>
      {suspect.criminalHistory.map((record, i) => (
        <div
          key={i}
          className="bg-[#0d1117] rounded-lg p-3 border border-gray-800/40"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-gray-400">
              {record.caseNo}
            </span>
            <span className="text-[9px] text-gray-500">{record.date}</span>
          </div>
          <div className="text-xs text-gray-300">{record.offense}</div>
          <div className="mt-1.5">
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded ${
                record.result.includes("อยู่ระหว่าง")
                  ? "bg-amber-500/15 text-amber-400"
                  : record.result.includes("จำคุก")
                    ? "bg-red-500/15 text-red-400"
                    : "bg-gray-500/15 text-gray-400"
              }`}
            >
              {record.result}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-[10px] text-gray-500 shrink-0">{label}</span>
      <span
        className={`text-[11px] text-right ${
          highlight
            ? "text-amber-300"
            : mono
              ? "text-gray-400 font-mono"
              : "text-gray-300"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
