/**
 * Outlines for courses that have no lessons yet: their sections and every lesson and project planned
 * in them. The path pages show these as "Coming soon". When a course gets its first real lesson it
 * becomes a topic (a level id in `src/lib/content/schema.ts`) and its outline moves to `course-outlines.ts`.
 * Where each concept lives, and why: `docs/curriculum/registry.md`.
 */

/** A planned lesson or project; the description is one sentence shown under its title on the path page. */
export type PlannedItem = { id: string; title: string; description: string; project?: boolean };
export type PlannedSection = { id: string; title: string; blurb?: string; items: PlannedItem[] };

const lesson = (id: string, title: string, description: string): PlannedItem => ({ id, title, description });
const project = (id: string, title: string, description: string): PlannedItem => ({
  id,
  title,
  description,
  project: true,
});

// Systems Programmer

// Computer Architect

// Security Engineer

export const SECURITY_FOUNDATIONS: PlannedSection[] = [
  {
    id: "thinking-like-an-attacker",
    title: "Thinking like an attacker",
    items: [
      lesson(
        "threat-models",
        "Threat models",
        "How to decide what you are protecting, from whom and against what, before choosing any defence.",
      ),
      lesson(
        "least-privilege",
        "Least privilege and isolation",
        "Why each program and user should get only the access it needs, and how isolation limits the damage of a breach.",
      ),
      lesson(
        "authentication-and-secrets",
        "Authentication and secrets",
        "How systems check who you are, store passwords as slow salted hashes, and keep keys and tokens out of reach.",
      ),
      lesson(
        "cryptography",
        "Cryptography: what it does and doesn't do",
        "What encryption, hashing and signatures each guarantee, and the common mistakes that break them in practice.",
      ),
    ],
  },
];

export const MEMORY_SAFETY: PlannedSection[] = [
  {
    id: "bugs-and-defences",
    title: "Bugs and defences",
    items: [
      lesson(
        "buffer-overflows",
        "Buffer overflows",
        "How writing past the end of a buffer can overwrite a return address, and how attackers use that to take control.",
      ),
      lesson(
        "use-after-free",
        "Use-after-free and double free",
        "How using memory after it is freed, or freeing it twice, can let an attacker control what the program reads.",
      ),
      lesson(
        "format-strings",
        "Format string bugs",
        "How passing user input as a printf format string lets an attacker read or write memory.",
      ),
      lesson(
        "mitigations",
        "Stack canaries, ASLR and NX",
        "How stack canaries, ASLR and non-executable memory each make memory bugs harder to exploit, and their limits.",
      ),
      lesson(
        "control-flow-integrity",
        "Control-flow integrity",
        "How control-flow integrity checks that indirect jumps, calls and returns only go to targets the program allows.",
      ),
      project(
        "project-exploit-and-fix",
        "Project: Break and fix a toy program",
        "Exploit a memory bug in a small vulnerable program, then fix it, proving you understand both the attack and the defence.",
      ),
    ],
  },
];

export const HARDWARE_TRUST: PlannedSection[] = [
  {
    id: "side-channels",
    title: "When hardware leaks",
    items: [
      lesson(
        "timing-side-channels",
        "Timing side channels",
        "How the time an operation takes can leak secrets like keys, and why constant-time code avoids it.",
      ),
      lesson(
        "spectre-meltdown",
        "Spectre and Meltdown",
        "How speculative execution leaves traces in the cache that leak data, and how Spectre and Meltdown exploit them.",
      ),
      lesson(
        "trusted-execution",
        "Trusted execution and secure boot",
        "How secure boot checks each piece of software before it runs, and how trusted enclaves protect code from the OS.",
      ),
    ],
  },
];

export const RELIABILITY: PlannedSection[] = [
  {
    id: "failing-well",
    title: "Failing well",
    items: [
      lesson(
        "faults-errors-failures",
        "Faults, errors and failures",
        "How a fault becomes an error and then a failure the user sees, and where each one can be caught.",
      ),
      lesson(
        "redundancy",
        "Redundancy and recovery",
        "How spare copies of hardware, data and services let a system keep working or recover after something breaks.",
      ),
      lesson(
        "fuzzing",
        "Fuzzing",
        "How fuzzing feeds a program huge numbers of random and mutated inputs to find crashes and security bugs.",
      ),
      lesson(
        "fail-safely",
        "Writing code that fails safely",
        "How to write code that checks every error, cleans up after itself and stops in a safe state instead of a broken one.",
      ),
    ],
  },
];

// Network Engineer

export const NETWORK_FOUNDATIONS: PlannedSection[] = [
  {
    id: "how-networks-work",
    title: "How networks work",
    items: [
      lesson(
        "what-is-a-network",
        "What a network is",
        "What a network is, how computers send data as packets over shared links, and what switches and routers do.",
      ),
      lesson(
        "layers",
        "Layers: from wires to apps",
        "How networking is split into layers, from signals on a wire up to applications, and what each layer adds.",
      ),
      lesson(
        "ethernet",
        "Ethernet and MAC addresses",
        "How Ethernet sends frames between machines on one local network, and how switches use MAC addresses to deliver them.",
      ),
      lesson(
        "ip-addresses",
        "IP addresses and subnets",
        "How IP addresses identify machines across networks, and how a subnet mask splits an address into network and host.",
      ),
      lesson(
        "routing",
        "Routing: how a packet finds its way",
        "How routers forward a packet hop by hop using routing tables until it reaches the right network.",
      ),
      project(
        "project-trace-a-packet",
        "Project: Trace a packet",
        "Follow one packet from your machine to a server and back, proving you can explain what every layer does to it.",
      ),
    ],
  },
];

export const NETWORK_PROTOCOLS: PlannedSection[] = [
  {
    id: "transport-and-apps",
    title: "Transport and applications",
    items: [
      lesson(
        "udp",
        "UDP",
        "How UDP sends independent datagrams with ports and a checksum, and why fast apps accept that some may be lost.",
      ),
      lesson(
        "tcp",
        "TCP: reliable streams",
        "How TCP builds a reliable, ordered byte stream with a handshake, sequence numbers, acknowledgements and resends.",
      ),
      lesson(
        "congestion-control",
        "TCP congestion control",
        "How TCP senses a crowded network from lost packets and slows down, so many connections can share one link.",
      ),
      lesson(
        "dns",
        "DNS",
        "How DNS turns a name like example.com into an IP address, asking a chain of servers and caching the answer.",
      ),
      lesson(
        "http",
        "HTTP",
        "How a browser and a server talk with HTTP requests and responses, using methods, headers and status codes.",
      ),
      lesson(
        "tls",
        "TLS: encryption in transit",
        "How TLS encrypts a connection and uses certificates to prove the server is who it claims to be.",
      ),
      lesson(
        "sockets",
        "Sockets in C",
        "How a C program opens a socket, connects or listens, and sends and receives bytes over the network.",
      ),
      project(
        "project-http-server",
        "Project: A tiny HTTP server",
        "Build a tiny HTTP server in C with sockets that serves files to a browser, proving you can speak a real protocol.",
      ),
    ],
  },
];

export const NETWORK_OPS: PlannedSection[] = [
  {
    id: "running-networks",
    title: "Running networks",
    items: [
      lesson(
        "ping-traceroute-dig",
        "ping, traceroute and dig",
        "How to test whether a host is reachable, see the path packets take and check DNS answers from the command line.",
      ),
      lesson(
        "packet-capture",
        "Reading packets with Wireshark and tcpdump",
        "How to capture the packets on a network with tcpdump and read them in Wireshark, layer by layer.",
      ),
      lesson(
        "firewalls-and-nat",
        "Firewalls and NAT",
        "How firewalls decide which packets to allow, and how NAT lets many machines share one public IP address.",
      ),
      lesson(
        "slow-connections",
        "Debugging a slow connection",
        "How to find why a connection is slow, from DNS delays and packet loss to high latency and small TCP windows.",
      ),
      lesson(
        "safe-change",
        "Changing a network safely",
        "How to change a network's configuration without cutting yourself off: plan it, test it and keep a way to roll back.",
      ),
      project(
        "project-diagnose-a-network",
        "Project: Diagnose a broken network",
        "Find and fix the faults in a broken network with ping, traceroute, dig and packet captures, proving you can debug it.",
      ),
    ],
  },
];

/** Lesson and project counts for an outline. */
export function plannedCounts(outline: PlannedSection[]): { lessons: number; projects: number } {
  const items = outline.flatMap((s) => s.items);
  const projects = items.filter((i) => i.project).length;
  return { lessons: items.length - projects, projects };
}
