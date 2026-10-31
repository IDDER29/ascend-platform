// A single-cycle RV32I core: every instruction is fetched, decoded, executed and written back in one
// clock cycle. It runs the base integer instructions gcc emits for -march=rv32i (no FENCE, ECALL or
// CSRs), with one 16 KiB memory for code and data, word-aligned loads and stores.
module core (
    input             clk,
    input             rst,
    output reg [31:0] mem_addr,   // the data address of this cycle's load or store
    output reg [31:0] mem_wdata,
    output reg        mem_we,
    input      [31:0] mem_rdata,  // the word at mem_addr (memory reads are combinational)
    output     [31:0] pc_out,
    input      [31:0] instr       // the word at pc_out
);
    reg  [31:0] pc;
    reg  [31:0] x [0:31];         // the registers; x[0] is never written, so it stays 0
    assign pc_out = pc;

    // Decode: the fields every format shares, and the five kinds of immediate.
    wire [6:0]  opcode = instr[6:0];
    wire [4:0]  rd     = instr[11:7];
    wire [2:0]  funct3 = instr[14:12];
    wire [4:0]  rs1    = instr[19:15];
    wire [4:0]  rs2    = instr[24:20];
    wire [6:0]  funct7 = instr[31:25];
    wire [31:0] imm_i  = {{20{instr[31]}}, instr[31:20]};
    wire [31:0] imm_s  = {{20{instr[31]}}, instr[31:25], instr[11:7]};
    wire [31:0] imm_b  = {{19{instr[31]}}, instr[31], instr[7], instr[30:25], instr[11:8], 1'b0};
    wire [31:0] imm_u  = {instr[31:12], 12'b0};
    wire [31:0] imm_j  = {{11{instr[31]}}, instr[31], instr[19:12], instr[20], instr[30:21], 1'b0};

    wire [31:0] a = (rs1 == 0) ? 32'd0 : x[rs1];
    wire [31:0] b = (rs2 == 0) ? 32'd0 : x[rs2];

    // The ALU, shared by register-register and register-immediate instructions.
    function [31:0] alu(input [2:0] f3, input alt, input [31:0] p, input [31:0] q);
        case (f3)
            3'b000: alu = alt ? p - q : p + q;
            3'b001: alu = p << q[4:0];
            3'b010: alu = {31'd0, $signed(p) < $signed(q)};
            3'b011: alu = {31'd0, p < q};
            3'b100: alu = p ^ q;
            3'b101: alu = alt ? $signed($signed(p) >>> q[4:0]) : p >> q[4:0];
            3'b110: alu = p | q;
            default: alu = p & q;
        endcase
    endfunction

    reg [31:0] next_pc, result;
    reg        write_rd, taken;

    always @* begin
        next_pc   = pc + 4;
        result    = 32'd0;
        write_rd  = 1'b0;
        mem_we    = 1'b0;
        mem_addr  = 32'd0;
        mem_wdata = 32'd0;
        taken     = 1'b0;
        case (opcode)
            7'b0110111: begin result = imm_u; write_rd = 1; end                       // LUI
            7'b0010111: begin result = pc + imm_u; write_rd = 1; end                  // AUIPC
            7'b1101111: begin result = pc + 4; write_rd = 1; next_pc = pc + imm_j; end // JAL
            7'b1100111: begin result = pc + 4; write_rd = 1; next_pc = (a + imm_i) & ~32'd1; end // JALR
            7'b1100011: begin                                                         // branches
                case (funct3)
                    3'b000: taken = a == b;
                    3'b001: taken = a != b;
                    3'b100: taken = $signed(a) < $signed(b);
                    3'b101: taken = $signed(a) >= $signed(b);
                    3'b110: taken = a < b;
                    3'b111: taken = a >= b;
                    default: taken = 1'b0;
                endcase
                if (taken) next_pc = pc + imm_b;
            end
            7'b0000011: begin mem_addr = a + imm_i; result = mem_rdata; write_rd = 1; end // LW
            7'b0100011: begin mem_addr = a + imm_s; mem_wdata = b; mem_we = 1; end        // SW
            7'b0010011: begin                                                              // ALU with an immediate
                // Only the shifts use bit 30 to choose (SRAI); for ADDI it's part of the immediate.
                result = alu(funct3, 1'b0, a, imm_i);
                write_rd = 1;
            end
            7'b0110011: begin result = alu(funct3, funct7[5], a, b); write_rd = 1; end      // ALU, two registers
            default: ;
        endcase
    end

    integer i;
    always @(posedge clk) begin
        if (rst) begin
            pc <= 32'd0;
            for (i = 0; i < 32; i = i + 1) x[i] <= 32'd0;
        end else begin
            pc <= next_pc;
            if (write_rd && rd != 0) x[rd] <= result;
        end
    end
endmodule
