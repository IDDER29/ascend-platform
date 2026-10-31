// Runs program.hex on the core. A store to address 0xFFF0 prints a number; a store to 0xFFF4 stops.
module tb;
    reg clk = 0, rst = 1;
    reg [31:0] mem [0:4095];                 // 16 KiB: code from 0, data and stack above it
    wire [31:0] pc, addr, wdata;
    wire [31:0] instr = mem[pc[13:2]];
    wire we;
    core cpu (.clk(clk), .rst(rst), .mem_addr(addr), .mem_wdata(wdata), .mem_we(we),
              .mem_rdata(mem[addr[13:2]]), .pc_out(pc), .instr(instr));

    integer cycles = 0;
    initial begin
        $readmemh("program.hex", mem);
        #2 rst = 0;
    end
    always #1 clk = ~clk;

    always @(posedge clk) if (!rst) begin
        cycles = cycles + 1;
        if (we && addr == 32'hFFF0) $display("out: %0d", $signed(wdata));
        else if (we && addr == 32'hFFF4) begin
            $display("stopped after %0d cycles", cycles);
            $finish;
        end else if (we) mem[addr[13:2]] <= wdata;
        if (cycles > 200000) begin
            $display("still running after %0d cycles: stopped", cycles);
            $finish;
        end
    end
endmodule
