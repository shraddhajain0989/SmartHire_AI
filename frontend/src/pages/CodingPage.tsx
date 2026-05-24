import { useEffect, useState } from 'react'
import { fetchCodingQuestions, submitCodingSolution, CodingQuestion, RunCodeResponse } from '../services/coding'
import LoadingSpinner from '../components/LoadingSpinner'

type SupportedLanguage = 'python' | 'javascript' | 'c' | 'cpp' | 'java'

export default function CodingPage() {
  const [questions, setQuestions] = useState<CodingQuestion[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<CodingQuestion | null>(null)
  const [language, setLanguage] = useState<SupportedLanguage>('python')
  const [codes, setCodes] = useState<Record<SupportedLanguage, string>>({
    python: '',
    javascript: '',
    c: '',
    cpp: '',
    java: '',
  })
  const [running, setRunning] = useState<boolean>(false)
  const [result, setResult] = useState<RunCodeResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchCodingQuestions()
      .then((data) => {
        setQuestions(data)
        if (data.length > 0) {
          const q = data[0]
          setSelectedQuestion(q)
          setCodes({
            python: q.templates.python,
            javascript: q.templates.javascript,
            c: q.templates.c,
            cpp: q.templates.cpp,
            java: q.templates.java,
          })
          setLanguage('python')
        }
      })
      .catch((err) => console.error('Failed to load questions', err))
      .finally(() => setLoading(false))
  }, [])

  const handleSelectQuestion = (q: CodingQuestion) => {
    setSelectedQuestion(q)
    setCodes({
      python: q.templates.python,
      javascript: q.templates.javascript,
      c: q.templates.c,
      cpp: q.templates.cpp,
      java: q.templates.java,
    })
    setLanguage('python')
    setResult(null)
  }

  const handleResetCode = () => {
    if (selectedQuestion) {
      setCodes({
        ...codes,
        [language]: selectedQuestion.templates[language],
      })
    }
  }

  const handleRunCode = async () => {
    if (!selectedQuestion) return
    setRunning(true)
    setResult(null)
    try {
      const response = await submitCodingSolution({
        question_id: selectedQuestion.id,
        code: codes[language],
        language: language,
      })
      setResult(response)
    } catch {
      setResult({
        success: false,
        all_passed: false,
        error: 'Failed to communicate with coding server. Please try again.',
        stdout: '',
      })
    } finally {
      setRunning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <section className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-8 shadow-glass backdrop-blur-xl transition-all duration-300">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Coding Practice Arena</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Solve algorithmic challenges in Python, JavaScript, C, C++, or Java. Compile, run, and check test results instantly.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Questions List & Details */}
        <div className="space-y-6 lg:col-span-5">
          {/* Question List Card */}
          <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-300">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Select Problem</h2>
            <div className="space-y-2">
              {questions.map((q) => {
                const isSelected = selectedQuestion?.id === q.id
                const diffColor =
                  q.difficulty === 'Easy'
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
                return (
                  <button
                    key={q.id}
                    onClick={() => handleSelectQuestion(q)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'bg-slate-100/80 dark:bg-slate-950/80 border-cyan-500/50 dark:border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.06)]'
                        : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-950/60'
                    }`}
                  >
                    <div>
                      <h3 className="font-semibold text-slate-850 dark:text-white">{q.title}</h3>
                      <span className="text-xs text-slate-400 dark:text-slate-500">ID: {q.id}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${diffColor}`}>
                      {q.difficulty}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description Card */}
          {selectedQuestion && (
            <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-300 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{selectedQuestion.title}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    selectedQuestion.difficulty === 'Easy'
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
                  }`}
                >
                  {selectedQuestion.difficulty}
                </span>
              </div>
              <div className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-line leading-relaxed overflow-y-auto max-h-[40vh] pr-2">
                {selectedQuestion.description}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & Results */}
        <div className="space-y-6 lg:col-span-7">
          {/* Editor Workspace */}
          <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-300 flex flex-col h-[550px]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Language:</span>
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value as SupportedLanguage)
                    setResult(null)
                  }}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/80 px-3 py-1.5 text-xs text-slate-800 dark:text-white outline-none font-mono"
                >
                  <option value="python">Python 3</option>
                  <option value="javascript">JavaScript (Node)</option>
                  <option value="c">C (GCC)</option>
                  <option value="cpp">C++ (G++)</option>
                  <option value="java">Java (JDK)</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleResetCode}
                  className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-55 dark:bg-slate-950/80 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition"
                >
                  Reset Template
                </button>
                <button
                  onClick={handleRunCode}
                  disabled={running}
                  className="rounded-full bg-cyan-500 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition disabled:opacity-50"
                >
                  {running ? 'Running...' : 'Run Code'}
                </button>
              </div>
            </div>

            <div className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden relative transition-colors duration-300">
              <textarea
                value={codes[language]}
                onChange={(e) => setCodes({ ...codes, [language]: e.target.value })}
                className="w-full h-full p-4 bg-transparent text-slate-800 dark:text-slate-100 font-mono text-sm outline-none resize-none leading-relaxed"
                placeholder={`// Write your ${language.toUpperCase()} code here`}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Results Console */}
          {(result || running) && (
            <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/80 p-6 shadow-glass backdrop-blur-xl transition-all duration-300 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Execution Console</h3>
              {running ? (
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <LoadingSpinner />
                  <span>Compiling and running code against test cases...</span>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  {/* Success Banner */}
                  {result.success ? (
                    result.all_passed ? (
                      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ All test cases passed successfully!
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 text-rose-600 dark:text-rose-400 font-medium">
                        ✗ Some test cases failed. Review test execution details below.
                      </div>
                    )
                  ) : (
                    <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 font-mono text-xs text-rose-600 dark:text-rose-400 overflow-x-auto whitespace-pre leading-relaxed">
                      {result.error}
                    </div>
                  )}

                  {/* Standard output log */}
                  {result.stdout && (
                    <div className="space-y-1">
                      <span className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold">Standard Output</span>
                      <pre className="rounded-2xl bg-slate-100 dark:bg-slate-950 p-4 text-slate-700 dark:text-slate-300 font-mono text-xs overflow-x-auto border border-slate-200 dark:border-slate-800">
                        {result.stdout}
                      </pre>
                    </div>
                  )}

                  {/* Test case list */}
                  {result.success && result.results && (
                    <div className="space-y-2">
                      <span className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold block mb-2">Test Cases Run</span>
                      <div className="space-y-2.5">
                        {result.results.map((tc) => (
                          <div
                            key={tc.test_case}
                            className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              tc.passed
                                ? 'bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/10'
                                : 'bg-rose-500/5 border-rose-200 dark:border-rose-500/10'
                            }`}
                          >
                            <div className="space-y-1 text-xs font-mono text-slate-700 dark:text-slate-300">
                              <div>
                                <span className="text-slate-400 dark:text-slate-500 font-semibold">Inputs:</span> {tc.inputs}
                              </div>
                              {tc.error ? (
                                <div className="text-rose-600 dark:text-rose-400">
                                  <span className="text-slate-400 dark:text-slate-500 font-semibold">Error:</span> {tc.error}
                                </div>
                              ) : (
                                <>
                                  <div>
                                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Expected:</span> {tc.expected}
                                  </div>
                                  <div>
                                    <span className="text-slate-400 dark:text-slate-500 font-semibold">Output:</span>{' '}
                                    <span className={tc.passed ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
                                      {tc.output}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-center">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  tc.passed
                                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20'
                                    : 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-200 dark:border-rose-500/20'
                                }`}
                              >
                                {tc.passed ? 'PASSED' : 'FAILED'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
