const FEATURES = [
  {
    icon: "⬆️",
    chip: "bg-indigo-50",
    title: "드래그 앤 드롭 업로드",
    desc: "PDF 문서를 끌어다 놓으면 즉시 업로드되어 파싱 대기열에 등록됩니다.",
  },
  {
    icon: "🧩",
    chip: "bg-emerald-50",
    title: "자동 청킹 & 임베딩",
    desc: "문서를 의미 단위로 나눠 벡터화하고, 파싱 상태(준비완료·파싱중·실패)를 실시간으로 표시합니다.",
  },
  {
    icon: "💬",
    chip: "bg-amber-50",
    title: "출처 인용 답변",
    desc: "답변마다 근거가 된 페이지를 인용해, 클릭 한 번으로 원문 위치로 이동·하이라이팅됩니다.",
  },
  {
    icon: "⚡",
    chip: "bg-purple-50",
    title: "실시간 스트리밍",
    desc: "SSE 기반으로 토큰이 생성되는 순간부터 답변이 흘러나와 긴 요약도 지루하지 않게 확인합니다.",
  },
  {
    icon: "🗂️",
    chip: "bg-teal-50",
    title: "세션 관리",
    desc: "문서·주제별로 채팅 세션을 만들고, 과거 대화를 언제든 다시 열어 이어갈 수 있습니다.",
  },
  {
    icon: "🔒",
    chip: "bg-rose-50",
    title: "소유자 기반 접근 제어",
    desc: "JWT 인증과 리소스 소유권(owner_id) 검증으로 본인 문서·세션에만 접근할 수 있습니다.",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-xl">
          <span className="inline-block rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
            CORE FEATURES
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
            문서를 이해하는 AI,
            <br />
            제대로 작동하려면 이런 게 필요합니다.
          </h2>
          <p className="mt-3 text-[15px] text-slate-500">
            DocuMind AI는 단순한 챗봇이 아닙니다. 파싱, 검색, 답변, 인용까지 문서 워크플로 전체를 하나로 묶은
            지식베이스 플랫폼입니다.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg ${f.chip}`}>
                {f.icon}
              </div>
              <h3 className="mb-2 text-[15px] font-extrabold text-slate-900">{f.title}</h3>
              <p className="text-[13px] text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
