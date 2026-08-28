/* ==========================================================================
   DocuMind AI — 목(mock) 데이터
   기획서 ERD(User/Document/Chunk/ChatSession/ChatMessage/Citation)를 참고해
   화면 시연에 필요한 만큼만 단순화한 더미 데이터입니다.
   ========================================================================== */

const MOCK_DOCUMENTS = [
  {
    id: 1,
    fileName: "2026년 연차보고서.pdf",
    category: "보고서",
    fileType: "pdf",
    status: "READY",
    pageCount: 32,
    chunkCount: 128,
    fileSizeMB: 8.4,
    createdAt: "2026-08-26",
  },
  {
    id: 2,
    fileName: "제품 매뉴얼 v2.pdf",
    category: "매뉴얼",
    fileType: "pdf",
    status: "READY",
    pageCount: 45,
    chunkCount: 210,
    fileSizeMB: 12.1,
    createdAt: "2026-08-25",
  },
  {
    id: 3,
    fileName: "계약서_v3.pdf",
    category: "계약",
    fileType: "pdf",
    status: "PARSING",
    pageCount: 18,
    chunkCount: 0,
    fileSizeMB: 3.2,
    createdAt: "2026-08-25",
  },
  {
    id: 4,
    fileName: "인사규정 개정안.docx",
    category: "규정",
    fileType: "docx",
    status: "READY",
    pageCount: 12,
    chunkCount: 56,
    fileSizeMB: 1.8,
    createdAt: "2026-08-24",
  },
  {
    id: 5,
    fileName: "마케팅 전략 발표자료.pptx",
    category: "프레젠테이션",
    fileType: "pptx",
    status: "FAILED",
    pageCount: 28,
    chunkCount: 0,
    fileSizeMB: 22.6,
    createdAt: "2026-08-23",
  },
  {
    id: 6,
    fileName: "고객 피드백 정리.txt",
    category: "기타",
    fileType: "txt",
    status: "READY",
    pageCount: 6,
    chunkCount: 22,
    fileSizeMB: 0.4,
    createdAt: "2026-08-22",
  },
  {
    id: 7,
    fileName: "Q2 실적 분석 보고서.pdf",
    category: "보고서",
    fileType: "pdf",
    status: "READY",
    pageCount: 24,
    chunkCount: 101,
    fileSizeMB: 6.7,
    createdAt: "2026-08-21",
  },
  {
    id: 8,
    fileName: "서비스 이용약관.pdf",
    category: "약관",
    fileType: "pdf",
    status: "READY",
    pageCount: 12,
    chunkCount: 48,
    fileSizeMB: 1.1,
    createdAt: "2026-08-18",
  },
];

const FILE_TYPE_META = {
  pdf: { emoji: "📕", chip: "chip-pdf" },
  docx: { emoji: "📘", chip: "chip-docx" },
  pptx: { emoji: "📙", chip: "chip-pptx" },
  txt: { emoji: "📄", chip: "chip-txt" },
};

const MOCK_SESSIONS = [
  {
    id: 101,
    title: "연차보고서 주요 지표 정리",
    pinned: true,
    docName: "2026년 연차보고서.pdf",
    lastQuestion: "2025년 매출 성장률이 전년 대비 얼마나 증가했는지 알려줘",
    updatedAt: "방금 전",
    messageCount: 14,
  },
  {
    id: 102,
    title: "계약서 조항 분석",
    pinned: false,
    docName: "계약서_v3.pdf",
    lastQuestion: "3조의 배상 책임 범위에 대해 설명해줘",
    updatedAt: "30분 전",
    messageCount: 8,
  },
  {
    id: 103,
    title: "제품 매뉴얼 설치 가이드",
    pinned: false,
    docName: "제품 매뉴얼 v2.pdf",
    lastQuestion: "초기 설치 시 필요한 사전 준비물이 뭐야?",
    updatedAt: "2시간 전",
    messageCount: 21,
  },
  {
    id: 104,
    title: "인사규정 휴가 규정 확인",
    pinned: false,
    docName: "인사규정 개정안.docx",
    lastQuestion: "연차 사용 기준일과 발생 기준을 알려줘",
    updatedAt: "어제",
    messageCount: 6,
  },
  {
    id: 105,
    title: "Q2 실적 브리핑",
    pinned: false,
    docName: "Q2 실적 분석 보고서.pdf",
    lastQuestion: "Q2 실적의 핵심 하이라이트 3가지를 요약해줘",
    updatedAt: "어제",
    messageCount: 11,
  },
  {
    id: 106,
    title: "이용약관 환불 조항 문의",
    pinned: false,
    docName: "서비스 이용약관.pdf",
    lastQuestion: "환불은 언제까지 가능한가요?",
    updatedAt: "2일 전",
    messageCount: 4,
  },
  {
    id: 107,
    title: "고객 피드백 키워드 분석",
    pinned: false,
    docName: "고객 피드백 정리.txt",
    lastQuestion: "가장 많이 언급된 불만 키워드 3가지는?",
    updatedAt: "3일 전",
    messageCount: 5,
  },
];

// 세션별 대화 히스토리 (마지막 메시지는 스트리밍 데모용으로 chat-session.js에서 재생)
const MOCK_MESSAGES = {
  101: [
    { role: "user", content: "2025년 매출 성장률이 전년 대비 얼마나 증가했는지 알려줘" },
    {
      role: "assistant",
      content:
        "연매출은 4,280억 원으로 집계되어 2024년 대비 약 23.4% 성장했습니다. 특히 3분기에 신제품 출시와 함께 매출이 크게 상승한 것으로 나타났습니다.",
      citations: [{ page: 5, label: "5페이지" }, { page: 8, label: "8페이지" }],
    },
    { role: "user", content: "사업 부문별 매출 비중도 알려줘" },
    {
      role: "assistant",
      content:
        "사업 부문별 매출 비중은 소프트웨어 부문이 48%로 가장 높고, 그다음으로 하드웨어 31%, 서비스·컨설팅 21% 순입니다. 소프트웨어 부문이 전년 대비 30% 이상 성장하며 전체 성장을 이끌었습니다.",
      citations: [{ page: 9, label: "9페이지" }, { page: 12, label: "12페이지" }],
    },
  ],
  102: [
    { role: "user", content: "3조의 배상 책임 범위에 대해 설명해줘" },
    {
      role: "assistant",
      content:
        "3조에 따르면 배상 책임은 고의 또는 중대한 과실로 발생한 손해로 한정되며, 배상 한도는 계약 금액의 100%를 초과하지 않습니다.",
      citations: [{ page: 4, label: "4페이지" }],
    },
  ],
  103: [
    { role: "user", content: "초기 설치 시 필요한 사전 준비물이 뭐야?" },
    {
      role: "assistant",
      content: "설치 전 최신 OS 업데이트, 4GB 이상의 여유 저장공간, 관리자 권한 계정이 필요합니다.",
      citations: [{ page: 3, label: "3페이지" }],
    },
  ],
  104: [
    { role: "user", content: "연차 사용 기준일과 발생 기준을 알려줘" },
    {
      role: "assistant",
      content: "입사일 기준 1개월 만근 시 1일의 연차가 발생하며, 1년 만근 시 15일이 부여됩니다.",
      citations: [{ page: 3, label: "3페이지" }],
    },
  ],
  105: [
    { role: "user", content: "Q2 실적의 핵심 하이라이트 3가지를 요약해줘" },
    {
      role: "assistant",
      content: "① 매출 전분기 대비 18% 성장 ② 신규 고객 320개사 확보 ③ 해외 매출 비중 12%p 상승입니다.",
      citations: [{ page: 2, label: "2페이지" }, { page: 6, label: "6페이지" }],
    },
  ],
  106: [
    { role: "user", content: "환불은 언제까지 가능한가요?" },
    {
      role: "assistant",
      content:
        "결제일로부터 7일 이내, 서비스를 실제로 사용하지 않은 경우에 한해 전액 환불이 가능합니다. 이후에는 잔여 기간에 비례해 환불됩니다.",
      citations: [{ page: 4, label: "4페이지" }],
    },
  ],
  107: [
    { role: "user", content: "가장 많이 언급된 불만 키워드 3가지는?" },
    {
      role: "assistant",
      content: "가장 많이 언급된 키워드는 '느린 응답 속도', '복잡한 초기 설정', '모바일 UI 불편'입니다.",
      citations: [{ page: 1, label: "1페이지" }],
    },
  ],
};

const MOCK_NOTIFICATIONS = [
  { icon: "✅", chip: "chip-green", title: "연차보고서.pdf 파싱 완료", time: "2분 전" },
  { icon: "💬", chip: "chip-indigo", title: "새 채팅 세션 3건 시작됨", time: "1시간 전" },
  { icon: "⚠️", chip: "chip-amber", title: "계약서_v3.pdf 파싱 실패", time: "어제" },
];

const MOCK_ADMIN_ROWS = [
  { user: "김민준", email: "minjun@example.com", role: "회원", plan: "Pro", docs: 12, sessions: 34, tokens: 84_500, lastActive: "방금 전", active: true },
  { user: "이서연", email: "seoyeon@example.com", role: "회원", plan: "Pro", docs: 27, sessions: 118, tokens: 312_000, lastActive: "5분 전", active: true },
  { user: "박지훈", email: "jihoon@example.com", role: "회원", plan: "Basic", docs: 8, sessions: 22, tokens: 53_200, lastActive: "1시간 전", active: true },
  { user: "최수아", email: "sua@example.com", role: "회원", plan: "Pro", docs: 45, sessions: 203, tokens: 542_000, lastActive: "3시간 전", active: true },
  { user: "정다은", email: "daeun@example.com", role: "관리자", plan: "Pro", docs: 3, sessions: 9, tokens: 21_400, lastActive: "1일 전", active: false },
];

const MOCK_CURRENT_USER_USAGE = {
  plan: "Pro",
  joinedAt: "2026.03.12",
  tokensUsed: 84_500,
  tokensLimit: 500_000,
  docsUsed: 12,
  docsLimit: 100,
};

const ADMIN_SUMMARY = {
  totalDocs: 248,
  totalSessions: 1543,
  totalTokens: "1.3M",
  activeUsers: 186,
  todayDocs: 32,
  todaySessions: 214,
  todayTokens: "184.0K",
  growthVsYesterday: "+12.5%",
  growthNote: "주간 활성 사용자와 토큰 사용량이 꾸준히 증가하고 있습니다. 지난 4주 대비 사용률 +18%",
};

function dmStatusBadge(status) {
  const map = {
    PARSING: { cls: "badge-parsing", label: "파싱중" },
    READY: { cls: "badge-ready", label: "준비완료" },
    FAILED: { cls: "badge-failed", label: "실패" },
  };
  const m = map[status] || map.PARSING;
  return `<span class="badge ${m.cls}">${m.label}</span>`;
}

function dmFileIcon(fileType) {
  return FILE_TYPE_META[fileType] || FILE_TYPE_META.pdf;
}
