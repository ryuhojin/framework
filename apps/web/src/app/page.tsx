import styles from "./page.module.css";
import type { ApiInfo, HealthResponse } from "@framework/shared-types";

const mockApiInfo: ApiInfo = {
  name: "framework-template",
  description: "NestJS 백엔드(`/api/*`)와 연동될 Next.js(App Router) 스켈레톤",
};

const mockHealth: HealthResponse = {
  status: "ok",
  version: "0.0.1",
  timestamp: new Date().toISOString(),
  env: "local",
  db: "disabled",
};

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>전자정부 스타일 모노레포 시작점</h1>
          <p>
            금융권 온프레미스 환경을 염두에 둔 Next.js + NestJS 골격입니다. 프론트는
            App Router 기반이며, 백엔드는 추후 `/api/*`로 연결됩니다. Yarn 오프라인
            캐시와 환경 분리(.env local/dev/prod)를 기본 제공합니다.
          </p>
        </div>
        <div className={styles.ctas}>
          <div className={styles.secondary}>
            <div><strong>API</strong>: {mockApiInfo.name}</div>
            <div>{mockApiInfo.description}</div>
            <div>
              상태: {mockHealth.status} / 버전: {mockHealth.version}
            </div>
          </div>
          <div className={styles.secondary}>
            <div><strong>다음 단계</strong></div>
            <div>- `yarn workspace api start:dev` 로 백엔드 실행</div>
            <div>- `yarn workspace web dev` 로 프론트 실행</div>
            <div>- Docker: `docker compose up --build`</div>
          </div>
        </div>
      </main>
    </div>
  );
}
