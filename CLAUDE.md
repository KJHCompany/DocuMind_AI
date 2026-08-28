# Project Guide for Claude Code

## Tech Stack
- Backend: FastAPI, SQLAlchemy, PostgreSQL + pgvector
- Frontend: Next.js, TypeScript, Tailwind CSS
- AI: LangChain, OpenAI/Claude API (LLM_PROVIDER 스위치로 로컬 Ollama 전환 가능)

## Coding Rules
- 계층 단위(Router-Service-Repository)로 구조화
- 요청/응답 스키마에 Pydantic 모델 필수
- 문서/세션 접근 시 owner_id 검증 필수 (본인 리소스만 접근)
- Conventional Commits(feat:, fix:, docs:, refactor:) 사용

## 참고 문서
- [1.기획서.md](docs/1.기획서.md)
- [2.시스템아키텍처.md](docs/2.시스템아키텍처.md)
- [3.개발환경설정.md](docs/3.개발환경설정.md)
