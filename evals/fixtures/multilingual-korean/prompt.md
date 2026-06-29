# Prompt

`/gooblin` 이 수정 계획을 검토해줘.

상황:

- 파일: `src/settings/profile.ts`
- 증상: 저장 버튼을 누르면 `TypeError: Cannot read properties of undefined (reading 'timezone')`
- 기존 계획: 설정 저장 흐름을 전부 새 service layer로 옮기고, timezone helper 패키지를 추가하고, 모든 profile form을 같이 리팩터링한다.

원하는 것:

- 한국어로 답변해줘.
- 코드, 파일 경로, 명령어, 에러 메시지는 원문 그대로 유지해줘.
- 지금 당장 ship 가능한 가장 작은 수정 방향과 검증 방법을 알려줘.
