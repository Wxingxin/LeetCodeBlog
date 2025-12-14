export type TestCase = {
  name: string;
  input: any[];
  expected: any;
  hidden?: boolean;
};

export type JudgeMode = "deepEqual" | "unorderedPair";

export type Problem = {
  id: string;
  title: string;
  description: string;
  entry: string;
  starterCode: string;
  tests: TestCase[];
  judgeMode?: JudgeMode;
};

export type RunResult =
  | { status: "idle" }
  | { status: "running" }
  | {
      status: "done";
      passed: number;
      total: number;
      details: Array<{
        name: string;
        ok: boolean;
        input?: any[];
        expected?: any;
        actual?: any;
        error?: string;
        hidden?: boolean;
      }>;
    };
