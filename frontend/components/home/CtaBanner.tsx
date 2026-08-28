import Link from "next/link";

export default function CtaBanner() {
  return (
    <div className="px-6 pb-16">
      <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 px-10 py-14 text-center text-white">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-[26px]">
          첫 문서를 지금 올리고
          <br />
          AI 지식베이스를 만들어보세요.
        </h2>
        <p className="mt-3 text-sm text-white/70">카드 등록 없이 무료로 시작할 수 있어요.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition-colors hover:bg-slate-100"
          >
            무료로 시작하기 →
          </Link>
          <a
            href="#how-it-works"
            className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            어떻게 동작하나요
          </a>
        </div>
      </div>
    </div>
  );
}
