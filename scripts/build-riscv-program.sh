#!/usr/bin/env bash
# Compile a design folder's program.c (with start.S and link.ld) for RV32I, and write program.hex for
# $readmemh: one 32-bit word per line, padded to the testbench's 4096-word memory.
#   scripts/build-riscv-program.sh content/hdl/riscv-core/sum
# Uses riscv64-unknown-elf-gcc from PATH, or from $ASCEND_TOOLS_ROOT/usr/bin (unpacked Ubuntu packages).
set -euo pipefail
dir="$1"
bin="${ASCEND_TOOLS_ROOT:+$ASCEND_TOOLS_ROOT/usr/bin/}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
"${bin}riscv64-unknown-elf-gcc" -march=rv32i -mabi=ilp32 -O2 -ffreestanding -nostdlib \
  -T "$dir/link.ld" "$dir/start.S" "$dir/program.c" -lgcc -Wl,--no-warn-rwx-segments -o "$tmp/prog.elf"
"${bin}riscv64-unknown-elf-objcopy" -O binary "$tmp/prog.elf" "$tmp/prog.bin"
python3 - "$tmp/prog.bin" "$dir/program.hex" <<'PY'
import struct, sys
b = open(sys.argv[1], "rb").read()
b += b"\0" * ((-len(b)) % 4)
words = list(struct.unpack("<%dI" % (len(b) // 4), b))
if len(words) > 4096:
    sys.exit("program too large for the 16 KiB memory")
words += [0] * (4096 - len(words))
open(sys.argv[2], "w").write("\n".join("%08x" % w for w in words) + "\n")
PY
"${bin}riscv64-unknown-elf-objdump" -d "$tmp/prog.elf" | sed "s|$tmp/||" > "$dir/program.lst"
echo "$dir: $(grep -c '^ *[0-9a-f]*:' "$dir/program.lst") instructions"
