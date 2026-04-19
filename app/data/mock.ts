export interface IMSITower {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  status: "active" | "inactive";
}

export interface Suspect {
  id: string;
  name: string;
  imsi: string;
  color: string;
  photo: string | null;
  warrant: WarrantInfo | null;
  vehicleReg: VehicleRegInfo | null;
  criminalHistory: CriminalRecord[];
}

export interface WarrantInfo {
  warrantNo: string;
  issuedDate: string;
  court: string;
  charges: string;
  status: "ยังมีผล" | "หมดอายุ" | "ไม่มีหมาย";
}

export interface VehicleRegInfo {
  plateNumber: string;
  brand: string;
  model: string;
  color: string;
  year: number;
  registeredTo: string;
  province: string;
  chassisNo: string;
}

export interface CriminalRecord {
  caseNo: string;
  date: string;
  offense: string;
  result: string;
}

export interface TowerHit {
  suspectId: string;
  towerId: string;
  timestamp: string;
  lprPlate: string | null;
  lprVehicleDesc: string | null;
  lprPhoto: string | null;
}

export interface DetectedGang {
  id: string;
  name: string;
  suspectIds: string[];
  coLocations: {
    towerId: string;
    timestamp: string;
  }[];
  confidence: number;
}

export const imsiTowers: IMSITower[] = [
  {
    id: "tower-1",
    name: "สถานี หลักสี่",
    lat: 13.8882,
    lng: 100.5675,
    radius: 500,
    status: "active",
  },
  {
    id: "tower-2",
    name: "สถานี ลาดพร้าว",
    lat: 13.8165,
    lng: 100.5618,
    radius: 450,
    status: "active",
  },
  {
    id: "tower-3",
    name: "สถานี บางซื่อ",
    lat: 13.8058,
    lng: 100.5132,
    radius: 400,
    status: "active",
  },
  {
    id: "tower-4",
    name: "สถานี ดอนเมือง",
    lat: 13.9169,
    lng: 100.5953,
    radius: 550,
    status: "active",
  },
  {
    id: "tower-5",
    name: "สถานี จตุจักร",
    lat: 13.82,
    lng: 100.55,
    radius: 420,
    status: "active",
  },
];

export const suspects: Suspect[] = [
  {
    id: "s1",
    name: "สมชาย ทดสอบ",
    imsi: "520031234567890",
    color: "#ef4444",
    photo: "/suspect-1.png",
    warrant: {
      warrantNo: "นย.234/2569",
      issuedDate: "2026-01-15",
      court: "ศาลอาญา กรุงเทพฯ",
      charges: "พ.ร.บ.ยาเสพติด มาตรา 15 ครอบครองเพื่อจำหน่าย",
      status: "ยังมีผล",
    },
    vehicleReg: {
      plateNumber: "กข 1234",
      brand: "Toyota",
      model: "Hilux Revo",
      color: "ดำ",
      year: 2024,
      registeredTo: "สมชาย ทดสอบ",
      province: "กรุงเทพมหานคร",
      chassisNo: "MROCB8CD40XXXXXX",
    },
    criminalHistory: [
      { caseNo: "อ.1234/2568", date: "2025-06-12", offense: "ครอบครองยาเสพติด (ยาบ้า 200 เม็ด)", result: "อยู่ระหว่างพิจารณา" },
      { caseNo: "อ.892/2566", date: "2023-11-03", offense: "ครอบครองอาวุธปืนโดยไม่ได้รับอนุญาต", result: "จำคุก 1 ปี รอลงอาญา" },
    ],
  },
  {
    id: "s2",
    name: "วิชัย ทดสอบ",
    imsi: "520039876543210",
    color: "#f97316",
    photo: "/suspect-2.png",
    warrant: {
      warrantNo: "นย.235/2569",
      issuedDate: "2026-01-15",
      court: "ศาลอาญา กรุงเทพฯ",
      charges: "พ.ร.บ.ยาเสพติด มาตรา 15 สมคบจำหน่าย",
      status: "ยังมีผล",
    },
    vehicleReg: {
      plateNumber: "ขค 5678",
      brand: "Honda",
      model: "Civic",
      color: "ขาว",
      year: 2023,
      registeredTo: "วิชัย ทดสอบ",
      province: "นนทบุรี",
      chassisNo: "MRHGM6670NXXXXXX",
    },
    criminalHistory: [
      { caseNo: "อ.567/2567", date: "2024-03-20", offense: "จำหน่ายยาเสพติด (ไอซ์ 50 กรัม)", result: "อยู่ระหว่างพิจารณา" },
    ],
  },
  {
    id: "s3",
    name: "ประเสริฐ ทดสอบ",
    imsi: "520031122334455",
    color: "#eab308",
    photo: "/suspect-3.png",
    warrant: null,
    vehicleReg: {
      plateNumber: "คง 9012",
      brand: "Isuzu",
      model: "D-Max",
      color: "เทา",
      year: 2022,
      registeredTo: "บริษัท ทดสอบขนส่ง จำกัด",
      province: "ปทุมธานี",
      chassisNo: "MP1TFB86SLT000000",
    },
    criminalHistory: [],
  },
  {
    id: "s4",
    name: "สุรศักดิ์ ทดสอบ",
    imsi: "520035566778899",
    color: "#22c55e",
    photo: "/suspect-4.png",
    warrant: {
      warrantNo: "นย.112/2569",
      issuedDate: "2026-02-28",
      court: "ศาลจังหวัดนนทบุรี",
      charges: "พ.ร.บ.ยาเสพติด มาตรา 15 ผลิตเพื่อจำหน่าย",
      status: "ยังมีผล",
    },
    vehicleReg: null,
    criminalHistory: [
      { caseNo: "อ.2341/2567", date: "2024-08-15", offense: "ผลิตยาเสพติด (เคตามีน)", result: "จำคุก 3 ปี ประกันตัว" },
      { caseNo: "อ.109/2565", date: "2022-04-01", offense: "ลักทรัพย์", result: "จำคุก 6 เดือน" },
      { caseNo: "อ.88/2563", date: "2020-09-10", offense: "ทำร้ายร่างกาย", result: "ปรับ 5,000 บาท" },
    ],
  },
  {
    id: "s5",
    name: "อนันต์ ทดสอบ",
    imsi: "520032233445566",
    color: "#06b6d4",
    photo: "/suspect-5.png",
    warrant: null,
    vehicleReg: {
      plateNumber: "ชซ 7890",
      brand: "Toyota",
      model: "Camry",
      color: "เงิน",
      year: 2025,
      registeredTo: "อนันต์ ทดสอบ",
      province: "กรุงเทพมหานคร",
      chassisNo: "MRBAT2EA0KXXXXXXX",
    },
    criminalHistory: [],
  },
  {
    id: "s6",
    name: "ธนา ทดสอบ",
    imsi: "520037788990011",
    color: "#8b5cf6",
    photo: null,
    warrant: null,
    vehicleReg: null,
    criminalHistory: [
      { caseNo: "อ.444/2568", date: "2025-02-14", offense: "ครอบครองยาเสพติด (กัญชา 5 กก.)", result: "อยู่ระหว่างพิจารณา" },
    ],
  },
  {
    id: "s7",
    name: "พิชัย ทดสอบ",
    imsi: "520034455667788",
    color: "#ec4899",
    photo: null,
    warrant: null,
    vehicleReg: {
      plateNumber: "ฎฏ 6789",
      brand: "Nissan",
      model: "Navara",
      color: "ขาว",
      year: 2023,
      registeredTo: "พิชัย ทดสอบ",
      province: "สมุทรปราการ",
      chassisNo: "VNINAVP2ZKT000000",
    },
    criminalHistory: [],
  },
  {
    id: "s8",
    name: "กฤษณะ ทดสอบ",
    imsi: "520036677889900",
    color: "#14b8a6",
    photo: null,
    warrant: {
      warrantNo: "นย.055/2568",
      issuedDate: "2025-10-01",
      court: "ศาลจังหวัดปทุมธานี",
      charges: "พ.ร.บ.ยาเสพติด มาตรา 15 นำเข้า",
      status: "ยังมีผล",
    },
    vehicleReg: null,
    criminalHistory: [
      { caseNo: "อ.1100/2568", date: "2025-10-01", offense: "นำเข้ายาเสพติด (เมทแอมเฟตามีน 10 กก.)", result: "อยู่ระหว่างพิจารณา" },
    ],
  },
  {
    id: "s9",
    name: "เกียรติศักดิ์ ทดสอบ",
    imsi: "520038899001122",
    color: "#f43f5e",
    photo: null,
    warrant: null,
    vehicleReg: {
      plateNumber: "ณด 4567",
      brand: "Toyota",
      model: "Fortuner",
      color: "ดำ",
      year: 2024,
      registeredTo: "เกียรติศักดิ์ ทดสอบ",
      province: "กรุงเทพมหานคร",
      chassisNo: "MRZAT8GR5LT000000",
    },
    criminalHistory: [],
  },
  {
    id: "s10",
    name: "ภูมิพัฒน์ ทดสอบ",
    imsi: "520031100223344",
    color: "#a855f7",
    photo: null,
    warrant: null,
    vehicleReg: null,
    criminalHistory: [],
  },
  {
    id: "s11",
    name: "ณัฐพล ทดสอบ",
    imsi: "520032244668800",
    color: "#0ea5e9",
    photo: null,
    warrant: null,
    vehicleReg: {
      plateNumber: "ตถ 8901",
      brand: "Mazda",
      model: "BT-50",
      color: "น้ำตาล",
      year: 2021,
      registeredTo: "ณัฐพล ทดสอบ",
      province: "นนทบุรี",
      chassisNo: "MM7UNYOW4MT000000",
    },
    criminalHistory: [],
  },
];

export const towerHits: TowerHit[] = [
  // === Gang A: s1, s2, s3 ===
  { suspectId: "s1", towerId: "tower-4", timestamp: "08:02", lprPlate: "กข 1234", lprVehicleDesc: "Toyota Hilux สีดำ", lprPhoto: "/lpr-1.png" },
  { suspectId: "s2", towerId: "tower-4", timestamp: "08:05", lprPlate: "ขค 5678", lprVehicleDesc: "Honda Civic สีขาว", lprPhoto: "/lpr-2.png" },
  { suspectId: "s3", towerId: "tower-4", timestamp: "08:10", lprPlate: "คง 9012", lprVehicleDesc: "Isuzu D-Max สีเทา", lprPhoto: "/lpr-3.png" },

  { suspectId: "s1", towerId: "tower-1", timestamp: "09:30", lprPlate: "กข 1234", lprVehicleDesc: "Toyota Hilux สีดำ", lprPhoto: "/lpr-1.png" },
  { suspectId: "s2", towerId: "tower-1", timestamp: "09:35", lprPlate: "ขค 5678", lprVehicleDesc: "Honda Civic สีขาว", lprPhoto: "/lpr-2.png" },
  { suspectId: "s3", towerId: "tower-1", timestamp: "09:40", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },

  { suspectId: "s1", towerId: "tower-2", timestamp: "11:00", lprPlate: "กข 1234", lprVehicleDesc: "Toyota Hilux สีดำ", lprPhoto: "/lpr-1.png" },
  { suspectId: "s2", towerId: "tower-2", timestamp: "11:10", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },
  { suspectId: "s3", towerId: "tower-2", timestamp: "11:15", lprPlate: "คง 9012", lprVehicleDesc: "Isuzu D-Max สีเทา", lprPhoto: "/lpr-3.png" },

  { suspectId: "s1", towerId: "tower-5", timestamp: "13:20", lprPlate: "กข 1234", lprVehicleDesc: "Toyota Hilux สีดำ", lprPhoto: "/lpr-1.png" },

  // === Gang B: s4, s5, s6 ===
  { suspectId: "s4", towerId: "tower-3", timestamp: "10:00", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },
  { suspectId: "s5", towerId: "tower-3", timestamp: "10:05", lprPlate: "ชซ 7890", lprVehicleDesc: "Toyota Camry สีเงิน", lprPhoto: "/lpr-4.png" },
  { suspectId: "s6", towerId: "tower-3", timestamp: "10:12", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },

  { suspectId: "s4", towerId: "tower-5", timestamp: "12:00", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },
  { suspectId: "s5", towerId: "tower-5", timestamp: "12:08", lprPlate: "ชซ 7890", lprVehicleDesc: "Toyota Camry สีเงิน", lprPhoto: "/lpr-4.png" },
  { suspectId: "s6", towerId: "tower-5", timestamp: "12:15", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },

  { suspectId: "s4", towerId: "tower-2", timestamp: "14:00", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },
  { suspectId: "s5", towerId: "tower-2", timestamp: "14:05", lprPlate: "ชซ 7890", lprVehicleDesc: "Toyota Camry สีเงิน", lprPhoto: "/lpr-4.png" },
  { suspectId: "s6", towerId: "tower-2", timestamp: "14:12", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },

  // === Independents ===
  { suspectId: "s7", towerId: "tower-1", timestamp: "07:30", lprPlate: "ฎฏ 6789", lprVehicleDesc: "Nissan Navara สีขาว", lprPhoto: "/lpr-5.png" },
  { suspectId: "s7", towerId: "tower-5", timestamp: "10:45", lprPlate: "ฎฏ 6789", lprVehicleDesc: "Nissan Navara สีขาว", lprPhoto: "/lpr-5.png" },
  { suspectId: "s7", towerId: "tower-3", timestamp: "14:30", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },

  { suspectId: "s8", towerId: "tower-4", timestamp: "09:00", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },
  { suspectId: "s8", towerId: "tower-1", timestamp: "12:30", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },

  { suspectId: "s9", towerId: "tower-2", timestamp: "08:20", lprPlate: "ณด 4567", lprVehicleDesc: "Toyota Fortuner สีดำ", lprPhoto: "/lpr-2.png" },
  { suspectId: "s9", towerId: "tower-3", timestamp: "11:45", lprPlate: "ณด 4567", lprVehicleDesc: "Toyota Fortuner สีดำ", lprPhoto: "/lpr-2.png" },
  { suspectId: "s9", towerId: "tower-5", timestamp: "15:00", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },

  { suspectId: "s10", towerId: "tower-3", timestamp: "09:30", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },
  { suspectId: "s10", towerId: "tower-5", timestamp: "13:00", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },

  { suspectId: "s11", towerId: "tower-1", timestamp: "08:30", lprPlate: "ตถ 8901", lprVehicleDesc: "Mazda BT-50 สีน้ำตาล", lprPhoto: "/lpr-3.png" },
  { suspectId: "s11", towerId: "tower-2", timestamp: "11:20", lprPlate: "ตถ 8901", lprVehicleDesc: "Mazda BT-50 สีน้ำตาล", lprPhoto: "/lpr-3.png" },
  { suspectId: "s11", towerId: "tower-4", timestamp: "15:45", lprPlate: null, lprVehicleDesc: null, lprPhoto: null },
];

export const detectedGangs: DetectedGang[] = [
  {
    id: "gang-a",
    name: "กลุ่ม A — เครือข่ายดอนเมือง",
    suspectIds: ["s1", "s2", "s3"],
    coLocations: [
      { towerId: "tower-4", timestamp: "08:02–08:10" },
      { towerId: "tower-1", timestamp: "09:30–09:40" },
      { towerId: "tower-2", timestamp: "11:00–11:15" },
    ],
    confidence: 94,
  },
  {
    id: "gang-b",
    name: "กลุ่ม B — เครือข่ายบางซื่อ",
    suspectIds: ["s4", "s5", "s6"],
    coLocations: [
      { towerId: "tower-3", timestamp: "10:00–10:12" },
      { towerId: "tower-5", timestamp: "12:00–12:15" },
      { towerId: "tower-2", timestamp: "14:00–14:12" },
    ],
    confidence: 89,
  },
];

export function getHitsForSuspect(suspectId: string): TowerHit[] {
  return towerHits
    .filter((h) => h.suspectId === suspectId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function getHitsForTower(towerId: string): TowerHit[] {
  return towerHits
    .filter((h) => h.towerId === towerId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function getTowerById(towerId: string): IMSITower | undefined {
  return imsiTowers.find((t) => t.id === towerId);
}

export function getSuspectById(suspectId: string): Suspect | undefined {
  return suspects.find((s) => s.id === suspectId);
}
