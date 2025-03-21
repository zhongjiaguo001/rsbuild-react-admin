/// <reference types="@rsbuild/core/types" />

interface ImportMetaEnv {
  readonly RS_BASE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
