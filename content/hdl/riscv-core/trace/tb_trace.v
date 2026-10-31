// The first instructions the core runs: the pc, the instruction word, and what it writes.
module tb;
    reg clk = 0, rst = 1;
    reg [31:0] mem [0:4095];
    wire [31:0] pc, addr, wdata;
    wire [31:0] instr = mem[pc[13:2]];
    wire we;
    core cpu (.clk(clk), .rst(rst), .mem_addr(addr), .mem_wdata(wdata), .mem_we(we),
              .mem_rdata(mem[addr[13:2]]), .pc_out(pc), .instr(instr));

    integer cycle = 0;
    initial begin
        $readmemh("program.hex", mem);
        #2 rst = 0;
    end
    always #1 clk = ~clk;

    // Mid-cycle, before the clock edge: the instruction being executed and the value it is about to write.
    always @(negedge clk) if (!rst) begin
        cycle = cycle + 1;
        if (cpu.write_rd && cpu.rd != 0)
            $display("%2d  pc=%04h  %08h  x%0d <= %0d", cycle, pc, instr, cpu.rd, $signed(cpu.result));
        else if (we)
            $display("%2d  pc=%04h  %08h  mem[%04h] <= %0d", cycle, pc, instr, addr, $signed(wdata));
        else
            $display("%2d  pc=%04h  %08h", cycle, pc, instr);
        if (cycle == 12) $finish;
    end
    always @(posedge clk) if (!rst && we) mem[addr[13:2]] <= wdata;
endmodule
