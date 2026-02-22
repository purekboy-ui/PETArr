# AGENTS.md

> 重要：在處理本專案的任何任務時，請優先使用基於檢索的推理（retrieval-led reasoning），而非僅依賴預訓練的推理。

## 專案上下文 (Project Context)
|name:NM_PETArr|tech:|framework:unknown|

## 規則索引 (Rule Index, .agent/)
|skills:{api-design.skill.md,bdi-mental-states.skill.md,brainstorming.skill.md,CATALOG.md,CHANGELOG.md,claude-api-cost.skill.md,code-review.skill.md,context-optimization.skill.md,CONTRIBUTING.md,db-schema.skill.md,error-handling.skill.md,naming-convention.skill.md,package-lock.json,package.json,payment.skill.md,performance.skill.md,python-patterns.skill.md,README.md,research.skill.md,SECURITY.md,security.skill.md,skill-acquisition.skill.md,skills_index.json,systematic-debugging.skill.md,tdd-workflow.skill.md,tech-stack.skill.md,typescript-patterns.skill.md,ui-design.skill.md,UxSoul-extractor.skill.md,verification-before-completion.skill.md,visualization.skill.md,writing-plans.skill.md}|
|workflows:{adr.md,changelog.md,chrome-extension.md,commit.md,db-migrate.md,deploy.md,init-docs.md,publish-extension.md,regression-guard.md,release.md,skill-acquisition.md,testing.md,ux-audit.md,UxSoul-scan.md}|
|agents:{build-fixer.md,code-reviewer.md,documentation-writer.md,test-writer.md}|
|hooks:{commit-msg.json,console-log-detector.json,pre-commit.json,secret-scanner.json}|

## 開發指南 (Instructions)

開發本專案時請注意：
1. 實作功能前，請先閱讀 `.agent/skills/` 中相關的技能檔案
2. 執行特定任務時，請遵循 `.agent/workflows/` 中的工作流指示
3. 請查看專案根目錄的 `user_rules.md` 以了解專案專屬的開發規範

---
*由 Pixiu Agent 自動生成*