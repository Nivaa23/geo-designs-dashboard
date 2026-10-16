export type AttachmentCategory =
  | 'image'
  | 'video'
  | 'document'
  | 'engineering'
  | 'archive'
  | 'file';

export interface ChatAttachment {
  id: string;
  name: string;
  size: number;
  formattedSize: string;
  type: string;
  category: AttachmentCategory;
  extension: string;
  previewUrl?: string; // object URL for images
  file?: File;
}

export interface ChatEmployee {
  id: string;
  name: string;
  title: string;
  department: string;
  avatarText: string;
  avatarBg?: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'away';
  unreadCount?: number;
  lastActive?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
  attachments?: ChatAttachment[];
}

export const ATTACHMENT_CONFIG = {
  maxFileSizeMB: 50,
  maxFileSizeBytes: 50 * 1024 * 1024,
  maxAttachmentsPerMessage: 10,
  engineeringExtensions: [
    'dwg', 'dxf', 'dwt', 'dgn', // AutoCAD / CAD
    'rvt', 'rfa', 'ifc', // Revit / BIM
    'xml', 'landxml', 'las', 'laz', 'shp', 'shx', 'dbf', 'prj', 'gpkg', 'geojson', // Civil / GIS
    'blend', 'obj', 'fbx', 'stl', 'glb', 'gltf', 'step', 'stp', 'iges', 'igs', // 3D modelling
    'dwf', 'dwfx', 'plt', 'svg', 'tif', 'tiff', // Technical drawings
    'zip', 'rar', '7z', 'tar', 'gz' // Archives
  ]
};
