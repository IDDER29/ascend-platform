// The ALU between registers, as it sits inside a CPU: inputs captured on one clock edge, the result
// on the next. Now the tools can report how fast the clock may run.
module alu_clocked (
    input clk,
    input [7:0] a_in, b_in,
    input [2:0] op_in,
    output reg [7:0] y_out,
    output reg zero_out, carry_out
);
    reg [7:0] a, b;
    reg [2:0] op;
    wire [7:0] y;
    wire zero, carry;
    alu core (.a(a), .b(b), .op(op), .y(y), .zero(zero), .carry(carry));

    always @(posedge clk) begin
        a <= a_in;
        b <= b_in;
        op <= op_in;
        y_out <= y;
        zero_out <= zero;
        carry_out <= carry;
    end
endmodule
