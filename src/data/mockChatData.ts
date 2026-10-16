import type { ChatEmployee, ChatMessage } from '../types/chat';

export const MOCK_CHAT_EMPLOYEES: ChatEmployee[] = [
  {
    id: 'emp-om-parikh',
    name: 'Om Parikh',
    title: 'Design MES - Developer',
    department: 'Engineering & MES Systems',
    avatarText: 'OP',
    avatarBg: '#0284C7',
    status: 'online',
    unreadCount: 1,
    lastActive: 'Active now'
  },
  {
    id: 'usr-102',
    name: 'Alex Rivera',
    title: 'Junior Field Specialist',
    department: 'Structural Surveying',
    avatarText: 'AR',
    avatarBg: '#10B981',
    status: 'online',
    unreadCount: 0,
    lastActive: 'Active now'
  },
  {
    id: 'usr-103',
    name: 'Marcus Vance',
    title: 'Principal Team Lead',
    department: 'Hydrology & Mapping',
    avatarText: 'MV',
    avatarBg: '#6366F1',
    status: 'away',
    unreadCount: 0,
    lastActive: 'Away 15m'
  },
  {
    id: 'usr-104',
    name: 'Elena Rostova',
    title: 'Head of People Operations',
    department: 'People & Operations',
    avatarText: 'ER',
    avatarBg: '#F43F5E',
    status: 'online',
    unreadCount: 0,
    lastActive: 'Active now'
  },
  {
    id: 'usr-105',
    name: 'David Sterling',
    title: 'VP of Engineering',
    department: 'Executive Leadership',
    avatarText: 'DS',
    avatarBg: '#D97706',
    status: 'offline',
    unreadCount: 0,
    lastActive: 'Offline'
  }
];

export const INITIAL_CONVERSATIONS: Record<string, ChatMessage[]> = {
  'emp-om-parikh': [
    {
      id: 'msg-om-1',
      senderId: 'emp-om-parikh',
      senderName: 'Om Parikh',
      text: "Hello Sarah, I've reviewed the updated CAD alignment and geotechnical borehole logs for the Delhi-Agra Expressway package.",
      timestamp: 'Today, 10:14 AM',
      isCurrentUser: false,
      attachments: [
        {
          id: 'att-mock-1',
          name: 'Delhi_Agra_Borehole_Logs_KM42.dwg',
          size: 4404019,
          formattedSize: '4.2 MB',
          type: 'application/acad',
          category: 'engineering',
          extension: 'dwg'
        }
      ]
    },
    {
      id: 'msg-om-2',
      senderId: 'usr-current',
      senderName: 'Sarah Jenkins',
      text: 'Thanks Om! Did you verify the soil settlement parameters on chainage 42+500?',
      timestamp: 'Today, 10:20 AM',
      isCurrentUser: true
    },
    {
      id: 'msg-om-3',
      senderId: 'emp-om-parikh',
      senderName: 'Om Parikh',
      text: 'Yes, the SPT N-values and moisture content reports have been cross-checked with the lab results. The settlement curves are well within the allowable 25mm limit.',
      timestamp: 'Today, 10:25 AM',
      isCurrentUser: false
    },
    {
      id: 'msg-om-4',
      senderId: 'usr-current',
      senderName: 'Sarah Jenkins',
      text: 'Great work. I will review the final structural drawings before sending them to the client.',
      timestamp: 'Today, 10:32 AM',
      isCurrentUser: true
    },
    {
      id: 'msg-om-5',
      senderId: 'emp-om-parikh',
      senderName: 'Om Parikh',
      text: 'Sounds good! Let me know if you need any adjustments to the MES models or cross-sectional meshes.',
      timestamp: 'Today, 10:35 AM',
      isCurrentUser: false
    }
  ],
  'usr-102': [
    {
      id: 'msg-ar-1',
      senderId: 'usr-102',
      senderName: 'Alex Rivera',
      text: 'Good morning Sarah. The DGPS rover equipment for Site 4B has been calibrated and is ready for the afternoon survey.',
      timestamp: 'Yesterday, 04:15 PM',
      isCurrentUser: false
    },
    {
      id: 'msg-ar-2',
      senderId: 'usr-current',
      senderName: 'Sarah Jenkins',
      text: 'Excellent. Please coordinate with the safety officer before starting field measurements.',
      timestamp: 'Yesterday, 04:30 PM',
      isCurrentUser: true
    }
  ],
  'usr-103': [
    {
      id: 'msg-mv-1',
      senderId: 'usr-103',
      senderName: 'Marcus Vance',
      text: 'Hi Sarah, the hydrology flood modeling data for Yamuna Basin has been uploaded to the shared repository.',
      timestamp: '18 Oct 2026, 02:40 PM',
      isCurrentUser: false
    }
  ],
  'usr-104': [
    {
      id: 'msg-er-1',
      senderId: 'usr-104',
      senderName: 'Elena Rostova',
      text: 'Hi Sarah, just a reminder regarding the Q3 engineering development review schedules next week.',
      timestamp: '17 Oct 2026, 11:00 AM',
      isCurrentUser: false
    }
  ],
  'usr-105': [
    {
      id: 'msg-ds-1',
      senderId: 'usr-105',
      senderName: 'David Sterling',
      text: 'Sarah, please ensure the executive milestone summary for the NHAI corridor is finalized by Friday.',
      timestamp: '16 Oct 2026, 09:30 AM',
      isCurrentUser: false
    }
  ]
};
