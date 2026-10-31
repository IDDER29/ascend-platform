/** The ShellForge brief: requirements, milestones and reference links (used by the brief pages). */

export const REQUIREMENTS = [
  { id: "repl", title: "A read–eval–print loop", detail: "Print a prompt, read a line, run it, repeat until EOF.", bonus: false },
  { id: "exec", title: "Run external programs", detail: "Locate the binary on $PATH and execute it in a child process.", bonus: false },
  { id: "builtins", title: "Built-in commands", detail: "Implement cd, exit and env inside the shell itself.", bonus: false },
  { id: "pipes", title: "Pipes", detail: "Support at least one pipe: cmd1 | cmd2, wiring stdout→stdin.", bonus: false },
  { id: "redirect", title: "Redirections", detail: "Handle >, < and >> to files.", bonus: false },
  { id: "signals", title: "Signal handling", detail: "Ctrl-C interrupts the running command, not your shell.", bonus: false },
  { id: "bonus", title: "Multiple pipes & quoting", detail: "Chain 3+ commands and respect \"quoted\" arguments.", bonus: true },
] as const;

export const MILESTONES = [
  { title: "The prompt loop", time: "~45 min", detail: "Print a prompt, read a line with getline, echo it back. Exit cleanly on Ctrl-D." },
  { title: "Run one command", time: "~1 hr", detail: "Tokenize the line, fork, execve the binary, wait for it. Hello, ls." },
  { title: "Built-ins & PATH", time: "~1 hr", detail: "Search $PATH; special-case cd, exit, env before forking." },
  { title: "Pipes & redirection", time: "~2 hr", detail: "Set up pipe() and dup2() so output flows between commands and files." },
  { title: "Signals & polish", time: "~1 hr", detail: "Trap SIGINT, free everything, pass with no leaks under valgrind." },
];

export const RESOURCES = [
  {
    title: "fork(2) man page",
    meta: "Documentation",
    href: "https://man7.org/linux/man-pages/man2/fork.2.html",
  },
  {
    title: "execve(2) man page",
    meta: "Documentation",
    href: "https://man7.org/linux/man-pages/man2/execve.2.html",
  },
  {
    title: "dup2(2) man page",
    meta: "Documentation: pipes & redirection",
    href: "https://man7.org/linux/man-pages/man2/dup2.2.html",
  },
];

