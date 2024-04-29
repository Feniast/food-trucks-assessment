/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_API_BASEURL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
