// An 8-bit ALU: eight operations, chosen by op, with zero and carry flags.
module alu (
    input  [7:0] a,
    input  [7:0] b,
    input  [2:0] op,
    output reg [7:0] y,
    output zero,
    output reg carry
);
    localparam ADD = 3'd0, SUB = 3'd1, AND = 3'd2, OR = 3'd3,
               XOR = 3'd4, SLT = 3'd5, SHL = 3'd6, SHR = 3'd7;

    always @* begin
        carry = 1'b0;
        case (op)
            ADD: {carry, y} = {1'b0, a} + {1'b0, b};
            SUB: {carry, y} = {1'b0, a} - {1'b0, b};   // carry = 1 means a borrow
            AND: y = a & b;
            OR:  y = a | b;
            XOR: y = a ^ b;
            SLT: y = {7'd0, a < b};                      // set if a < b
            SHL: y = a << b[2:0];
            SHR: y = a >> b[2:0];
            default: y = 8'd0;
        endcase
    end

    assign zero = (y == 8'd0);
endmodule
