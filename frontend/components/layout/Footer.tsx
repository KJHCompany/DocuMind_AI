import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 sm:flex-row sm:justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 font-extrabold text-slate-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-sm text-white">
              D
            </span>
            <span>DocuMind AI</span>
          </Link>
          <p className="mt-2 max-w-xs text-sm text-slate-400">
            문서를 이해하는 AI. 답변엔 항상 출처가 붙습니다.
          </p>
        </div>

        <div className="flex gap-14">
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">제품</h4>
            <div className="flex flex-col gap-2 text-sm text-slate-500">
              <a href="#features" className="hover:text-slate-900">기능</a>
              <a href="#how-it-works" className="hover:text-slate-900">사용 방법</a>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">계정</h4>
            <div className="flex flex-col gap-2 text-sm text-slate-500">
              <Link href="/login" className="hover:text-slate-900">로그인</Link>
              <Link href="/signup" className="hover:text-slate-900">회원가입</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-slate-200 px-6 pt-5 text-xs text-slate-400">
        © 2026 DocuMind AI · 포트폴리오 프로토타입
      </div>
    </footer>
  );
}
