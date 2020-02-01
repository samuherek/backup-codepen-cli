export type PenMeta = {
  id: string;
  title: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  hearts: number;
  comments: number;
  views: number;
};

export type PenConfig = {
  id: string;
  title: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  hearts: number;
  comments: number;
  views: number;
  settings: {
    html: {
      preprocessor: string;
      head: string;
    };
    css: {
      preprocessor: string;
      resources: string[];
    };
    js: {
      preprocessor: string;
      resources: string[];
    };
  };
  sourceFiles: string[];
};
