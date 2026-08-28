const STEPS = [
  { num: "01", icon: "⬆️", title: "문서 업로드", desc: "PDF 파일을 끌어다 놓으면 자동으로 업로드 대기열에 등록됩니다." },
  { num: "02", icon: "🧠", title: "AI가 파싱 & 인덱싱", desc: "텍스트 추출 → 청크 분할 → 임베딩 저장까지 자동으로 처리합니다." },
  { num: "03", icon: "💬", title: "세션 열고 질문", desc: "문서 하나를 골라 채팅 세션을 만들고 자유롭게 질문하세요." },
  { num: "04", icon: "📎", title: "출처와 함께 답변", desc: "답변에 달린 인용을 클릭하면 우측 뷰어에서 해당 페이지가 하이라이팅됩니다." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-slate-200 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-block rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
              HOW IT WORKS
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
              4단계로 끝나는
              <br />
              문서 → 답변 파이프라인
            </h2>
          </div>
          <p className="max-w-64 text-[13px] text-slate-500">
            복잡한 설정 없이 문서만 올리면, 나머지는 DocuMind가 알아서 처리합니다.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 lg:flex-row">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-stretch gap-3 lg:contents">
              <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-2.5 text-[11px] font-bold text-slate-400">{s.num}</div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
                  {s.icon}
                </div>
                <h3 className="mb-1.5 text-sm font-extrabold text-slate-900">{s.title}</h3>
                <p className="text-[12.5px] text-slate-500">{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden items-center text-lg text-slate-300 lg:flex">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
